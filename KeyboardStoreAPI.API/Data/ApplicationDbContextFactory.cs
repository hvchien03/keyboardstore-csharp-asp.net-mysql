using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace KeyboardStoreAPI.API.Data
{
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var projectPath = Directory.GetCurrentDirectory();
            if (!File.Exists(Path.Combine(projectPath, "appsettings.json")))
            {
                projectPath = Path.Combine(projectPath, "KeyboardStoreAPI.API");
            }

            var configuration = new ConfigurationBuilder()
                .SetBasePath(projectPath)
                .AddJsonFile("appsettings.json", optional: true)
                .AddJsonFile("appsettings.Development.json", optional: true)
                .AddUserSecrets<ApplicationDbContextFactory>(optional: true)
                .AddEnvironmentVariables()
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            if (string.IsNullOrWhiteSpace(connectionString))
            {
                connectionString = "server=localhost;database=KeyboardStoreDB;user=root;password=;SslMode=None";
            }

            optionsBuilder.UseMySql(
                connectionString,
                new MySqlServerVersion(new Version(8, 0, 36)));

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}
