using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using KeyboardStoreAPI.API.DTOs.Auth;
using KeyboardStoreAPI.API.Models;
using KeyboardStoreAPI.API.Repositories.Interfaces;
using KeyboardStoreAPI.API.Services.Interfaces;
using System.Security.Cryptography;
using KeyboardStoreAPI.API.Exceptions;

namespace KeyboardStoreAPI.API.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IConfiguration _configuration;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly IEmailService _emailService;

        public AuthService(IUserRepository userRepository, IConfiguration configuration, IRefreshTokenRepository refreshTokenRepository, IEmailService emailService)
        {
            _userRepository = userRepository;
            _configuration = configuration;
            _refreshTokenRepository = refreshTokenRepository;
            _emailService = emailService;
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
        {
            // Validate email exists
            if (await _userRepository.ExistsByEmailAsync(dto.Email))
            {
                throw new BadRequestException("Email already exists");
            }

            // Validate password match
            if (dto.Password != dto.ConfirmPassword)
            {
                throw new BadRequestException("Passwords do not match");
            }

            // Validate password strength
            if (dto.Password.Length < 6)
            {
                throw new BadRequestException("Password must be at least 6 characters");
            }

            // Hash password
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            // Create user
            var user = new User
            {
                Email = dto.Email,
                PasswordHash = passwordHash,
                Role = "User",
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.CreateAsync(user);

            // Send welcome email
            await _emailService.SendWelcomeEmailAsync(user.Email);

            // Generate JWT token
            var token = GenerateJwtToken(user);
            var refreshToken = await GenerateRefreshToken(user.Id); // THÊM MỚI
            var expiresAt = DateTime.UtcNow.AddMinutes(
                int.Parse(_configuration["JwtSettings:ExpiryMinutes"]!)
            );

            return new AuthResponseDto
            {
                Token = token,
                RefreshToken = refreshToken, // THÊM MỚI
                Email = user.Email,
                Role = user.Role,
                ExpiresAt = expiresAt
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            // Find user by email
            var user = await _userRepository.GetByEmailAsync(dto.Email);
            if (user == null)
            {
                throw new UnauthorizedAccessException ("Invalid email or password");
            }

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                throw new UnauthorizedAccessException ("Invalid email or password");
            }

            // Generate JWT token
            var token = GenerateJwtToken(user);
            var refreshToken = await GenerateRefreshToken(user.Id); // THÊM MỚI

            var expiresAt = DateTime.UtcNow.AddMinutes(
                int.Parse(_configuration["JwtSettings:ExpiryMinutes"]!)
            );

            return new AuthResponseDto
            {
                Token = token,
                RefreshToken = refreshToken, // THÊM MỚI
                Email = user.Email,
                Role = user.Role,
                ExpiresAt = expiresAt
            };
        }

        // THÊM MỚI: Refresh Token
        public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken)
        {
            // 1. Tìm token trong database
            var storedToken = await _refreshTokenRepository.GetByTokenAsync(refreshToken);

            // 2. Validate token
            if (storedToken == null)
            {
                throw new UnauthorizedAccessException ("Invalid refresh token");
            }

            if (storedToken.IsRevoked)
            {
                throw new UnauthorizedAccessException ("Refresh token has been revoked");
            }

            if (storedToken.ExpiresAt < DateTime.UtcNow)
            {
                throw new UnauthorizedAccessException ("Refresh token has expired");
            }

            // 3. Token hợp lệ → Tạo Access Token mới
            var user = storedToken.User;
            var newAccessToken = GenerateJwtToken(user);

            // 4. (Optional) Tạo Refresh Token mới và thu hồi token cũ (Refresh Token Rotation)
            // Tăng bảo mật: mỗi lần refresh, token cũ bị vô hiệu hóa
            var newRefreshToken = await GenerateRefreshToken(user.Id);
            await _refreshTokenRepository.RevokeAsync(refreshToken); // Thu hồi token cũ

            var expiresAt = DateTime.UtcNow.AddMinutes(
                int.Parse(_configuration["JwtSettings:ExpiryMinutes"]!)
            );

            return new AuthResponseDto
            {
                Token = newAccessToken,
                RefreshToken = newRefreshToken,
                Email = user.Email,
                Role = user.Role,
                ExpiresAt = expiresAt
            };
        }

        // THÊM MỚI: Thu hồi Refresh Token (Logout)
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
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // THÊM MỚI: Tạo Refresh Token ngẫu nhiên
        private async Task<string> GenerateRefreshToken(int userId)
        {
            // Tạo chuỗi ngẫu nhiên 64 bytes
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            
            // Convert sang Base64 string
            var token = Convert.ToBase64String(randomBytes);

            // Lưu vào database
            var refreshToken = new RefreshToken
            {
                UserId = userId,
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddDays(7), // Hết hạn sau 7 ngày
                CreatedAt = DateTime.UtcNow
            };

            await _refreshTokenRepository.CreateAsync(refreshToken);

            return token;
        }
    }
}