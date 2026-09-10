const UNSPLASH = "https://images.unsplash.com";

const FALLBACKS = {
  gpu: `${UNSPLASH}/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=85`,
  graphics: `${UNSPLASH}/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=85`,
  cpu: `${UNSPLASH}/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85`,
  processor: `${UNSPLASH}/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85`,
  motherboard: `${UNSPLASH}/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85`,
  ram: `${UNSPLASH}/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=85`,
  memory: `${UNSPLASH}/photo-1562976540-1502c2145186?auto=format&fit=crop&w=1200&q=85`,
  ssd: `${UNSPLASH}/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=85`,
  storage: `${UNSPLASH}/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=85`,
  hdd: `${UNSPLASH}/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1200&q=85`,
  case: `${UNSPLASH}/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=85`,
  power: `${UNSPLASH}/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=85`,
  psu: `${UNSPLASH}/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=85`,
  cooler: `${UNSPLASH}/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=85`,
  fan: `${UNSPLASH}/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=85`,
  monitor: `${UNSPLASH}/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=85`,
  keyboard: `${UNSPLASH}/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=85`,
  mouse: `${UNSPLASH}/photo-1527814050087-3793815479db?auto=format&fit=crop&w=1200&q=85`,
  accessory: `${UNSPLASH}/photo-1593642532400-2682810df593?auto=format&fit=crop&w=1200&q=85`,
  default: `${UNSPLASH}/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=85`
};

function clean(value) {
  return String(value || "").trim().toLowerCase();
}

export function getProductImage(product) {
  const supplied = product?.imageUrl?.trim();
  if (supplied) return supplied;

  const text = clean(`${product?.name || ""} ${product?.brand || ""} ${product?.category?.name || ""}`);
  const key = Object.keys(FALLBACKS).find((candidate) => text.includes(candidate));
  return FALLBACKS[key || "default"];
}

export function getCategoryImage(categoryName = "") {
  const text = clean(categoryName);
  const key = Object.keys(FALLBACKS).find((candidate) => text.includes(candidate));
  return FALLBACKS[key || "default"];
}

export const productImageFallback = FALLBACKS.default;
