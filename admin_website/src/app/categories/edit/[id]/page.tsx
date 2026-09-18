import CategoryEditClient from "./CategoryEditClient";

export function generateStaticParams() {
  return [{ id: "preview" }];
}

export default function EditCategoryPage() {
  return <CategoryEditClient />;
}
