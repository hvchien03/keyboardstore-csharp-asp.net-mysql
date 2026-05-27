using Microsoft.EntityFrameworkCore;
using KeyboardStoreAPI.API.Models;

namespace KeyboardStoreAPI.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSet = Đại diện cho bảng trong database
        public DbSet<User> Users { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Brand> Brands { get; set; }
        public DbSet<SwitchType> SwitchTypes { get; set; }
        public DbSet<Layout> Layouts { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }

        /// <summary>
        /// Cấu hình các bảng, relationships, constraints
        /// </summary>

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.Role).HasMaxLength(20);
                entity.Property(e => e.EmailVerificationTokenHash).HasMaxLength(128);
            });

            // Category
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            });

            modelBuilder.Entity<Brand>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Name).IsUnique();
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
            });

            modelBuilder.Entity<SwitchType>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Name).IsUnique();
                entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
            });

            modelBuilder.Entity<Layout>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.Name).IsUnique();
                entity.Property(e => e.Name).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Percentage).IsRequired().HasMaxLength(10);
            });

            // Product
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");

                entity.HasOne(e => e.Category)
                      .WithMany(c => c.Products)
                      .HasForeignKey(e => e.CategoryId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Brand)
                      .WithMany(b => b.Products)
                      .HasForeignKey(e => e.BrandId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.SwitchType)
                      .WithMany(s => s.Products)
                      .HasForeignKey(e => e.SwitchTypeId)
                      .OnDelete(DeleteBehavior.SetNull);

                entity.HasOne(e => e.Layout)
                      .WithMany(l => l.Products)
                      .HasForeignKey(e => e.LayoutId)
                      .OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<ProductImage>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Alt).HasMaxLength(200);

                entity.HasOne(e => e.Product)
                      .WithMany(p => p.ProductImages)
                      .HasForeignKey(e => e.ProductId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            // Order
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Status).HasMaxLength(50);
                entity.Property(e => e.ShippingName).HasMaxLength(100);
                entity.Property(e => e.ShippingPhone).HasMaxLength(20);
                entity.Property(e => e.ShippingAddress).HasMaxLength(500);
                entity.Property(e => e.Note).HasMaxLength(1000);

                entity.HasOne(e => e.User)
                      .WithMany(u => u.Orders)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // OrderDetail
            modelBuilder.Entity<OrderDetail>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");

                entity.HasOne(e => e.Order)
                      .WithMany(o => o.OrderDetails)
                      .HasForeignKey(e => e.OrderId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Product)
                      .WithMany(p => p.OrderDetails)
                      .HasForeignKey(e => e.ProductId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<CartItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => new { e.UserId, e.ProductId }).IsUnique();

                entity.HasOne(e => e.User)
                      .WithMany(u => u.CartItems)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Product)
                      .WithMany(p => p.CartItems)
                      .HasForeignKey(e => e.ProductId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            /// <summary>
            /// THÊM MỚI: Cấu hình bảng RefreshToken
            /// </summary>
            modelBuilder.Entity<RefreshToken>(entity =>
            {
                entity.HasKey(e => e.Id); // Khóa chính

                entity.Property(e => e.Token)
                      .IsRequired() // Bắt buộc phải có
                      .HasMaxLength(500); // Tối đa 500 ký tự

                entity.HasIndex(e => e.Token)
                      .IsUnique(); // Token phải unique (không trùng lặp)

                entity.Property(e => e.ExpiresAt)
                      .IsRequired();

                // Relationship: 1 User có nhiều RefreshTokens
                entity.HasOne(e => e.User)
                      .WithMany(u => u.RefreshTokens)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade); // Xóa User → Xóa luôn RefreshTokens
            });
        }
    }
}
