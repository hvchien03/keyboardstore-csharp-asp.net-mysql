using System.Text;
using KeyboardStoreAPI.API.Data;
using KeyboardStoreAPI.API.Middlewares;
using KeyboardStoreAPI.API.Repositories.Implementations;
using KeyboardStoreAPI.API.Repositories.Interfaces;
using KeyboardStoreAPI.API.Services.Implementations;
using KeyboardStoreAPI.API.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StackExchange.Redis;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File(
        "Logs/log-.txt",
        rollingInterval: RollingInterval.Day,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss} [{Level}] {Message}{NewLine}{Exception}")
    .CreateLogger();

builder.Host.UseSerilog();

var defaultConnection = GetRequiredConfigurationValue(builder.Configuration, "ConnectionStrings:DefaultConnection");
var redisConnection = GetRequiredConfigurationValue(builder.Configuration, "ConnectionStrings:Redis");
ValidateRequiredConfiguration(builder.Configuration);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(
        defaultConnection,
        new MySqlServerVersion(new Version(8, 0, 36))));

var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = GetRequiredConfigurationValue(builder.Configuration, "JwtSettings:SecretKey");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme. Example: 'Bearer {token}'"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IBrandRepository, BrandRepository>();
builder.Services.AddScoped<ISwitchTypeRepository, SwitchTypeRepository>();
builder.Services.AddScoped<ILayoutRepository, LayoutRepository>();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUploadService, UploadService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<ICacheService, CacheService>();
builder.Services.AddScoped<IBrandService, BrandService>();
builder.Services.AddScoped<ISwitchTypeService, SwitchTypeService>();
builder.Services.AddScoped<ILayoutService, LayoutService>();

builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = redisConnection;
    options.InstanceName = "KeyboardStore_";
});

builder.Services.AddSingleton<IConnectionMultiplexer>(_ =>
    ConnectionMultiplexer.Connect(redisConnection));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        await DbInitializer.SeedAsync(context);
    }
    catch (Exception exception)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(exception, "An error occurred while seeding the database.");
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseStaticFiles();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();

static void ValidateRequiredConfiguration(IConfiguration configuration)
{
    var requiredKeys = new[]
    {
        "EmailSettings:SenderEmail",
        "EmailSettings:Username",
        "EmailSettings:Password",
        "VNPaySettings:TmnCode",
        "VNPaySettings:HashSecret"
    };

    foreach (var key in requiredKeys)
    {
        GetRequiredConfigurationValue(configuration, key);
    }
}

static string GetRequiredConfigurationValue(IConfiguration configuration, string key)
{
    var value = configuration[key];

    if (string.IsNullOrWhiteSpace(value))
    {
        throw new InvalidOperationException($"Configuration value '{key}' is missing");
    }

    return value;
}
