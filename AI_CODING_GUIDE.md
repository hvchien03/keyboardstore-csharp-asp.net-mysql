# AI Coding Guide - KeyboardStoreAPI

File nay la quy chuan lam viec cho AI coding assistant khi sua project `KeyboardStoreAPI`.
Truoc khi code, hay doc file nay, sau do doc cac file lien quan trong project.

## Muc tieu project

`KeyboardStoreAPI` la backend ASP.NET Core Web API cho web ban ban phim.

Chuc nang muc 1 da co:
- Auth: register, login, refresh token, logout.
- Product CRUD, search/filter/sort/pagination.
- Category CRUD.
- Cart API.
- Checkout COD tu cart.
- Order user: tao don, xem don, xem don cua toi.
- Order admin: xem tat ca don, phan trang/filter, xem chi tiet, cap nhat status.
- Payment VNPay: tao URL thanh toan, return callback, IPN, check payment status.
- Email notifications.
- Product image upload.
- User/profile API.

## Stack chinh

- .NET 8 / ASP.NET Core Web API.
- Entity Framework Core + Pomelo MySQL.
- MySQL database: `KeyboardStoreDB`.
- Redis cache cho product.
- JWT Bearer authentication.
- BCrypt password hashing.
- VNPay sandbox payment.
- MailKit/MimeKit email.
- Serilog logging.
- Swagger/OpenAPI.

## Cau truc thu muc

- `Controllers/`: endpoint HTTP.
- `Services/Interfaces/`: service contracts.
- `Services/Implementations/`: business logic.
- `Repositories/Interfaces/`: repository contracts.
- `Repositories/Implementations/`: database queries.
- `Models/`: EF entities va shared request params.
- `DTOs/`: request/response DTO theo feature.
- `Constants/`: magic strings dung chung, nhu order/payment status.
- `Data/ApplicationDbContext.cs`: DbContext va EF mapping.
- `Data/DbInitializer.cs`: seed data.
- `Migrations/`: EF migrations.
- `Middlewares/GlobalExceptionMiddleware.cs`: format loi API.
- `Templates/Email/`: email HTML templates.
- `Logs/`: log runtime.

## Quy tac code

1. Giu style don gian, de doc, phu hop junior.
2. Khong over-engineer hoac them abstraction khi chua can.
3. Controller chi nhan request, lay user id neu can, goi service, tra response.
4. Business logic dat trong service.
5. Query database dat trong repository.
6. Khong dat DTO long trong controller.
7. Khong hard-code status/payment method rai rac; dung `Constants/`.
8. Voi API can dang nhap, dung `[Authorize]`.
9. Voi API admin, dung `[Authorize(Roles = "Admin")]`.
10. Khong tra `PasswordHash`, refresh token entity, hoac du lieu nhay cam trong response.
11. Neu them bang/cot moi, phai them migration.
12. Neu them service/repository moi, phai dang ky DI trong `Program.cs`.
13. Neu them upload/static files, dam bao `app.UseStaticFiles()` con ton tai.
14. Build kiem tra sau khi sua code.

## Quy tac API

Route hien tai dung dang singular controller mac dinh:
- `api/Auth`
- `api/Product`
- `api/Category`
- `api/Cart`
- `api/Order`
- `api/Payment`
- `api/User`
- `api/Upload`

Khi them API moi, uu tien route de doc:
- `GET /api/Feature`
- `GET /api/Feature/{id}`
- `POST /api/Feature`
- `PUT /api/Feature/{id}`
- `PATCH /api/Feature/{id}/status`
- `DELETE /api/Feature/{id}`

Response nen dung DTO, khong tra thang entity neu entity co navigation phuc tap hoac field nhay cam.

## Auth va quyen

JWT claim user id dung:

```csharp
ClaimTypes.NameIdentifier
```

Role hien co:
- `User`
- `Admin`

Tai khoan test thuong dung:
- User: `user@test.com` / `User@123`
- Admin: `admin@keyboardstore.com` / `Admin@123`

Khong ghi app password, secret key, hash secret that vao tai lieu moi.
Khong de secret that trong `appsettings.json`.
Local secret phai dung .NET user-secrets hoac environment variables.
Xem `LOCAL_SECRETS.example.md` neu can setup local.

## Order status

Dung `Constants/OrderStatuses.cs`.

Status hien co:
- `Pending`
- `Pending Payment`
- `Processing`
- `Shipped`
- `Completed`
- `Cancelled`

Khi cancel order, phai hoan stock neu don chua cancel truoc do.

## Payment

Dung `Constants/PaymentMethods.cs`:
- `COD`
- `VNPay`

Dung `Constants/PaymentStatuses.cs`:
- `Unpaid`
- `Paid`
- `Failed`

VNPay dung VND nguyen, khong dung gia co phan thap phan.
Product price phai la so nguyen VND. Khong de gia kieu `59.99`.

VNPay callback:
- Return URL: user browser redirect.
- IPN: server-to-server callback.

Payment xu ly can idempotent: neu order da `Paid`, khong update/gui email lap.

## Cart va checkout

Cart luu trong bang `CartItems`.
Mot user chi co mot dong cart item cho moi product nho unique index `(UserId, ProductId)`.

Them vao cart khong tru stock.
Checkout moi goi `OrderService.CreateOrderAsync`, tai do kiem tra stock va tru stock trong transaction.

`POST /api/Cart/checkout` hien tao don COD.
VNPay checkout van di qua `POST /api/Payment/create-vnpay-payment`.

## Product

Product co cache Redis cho:
- danh sach product.
- chi tiet product.

Khi create/update/delete product phai invalidate cache.

Search/filter hien co:
- `keyword`
- `categoryId`
- `minPrice`
- `maxPrice`
- `inStock`
- `sortBy`
- `page`
- `pageSize`

Sort values:
- `price_asc`
- `price_desc`
- `name`
- `oldest`
- default: newest.

Product search/filter/pagination phai query o database trong repository.
Khong load toan bo product len memory roi moi filter.

## Image upload

Endpoint:

```http
POST /api/Upload/product-image
```

Chi admin duoc upload.
File duoc luu vao:

```text
wwwroot/uploads/products
```

Response tra:

```json
{ "imageUrl": "/uploads/products/file-name.webp" }
```

## Database va migration

Khi them/sua entity:

```bash
dotnet ef migrations add MigrationName
dotnet ef database update
```

Neu API bao bang/cot khong ton tai, kiem tra migration da apply chua:

```bash
dotnet ef migrations list
dotnet ef database update
```

Luu y: neu API dang chay, build thuong co the bi lock file trong `bin/` hoac `obj/`.
Dung API bang `Ctrl + C` roi build lai.

## Build va chay

Tu thu muc `KeyboardStoreAPI`:

```bash
dotnet build .\KeyboardStoreAPI.API\KeyboardStoreAPI.API.csproj
dotnet run --project .\KeyboardStoreAPI.API\KeyboardStoreAPI.API.csproj
```

Neu server dang chay va lock file, co the build check ra thu muc tam:

```bash
dotnet build .\KeyboardStoreAPI.API\KeyboardStoreAPI.API.csproj -o .\artifacts\build-check
```

Swagger local thuong o:

```text
http://localhost:5143/swagger
```

## Warning/loi thuong gap

### `Table 'KeyboardStoreDB.CartItems' doesn't exist`

Chua apply migration cart/shipping.
Chay:

```bash
dotnet ef database update
```

### `Payment amount does not match order total`

VNPay tra tien theo VND nguyen nhung order co phan thap phan.
Sua product price thanh so nguyen VND.

### `AssemblyReference.cache access denied`

Process `dotnet` dang giu file trong `obj`.
Dung API roi build lai.

## Khi AI tiep tuc phat trien

Thu tu uu tien sau muc 1:
1. Reviews & Ratings.
2. Wishlist.
3. Voucher/Discount.
4. Order Tracking history.
5. Admin Dashboard.
6. AI Chatbot realtime/RAG.

Khi them feature moi:
1. Doc model/DTO/service/repository/controller hien co.
2. Tao DTO truoc.
3. Tao model/migration neu can luu database.
4. Tao repository neu co query moi dang tach.
5. Tao service logic.
6. Tao controller.
7. Dang ky DI.
8. Build.
9. Ghi chu endpoint moi trong final response.
