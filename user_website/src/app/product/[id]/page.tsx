import type { Metadata } from "next";
import DedicatedProductPage from "./ProductDetailClient";
import { fetchProductById, fetchLiveProducts } from "@/features/catalog/productService";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const ids = new Set<string>([
    "preview",
    "cooler-cx08-pro",
    "cooler-k6",
    "sleeves-shezi-24",
    "dummy-mouse-1",
    "prod_memo_cx08",
    "prod-cloudinary-verify-01",
    "prod-cloudinary-test-1",
    "prod_kb_custom_65",
    "prod-headset-1",
  ]);
  try {
    const products = await fetchLiveProducts();
    if (Array.isArray(products)) {
      products.forEach((p) => {
        if (p?.id) ids.add(String(p.id));
      });
    }
  } catch {}
  return Array.from(ids).map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id);

  if (!product) {
    return {
      title: "Product Not Found | Mex Tanim Store",
      description: "Discover authentic gaming gadgets in Bangladesh at Mex Tanim Store.",
    };
  }

  const title = `${product.name} | Mex Tanim Store`;
  const description = product.description
    ? `${product.description.slice(0, 160)} - দাম: ৳${product.price}`
    : `Authentic ${product.name} available at Mex Tanim Store for ৳${product.price}. Order now!`;
  const imageUrl = product.image || "https://res.cloudinary.com/nc5hyaab/image/upload/v1789770807/memo_cx08_cooler.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://mextanim.com/product/${id}`,
      siteName: "Mex Tanim Store",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await fetchProductById(id);

  return <DedicatedProductPage initialProduct={product} />;
}
