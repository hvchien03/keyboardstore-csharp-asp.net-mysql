namespace KeyboardStoreAPI.API.Data.Seeders
{
    public static class UserSeeder
    {
        public static async Task SeedAsync(ApplicationDbContext context)
        {
            var now = DateTime.UtcNow;

            await SeedUserAsync(
                context,
                email: "admin@keyboardstore.com",
                password: "Admin@123",
                role: "Admin",
                now);

            await SeedUserAsync(
                context,
                email: "demo@keyboardstore.com",
                password: "Demo@123",
                role: "User",
                now);
        }

        private static async Task SeedUserAsync(
            ApplicationDbContext context,
            string email,
            string password,
            string role,
            DateTime now)
        {
            if (context.Users.Any(user => user.Email == email))
            {
                return;
            }

            var user = new User
            {
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Role = role,
                IsEmailVerified = true,
                EmailVerifiedAt = now,
                CreatedAt = now
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();
        }
    }
}
