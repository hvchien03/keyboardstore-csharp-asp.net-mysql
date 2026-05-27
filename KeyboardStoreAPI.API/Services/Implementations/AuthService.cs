using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using KeyboardStoreAPI.API.DTOs.Auth;
using KeyboardStoreAPI.API.Exceptions;
using KeyboardStoreAPI.API.Models;
using KeyboardStoreAPI.API.Repositories.Interfaces;
using KeyboardStoreAPI.API.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace KeyboardStoreAPI.API.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly IEmailService _emailService;

        public AuthService(
            IUserRepository userRepository,
            IConfiguration configuration,
            IRefreshTokenRepository refreshTokenRepository,
            IEmailService emailService)
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _refreshTokenRepository = refreshTokenRepository;
            _emailService = emailService;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            if (await _userRepository.ExistsByEmailAsync(dto.Email))
            {
                throw new BadRequestException("Email already exists");
            }

            if (dto.Password != dto.ConfirmPassword)
            {
                throw new BadRequestException("Passwords do not match");
            }

            if (dto.Password.Length < 6)
            {
                throw new BadRequestException("Password must be at least 6 characters");
            }

            var verificationToken = GenerateSecureToken();
            var user = new User
            {
                Email = dto.Email.Trim(),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "User",
                IsEmailVerified = false,
                EmailVerificationTokenHash = HashToken(verificationToken),
                EmailVerificationTokenExpiresAt = DateTime.UtcNow.AddHours(24),
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.CreateAsync(user);

            var verificationLink = BuildEmailVerificationLink(user.Email, verificationToken);
            await _emailService.SendEmailVerificationAsync(user.Email, verificationLink);

            return new AuthResponseDto
            {
                Email = user.Email,
                Role = user.Role,
                IsEmailVerified = user.IsEmailVerified,
                RequiresEmailVerification = true,
                Message = "Registration successful. Please check your email to verify your account."
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var user = await _userRepository.GetByEmailAsync(dto.Email);
            if (user == null)
            {
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException("Invalid email or password");
            }

            if (!user.IsEmailVerified)
            {
                throw new UnauthorizedAccessException("Please verify your email before logging in");
            }

            var token = GenerateJwtToken(user);
            var refreshToken = await GenerateRefreshToken(user.Id);
            var expiresAt = DateTime.UtcNow.AddMinutes(
                int.Parse(_configuration["JwtSettings:ExpiryMinutes"]!));

            return new AuthResponseDto
            {
                Token = token,
                RefreshToken = refreshToken,
                Email = user.Email,
                Role = user.Role,
                IsEmailVerified = user.IsEmailVerified,
                ExpiresAt = expiresAt
            };
        }

        public async Task<bool> VerifyEmailAsync(string email, string token)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
            {
                throw new BadRequestException("Invalid verification link");
            }

            if (user.IsEmailVerified)
            {
                return true;
            }

            if (string.IsNullOrWhiteSpace(user.EmailVerificationTokenHash)
                || !user.EmailVerificationTokenExpiresAt.HasValue
                || user.EmailVerificationTokenExpiresAt.Value < DateTime.UtcNow)
            {
                throw new BadRequestException("Verification link has expired");
            }

            if (user.EmailVerificationTokenHash != HashToken(token))
            {
                throw new BadRequestException("Invalid verification link");
            }

            user.IsEmailVerified = true;
            user.EmailVerifiedAt = DateTime.UtcNow;
            user.EmailVerificationTokenHash = null;
            user.EmailVerificationTokenExpiresAt = null;

            await _userRepository.UpdateAsync(user);
            await _emailService.SendWelcomeEmailAsync(user.Email);

            return true;
        }

        public async Task<bool> ResendVerificationEmailAsync(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
            {
                throw new NotFoundException("User not found");
            }

            if (user.IsEmailVerified)
            {
                throw new BadRequestException("Email is already verified");
            }

            var verificationToken = GenerateSecureToken();
            user.EmailVerificationTokenHash = HashToken(verificationToken);
            user.EmailVerificationTokenExpiresAt = DateTime.UtcNow.AddHours(24);

            await _userRepository.UpdateAsync(user);

            var verificationLink = BuildEmailVerificationLink(user.Email, verificationToken);
            await _emailService.SendEmailVerificationAsync(user.Email, verificationLink);

            return true;
        }

        public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken)
        {
            var storedToken = await _refreshTokenRepository.GetByTokenAsync(refreshToken);
            if (storedToken == null)
            {
                throw new UnauthorizedAccessException("Invalid refresh token");
            }

            if (storedToken.IsRevoked)
            {
                throw new UnauthorizedAccessException("Refresh token has been revoked");
            }

            if (storedToken.ExpiresAt < DateTime.UtcNow)
            {
                throw new UnauthorizedAccessException("Refresh token has expired");
            }

            var user = storedToken.User;
            if (!user.IsEmailVerified)
            {
                throw new UnauthorizedAccessException("Please verify your email before refreshing token");
            }

            var newAccessToken = GenerateJwtToken(user);
            var newRefreshToken = await GenerateRefreshToken(user.Id);
            await _refreshTokenRepository.RevokeAsync(refreshToken);

            var expiresAt = DateTime.UtcNow.AddMinutes(
                int.Parse(_configuration["JwtSettings:ExpiryMinutes"]!));

            return new AuthResponseDto
            {
                Token = newAccessToken,
                RefreshToken = newRefreshToken,
                Email = user.Email,
                Role = user.Role,
                IsEmailVerified = user.IsEmailVerified,
                ExpiresAt = expiresAt
            };
        }

        public async Task<bool> RevokeTokenAsync(string refreshToken)
        {
            return await _refreshTokenRepository.RevokeAsync(refreshToken);
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"];
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey!));

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: jwtSettings["Issuer"],
                audience: jwtSettings["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(int.Parse(jwtSettings["ExpiryMinutes"]!)),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string BuildEmailVerificationLink(string email, string token)
        {
            var apiBaseUrl = _configuration["AppSettings:ApiBaseUrl"];
            if (string.IsNullOrWhiteSpace(apiBaseUrl))
            {
                apiBaseUrl = "http://localhost:5143";
            }

            return $"{apiBaseUrl.TrimEnd('/')}/api/Auth/verify-email?email={WebUtility.UrlEncode(email)}&token={WebUtility.UrlEncode(token)}";
        }

        private static string GenerateSecureToken()
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);

            return Convert.ToBase64String(randomBytes);
        }

        private static string HashToken(string token)
        {
            var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(token));
            return Convert.ToHexString(bytes);
        }

        private async Task<string> GenerateRefreshToken(int userId)
        {
            var token = GenerateSecureToken();
            var refreshToken = new RefreshToken
            {
                UserId = userId,
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                CreatedAt = DateTime.UtcNow
            };

            await _refreshTokenRepository.CreateAsync(refreshToken);

            return token;
        }
    }
}
