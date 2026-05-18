# Local Secrets Setup

`appsettings.json` khong chua secret that. Khi chay local, dung .NET user-secrets hoac environment variables.

Tu thu muc `KeyboardStoreAPI` chay:

```bash
dotnet user-secrets init --project .\KeyboardStoreAPI.API\KeyboardStoreAPI.API.csproj

dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Database=KeyboardStoreDB;User=root;Password=YOUR_DB_PASSWORD;" --project .\KeyboardStoreAPI.API\KeyboardStoreAPI.API.csproj
dotnet user-secrets set "JwtSettings:SecretKey" "YOUR_AT_LEAST_32_CHARACTERS_SECRET_KEY" --project .\KeyboardStoreAPI.API\KeyboardStoreAPI.API.csproj

dotnet user-secrets set "EmailSettings:SenderEmail" "YOUR_EMAIL" --project .\KeyboardStoreAPI.API\KeyboardStoreAPI.API.csproj
dotnet user-secrets set "EmailSettings:Username" "YOUR_EMAIL" --project .\KeyboardStoreAPI.API\KeyboardStoreAPI.API.csproj
dotnet user-secrets set "EmailSettings:Password" "YOUR_APP_PASSWORD" --project .\KeyboardStoreAPI.API\KeyboardStoreAPI.API.csproj

dotnet user-secrets set "VNPaySettings:TmnCode" "YOUR_VNPAY_TMN_CODE" --project .\KeyboardStoreAPI.API\KeyboardStoreAPI.API.csproj
dotnet user-secrets set "VNPaySettings:HashSecret" "YOUR_VNPAY_HASH_SECRET" --project .\KeyboardStoreAPI.API\KeyboardStoreAPI.API.csproj
```

Khong commit secret that vao repo.
