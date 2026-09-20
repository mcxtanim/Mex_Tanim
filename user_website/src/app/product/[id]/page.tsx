import type { Metadata } from "next";
import DedicatedProductPage from "./ProductDetailClient";
import { fetchProductById } from "@/features/catalog/productService";

interface Props {
  params: Promise<{ id: string }>;
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
