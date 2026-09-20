import ProductEditClient from "./ProductEditClient";

export function generateStaticParams() {
  return [{ id: "preview" }];
}

export default function EditProductPage() {
  return <ProductEditClient />;
}

