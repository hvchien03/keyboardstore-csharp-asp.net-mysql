import { ArrowRight, Grid3X3, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product/product-card";
import { getLatestProducts } from "@/lib/products";

const heroImage = "/images/products/hero-keyboard.jpg";

const categoryImage = "/images/products/keyboard-components.jpg";

export default async function Home() {
  const products = await getLatestProducts(4);

  return (
    <main className="flex-grow">
      <section className="relative flex h-[min(819px,calc(100vh-72px))] min-h-[600px] w-full items-center justify-center overflow-hidden bg-surface-white">
        <Image
          alt="Premium custom mechanical keyboard on a minimalist desk"
          className="object-cover object-center opacity-90"
          fill
          priority
          sizes="100vw"
          src={heroImage}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-white/85 to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-container-max px-gutter md:px-section-padding">
          <div className="max-w-lg">
            <span className="mb-4 inline-block rounded-full border border-border-subtle bg-surface-container-low px-3 py-1 text-label-sm font-medium uppercase tracking-wider text-secondary">
              Phien ban gioi han
            </span>
            <h1 className="mb-6 text-display-lg-mobile font-bold text-on-surface md:text-display-lg">
              Trai nghiem go phim tinh tuy.
            </h1>
            <p className="mb-8 text-body-lg text-secondary">
              Kham pha bo suu tap ban phim co custom cao cap moi nhat.
              Thiet ke nguyen khoi, trai nghiem go dinh cao, phong cach toi
              gian.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                className="rounded bg-primary-container px-8 py-3 text-label-bold font-semibold text-on-primary transition-opacity hover:opacity-90"
                href="/products"
              >
                Mua ngay
              </Link>
              <Link
                className="rounded border border-on-background px-8 py-3 text-label-bold font-semibold text-on-background transition-colors hover:bg-surface-container-low"
                href="/products"
              >
                Tim hieu them
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-section-padding">
        <div className="mx-auto w-full max-w-container-max px-gutter md:px-0">
          <h2 className="mb-12 text-center text-headline-md font-semibold text-on-surface">
            Danh muc noi bat
          </h2>
          <div className="grid grid-cols-1 gap-gutter md:h-[500px] md:grid-cols-12">
            <Link
              className="group relative min-h-[320px] overflow-hidden rounded-lg border border-border-subtle bg-surface-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)] md:col-span-8"
              href="/products"
            >
              <Image
                alt="Custom keyboard components arranged on a white mat"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                fill
                sizes="(min-width: 768px) 66vw, 100vw"
                src={categoryImage}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="mb-2 text-headline-md font-semibold text-on-primary">
                  Custom Build
                </h3>
                <p className="flex items-center text-body-md text-on-primary/85">
                  Kham pha the gioi sang tao
                  <ArrowRight className="ml-2" size={16} />
                </p>
              </div>
            </Link>

            <div className="grid grid-cols-1 gap-gutter md:col-span-4">
              <CategoryMiniCard
                href="/categories/2"
                icon={<SlidersHorizontal size={26} />}
                title="Switches"
              />
              <CategoryMiniCard
                href="/categories/3"
                icon={<Grid3X3 size={26} />}
                title="Keycaps"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-white py-section-padding">
        <div className="mx-auto w-full max-w-container-max px-gutter md:px-0">
          <div className="mb-12 flex items-end justify-between border-b border-border-subtle pb-4">
            <h2 className="text-headline-md font-semibold text-on-surface">
              San pham moi nhat
            </h2>
            <Link
              className="flex items-center text-label-bold font-semibold text-secondary transition-colors hover:text-primary-container"
              href="/products"
            >
              Xem tat ca <ArrowRight className="ml-1" size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function CategoryMiniCard({
  href,
  icon,
  title,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <Link
      className="group rounded-lg border border-border-subtle bg-surface-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(0,0,0,0.12)]"
      href={href}
    >
      <div className="flex h-full min-h-[220px] flex-col justify-between">
        <div className="flex items-start justify-between">
          <h3 className="text-headline-md font-semibold text-on-surface">
            {title}
          </h3>
          <span className="text-secondary transition-colors group-hover:text-primary-container">
            {icon}
          </span>
        </div>
        <div className="rounded-lg bg-surface-container-low p-8 text-center text-body-md text-secondary">
          {title === "Switches" ? "Linear / Tactile / Clicky" : "PBT / Cherry / OSA"}
        </div>
      </div>
    </Link>
  );
}
