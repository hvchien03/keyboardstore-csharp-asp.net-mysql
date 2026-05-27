# Keyboard Store API

Backend Web API cho website ban ban phim co. Project duoc xay dung bang ASP.NET Core Web API, Entity Framework Core, MySQL, Redis cache, JWT authentication va tich hop VNPay.

## Cong Nghe Su Dung

- ASP.NET Core 8
- Entity Framework Core
- MySQL voi Pomelo.EntityFrameworkCore.MySql
- Redis cache
- JWT Bearer Authentication
- Swagger / OpenAPI
- AutoMapper
- BCrypt password hashing
- MailKit / MimeKit
- VNPay sandbox payment
- Serilog logging

## Chuc Nang Chinh

- Dang ky, dang nhap, refresh token va logout
- Xac minh email bang verification link khi dang ky
- Phan quyen User / Admin bang JWT
- Quan ly san pham
- Tim kiem, loc va phan trang san pham theo keyword, category, brand, switch type, layout, gia va ton kho
- Quan ly danh muc san pham
- Quan ly brand, switch type va layout ban phim
- Quan ly nhieu hinh anh cho moi san pham
- Gio hang va checkout
- Tao don hang va xem lich su don hang
- Admin xem, loc va cap nhat trang thai don hang
- Cap nhat profile nguoi dung va doi mat khau
- Upload nhieu anh san pham qua Product API
- Thanh toan VNPay, return URL va IPN
- Gui email chao mung va email xac nhan don hang
- Cache san pham bang Redis
- Seed du lieu mau khi khoi dong

## Cau Truc Project

```text
KeyboardStoreAPI.API/
  Constants/       Hang so trang thai don hang, thanh toan
  Controllers/     API endpoints
  Data/            DbContext va seed orchestration
  Data/Seeders/    Seed data theo nhom
  DTOs/            Request/response models
  Exceptions/      Custom exceptions
  Middlewares/     Global exception middleware
  Migrations/      EF Core migrations
  Models/          Shared response models
  Models/Entities/ EF entities
  Models/QueryParams/ Query/filter/pagination params
  Repositories/    Data access layer
  Services/        Business logic layer
  Templates/Email/ Email templates
```

## API Tong Quan

### Auth

- `POST /api/Auth/register`
- `GET /api/Auth/verify-email`
- `POST /api/Auth/resend-verification-email`
- `POST /api/Auth/login`
- `POST /api/Auth/refresh-token`
- `POST /api/Auth/logout`

### Products

- `GET /api/Product`
- `GET /api/Product/paged`
- `GET /api/Product/search`
- `GET /api/Product/without-images` - Admin
- `GET /api/Product/{id}`
- `POST /api/Product` - Admin
- `PUT /api/Product/{id}` - Admin
- `POST /api/Product/{id}/images` - Admin
- `DELETE /api/Product/{id}/images/{imageId}` - Admin
- `DELETE /api/Product/{id}` - Admin

### Categories

- `GET /api/Category`
- `GET /api/Category/{id}`
- `POST /api/Category` - Admin
- `PUT /api/Category/{id}` - Admin
- `DELETE /api/Category/{id}` - Admin

### Brands

- `GET /api/Brand`
- `GET /api/Brand/{id}`
- `POST /api/Brand` - Admin
- `PUT /api/Brand/{id}` - Admin
- `DELETE /api/Brand/{id}` - Admin

### Switch Types

- `GET /api/SwitchType`
- `GET /api/SwitchType/{id}`
- `POST /api/SwitchType` - Admin
- `PUT /api/SwitchType/{id}` - Admin
- `DELETE /api/SwitchType/{id}` - Admin

### Layouts

- `GET /api/Layout`
- `GET /api/Layout/{id}`
- `POST /api/Layout` - Admin
- `PUT /api/Layout/{id}` - Admin
- `DELETE /api/Layout/{id}` - Admin

### Cart

- `GET /api/Cart`
- `POST /api/Cart/items`
- `PUT /api/Cart/items/{productId}`
- `DELETE /api/Cart/items/{productId}`
- `DELETE /api/Cart/clear`
- `POST /api/Cart/checkout`

### Orders

- `POST /api/Order`
- `GET /api/Order/{id}`
- `GET /api/Order/my-orders`
- `GET /api/Order/admin` - Admin
- `GET /api/Order/admin/paged` - Admin
- `GET /api/Order/admin/{id}` - Admin
- `PATCH /api/Order/{id}/status` - Admin

### Users

- `GET /api/User/me`
- `PUT /api/User/me`
- `PUT /api/User/me/password`
- `GET /api/User` - Admin
- `GET /api/User/{id}` - Admin
- `PUT /api/User/{id}/role` - Admin

### Payment

- `POST /api/Payment/create-vnpay-payment`
- `GET /api/Payment/vnpay-return`
- `GET /api/Payment/vnpay-ipn`
- `GET /api/Payment/check-payment-status/{orderId}`

### Product Images

Product image khong con duoc gui trong create/update product. Flow hien tai:

1. Tao product bang `POST /api/Product`.
2. Them mot hoac nhieu anh bang `POST /api/Product/{id}/images`.
3. Xoa anh bang `DELETE /api/Product/{id}/images/{imageId}`.

Upload images dung `multipart/form-data` voi key:

```text
files
```

File hop le:

- `.jpg`
- `.jpeg`
- `.png`
- `.webp`

Dung luong toi da moi file: `5MB`.

Anh duoc luu tai:

```text
KeyboardStoreAPI.API/wwwroot/uploads/products/
```

Va duoc tra ve qua static file URL:

```text
/uploads/products/{file-name}
```

## Yeu Cau Cai Dat

- .NET SDK 8
- MySQL
- Redis
- Git


Redis mac dinh dang cau hinh la:

```json
"Redis": "localhost:6379"
```

## Chay Project

Restore packages:

```powershell
dotnet restore
```

Cap nhat database:

```powershell
dotnet ef database update --project .\KeyboardStoreAPI.API\KeyboardStoreAPI.API.csproj
```

Chay API:

```powershell
dotnet run --project .\KeyboardStoreAPI.API\KeyboardStoreAPI.API.csproj
```

Mo Swagger trong moi truong Development:

```text
http://localhost:5143/swagger
```

Port co the thay doi tuy theo `Properties/launchSettings.json`.

## Tai Khoan Seed Mau

Khi database chua co du lieu, project se seed:

- Admin: `admin@keyboardstore.com`
- Password: `Admin@123`

Project cung seed mot so category va product mau.

Seed data hien co gom:

- Categories
- Brands
- Switch types
- Layouts
- Admin user
- Sample products kem product images

## Roadmap Goi Y

- Review va rating san pham
- Wishlist
- Voucher / discount
- Order tracking
- Admin dashboard
- AI chatbot tu van san pham
