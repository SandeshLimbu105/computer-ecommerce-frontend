import { useEffect, useState } from "react";
import { getProductImage, productImageFallback } from "../utils/productImages";

function resolveImageUrl(value) {
  if (!value) return value;
  if (/^https?:\/\//i.test(value) || value.startsWith("data:")) return value;

  const apiBase = import.meta.env.VITE_API_BASE_URL || "/api";
  try {
    const apiUrl = new URL(apiBase, window.location.origin);
    const origin = apiUrl.origin;
    const cleanBase = apiUrl.pathname.replace(/\/$/, "");
    const cleanPath = value.startsWith("/") ? value : `/${value}`;
    if (cleanPath.startsWith(`${cleanBase}/`)) return `${origin}${cleanPath}`;
    return `${origin}${cleanBase}${cleanPath}`;
  } catch {
    return value;
  }
}

export default function ProductImage({ product, className = "", alt, loading = "lazy" }) {
  const [src, setSrc] = useState(() => resolveImageUrl(getProductImage(product)));

  useEffect(() => {
    setSrc(resolveImageUrl(getProductImage(product)));
  }, [product?.productId, product?.imageUrl, product?.name, product?.category?.name]);

  return (
    <img
      src={src}
      className={className}
      alt={alt || product?.name || "Computer component"}
      loading={loading}
      onError={() => {
        if (src !== productImageFallback) setSrc(productImageFallback);
      }}
    />
  );
}
