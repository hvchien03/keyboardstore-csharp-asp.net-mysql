using System.Net;
using System.Text.Json;
using KeyboardStoreAPI.API.Exceptions;
using KeyboardStoreAPI.API.Models;

namespace KeyboardStoreAPI.API.Middlewares
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public GlobalExceptionMiddleware(
            RequestDelegate next,
            ILogger<GlobalExceptionMiddleware> logger,
            IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // Chạy tiếp các middleware khác và controller
                await _next(context);
            }
            catch (Exception exception)
            {
                // Bắt mọi lỗi ở đây
                await HandleExceptionAsync(context, exception);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            // Log lỗi
            _logger.LogError(exception, "An error occurred: {Message}", exception.Message);

            // Xác định status code dựa vào loại exception
            var statusCode = exception switch
            {
                NotFoundException => HttpStatusCode.NotFound, // 404
                BadRequestException => HttpStatusCode.BadRequest, // 400
                UnauthorizedAccessException  => HttpStatusCode.Unauthorized, // 401
                _ => HttpStatusCode.InternalServerError // 500
            };

            // Tạo response
            var response = new ErrorResponse
            {
                StatusCode = (int)statusCode,
                Message = exception.Message,
                Path = context.Request.Path,
                Timestamp = DateTime.UtcNow
            };

            // Chỉ show stack trace trong Development (bảo mật)
            if (_env.IsDevelopment())
            {
                response.Details = exception.StackTrace;
            }

            // Trả về JSON
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            var jsonResponse = JsonSerializer.Serialize(response, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            await context.Response.WriteAsync(jsonResponse);
        }
    }
}