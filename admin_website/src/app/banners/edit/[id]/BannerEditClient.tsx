"use client";

import { useParams } from "next/navigation";
import { BannerFormView } from "@/features/banners/BannerFormView";

export default function BannerEditClient() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";

  return <BannerFormView bannerId={id} />;
}
