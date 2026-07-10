# Multi-stage Dockerfile cho ASP.NET Core 8.0 Web API
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Sao chép tệp csproj và restore dependencies
COPY ["KeyboardStoreAPI.API/KeyboardStoreAPI.API.csproj", "KeyboardStoreAPI.API/"]
RUN dotnet restore "KeyboardStoreAPI.API/KeyboardStoreAPI.API.csproj"

# Sao chép toàn bộ mã nguồn backend và build
COPY KeyboardStoreAPI.API/ KeyboardStoreAPI.API/
WORKDIR "/src/KeyboardStoreAPI.API"
RUN dotnet build "KeyboardStoreAPI.API.csproj" -c Release -o /app/build

# Publish ứng dụng
FROM build AS publish
RUN dotnet publish "KeyboardStoreAPI.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Sử dụng ASP.NET Core runtime image làm môi trường chạy sản phẩm
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Tạo thư mục cho uploads và logs nếu chưa có
RUN mkdir -p wwwroot/uploads Logs

# Mở cổng 8080 cho container
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "KeyboardStoreAPI.API.dll"]
