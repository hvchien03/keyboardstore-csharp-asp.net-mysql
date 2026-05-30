# Keyboard Store API

Backend ASP.NET Core Web API cho website ban ban phim co. Project dang dung MySQL, Redis cache, JWT authentication, email verification va VNPay sandbox.

Repository nay gom 2 phan:

- `KeyboardStoreAPI.API`: backend ASP.NET Core Web API.
- `fe`: frontend Next.js cho customer site va admin UI.

## Tech Stack

### Backend

- .NET 8 / ASP.NET Core Web API
- Entity Framework Core + Pomelo MySQL
- MySQL
- Redis cache
- JWT Bearer Authentication
- BCrypt password hashing
- MailKit / MimeKit
- VNPay sandbox payment
- Serilog logging
- Swagger / OpenAPI

### Frontend

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- React Hook Form + Zod
- TanStack Query
- Lucide React icons
- Sonner toast

## Main Features

- Auth: register, email verification link, login, refresh token, logout
- Role-based authorization: `User`, `Admin`
- Product CRUD with category, brand, switch type, layout and multiple images
- Product search/filter/pagination
- Admin lookup management: Category, Brand, SwitchType, Layout
- Cart management and COD checkout
- VNPay checkout, return callback, IPN and payment status check
- Order history for users
- Admin order listing, filtering and status update
- User profile and password update
- Email notifications for verification, welcome, order confirmation and payment success
- Redis cache for product list/detail
- Seed data for local development

## Project Structure

```text
KeyboardStoreAPI.API/
  Constants/           Shared status/payment constants
  Controllers/         HTTP API endpoints
  Data/                DbContext and seed orchestration
  Data/Seeders/        Seed data grouped by domain
  DTOs/                Request/response DTOs
  Exceptions/          Custom exceptions
  Middlewares/         Global exception middleware
  Migrations/          EF Core migrations
  Models/              Shared models such as PagedResult/ErrorResponse
  Models/Entities/     EF entities
  Models/QueryParams/  Query/filter/pagination params
  Repositories/        Data access layer
  Services/            Business logic layer
  Services/Payment/    VNPay helper library
  Templates/Email/     HTML email templates
  wwwroot/uploads/     Runtime upload folder, ignored by Git

fe/
  public/              Static frontend assets
  src/app/             Next.js App Router pages and route handlers
  src/components/      Shared UI, layout, product, cart and admin components
  src/lib/             API clients, formatters, validators
  src/types/           Shared frontend TypeScript types
```

Main frontend routes:

```text
/
/products
/categories
/cart
/checkout
/login
/register
/verify-email
/verify-email-pending
/payment/success
/payment/failed
/account
/admin
```

## API Overview

### Auth

- `POST /api/Auth/register`
- `GET /api/Auth/verify-email?email={email}&token={token}`
- `POST /api/Auth/resend-verification-email`
- `POST /api/Auth/login`
- `POST /api/Auth/refresh-token`
- `POST /api/Auth/logout`

Register creates an unverified user and sends a verification link. Users must verify email before login.

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

Product images are managed after product creation. Create/update product does not receive image data.

Supported product filters:

- `keyword`
- `categoryId`
- `brandId`
- `switchTypeId`
- `layoutId`
- `minPrice`
- `maxPrice`
- `inStock`
- `sortBy`
- `page`
- `pageSize`

Supported `sortBy` values:

- `price_asc`
- `price_desc`
- `name`
- `oldest`

### Product Images

Add one or many product images:

```http
POST /api/Product/{id}/images
Content-Type: multipart/form-data
```

Form key:

```text
files
```

Allowed file types:

- `.jpg`
- `.jpeg`
- `.png`
- `.webp`

Max file size: `5MB`.

Images are saved under:

```text
KeyboardStoreAPI.API/wwwroot/uploads/products/
```

Static URL example:

```text
/uploads/products/{file-name}
```

Delete an image:

```http
DELETE /api/Product/{id}/images/{imageId}
```

The API deletes both the `ProductImages` row and the local uploaded file when the image URL points to `/uploads/products/...`.

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

COD checkout clears the cart after order creation.

For VNPay orders, paid products are removed from cart after successful payment. The API also self-cleans paid cart items when `GET /api/Cart` or `GET /api/Payment/check-payment-status/{orderId}` is called.

### Orders

- `POST /api/Order`
- `GET /api/Order/{id}`
- `GET /api/Order/my-orders`
- `GET /api/Order/admin` - Admin
- `GET /api/Order/admin/paged` - Admin
- `GET /api/Order/admin/{id}` - Admin
- `PATCH /api/Order/{id}/status` - Admin

Order statuses:

- `Pending`
- `Pending Payment`
- `Processing`
- `Shipped`
- `Completed`
- `Cancelled`

Admin can manually update operational order status. VNPay success sets payment status to `Paid` and order status to `Pending`, so admin can decide when to move it to `Processing`.

### Payment

- `POST /api/Payment/create-vnpay-payment`
- `GET /api/Payment/vnpay-return`
- `GET /api/Payment/vnpay-ipn`
- `GET /api/Payment/check-payment-status/{orderId}`

Payment methods:

- `COD`
- `VNPay`

Payment statuses:

- `Unpaid`
- `Paid`
- `Failed`

VNPay flow:

1. Frontend calls `POST /api/Payment/create-vnpay-payment`.
2. API creates an order with `Pending Payment` + `Unpaid`.
3. User pays on VNPay sandbox.
4. VNPay callback validates signature and amount.
5. On success, order becomes `Pending` + `Paid`.
6. Paid products are removed from cart.

### Users

- `GET /api/User/me`
- `PUT /api/User/me`
- `PUT /api/User/me/password`
- `GET /api/User` - Admin
- `GET /api/User/{id}` - Admin
- `PUT /api/User/{id}/role` - Admin

## Requirements

- .NET SDK 8
- Node.js
- npm
- MySQL
- Redis
- Git
- `dotnet-ef` tool for migrations

## Local Configuration

### Backend

Do not store real secrets in `appsettings.json`.

Set these values through .NET user-secrets or environment variables:

- `ConnectionStrings:DefaultConnection`
- `ConnectionStrings:Redis`
- `JwtSettings:SecretKey`
- `EmailSettings:SenderEmail`
- `EmailSettings:Username`
- `EmailSettings:Password`
- `VNPaySettings:TmnCode`
- `VNPaySettings:HashSecret`

Default Redis config:

```json
"Redis": "localhost:6379"
```

Email verification links use:

```json
"AppSettings": {
  "ApiBaseUrl": "http://localhost:5143"
}
```

Update this value if your API runs on another port.

### Frontend

Create frontend env file:

```powershell
Copy-Item .\fe\.env.example .\fe\.env.local
```

Current frontend env values:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
API_BASE_URL=http://localhost:5143
NEXT_PUBLIC_API_ASSET_URL=http://localhost:5143

AUTH_COOKIE_NAME=keyboard_access_token
REFRESH_COOKIE_NAME=keyboard_refresh_token
AUTH_COOKIE_SECURE=false

NEXT_PUBLIC_ENABLE_VNPAY=true
```

Notes:

- `API_BASE_URL` is used by server-side frontend code to call the backend.
- `NEXT_PUBLIC_API_ASSET_URL` is used to resolve uploaded product image URLs such as `/uploads/products/...`.
- `AUTH_COOKIE_SECURE=false` is for local HTTP. Use `true` behind HTTPS.

## Run Backend Locally

Restore packages:

```powershell
dotnet restore
```

Apply migrations:

```powershell
dotnet ef database update --project .\KeyboardStoreAPI.API\KeyboardStoreAPI.API.csproj
```

Run API:

```powershell
dotnet run --project .\KeyboardStoreAPI.API\KeyboardStoreAPI.API.csproj
```

Swagger in Development:

```text
http://localhost:5143/swagger
```

The port is configured in:

```text
KeyboardStoreAPI.API/Properties/launchSettings.json
```

## Run Frontend Locally

Install dependencies:

```powershell
cd .\fe
npm install
```

Run development server:

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

Useful frontend scripts:

```powershell
npm run dev
npm run build
npm run start
npm run lint
```

For local full-stack development, run backend on `http://localhost:5143` and frontend on `http://localhost:3000`.

## Seed Data

On startup, the API seeds local data when missing:

- Admin user
- Categories
- Brands
- Switch types
- Layouts
- Sample products with product images

Default admin:

```text
admin@keyboardstore.com / Admin@123
```

Seeded admin is email-verified.

## Runtime Files

Uploaded product images are runtime files and should not be committed to Git:

```text
KeyboardStoreAPI.API/wwwroot/uploads/
```

This folder is intended for local/dev storage. In production, prefer object storage such as S3, Cloudinary, Azure Blob, or a persistent server volume.

## Common Notes

- Product price must be a whole VND amount.
- VNPay amount is validated against order total.
- Product list/detail cache is invalidated after product create/update/delete and product image changes.
- If build fails because `KeyboardStoreAPI.API.exe` is locked, stop the running API or build to a temp output:

```powershell
dotnet build .\KeyboardStoreAPI.API\KeyboardStoreAPI.API.csproj -o .\artifacts\build-check
```
