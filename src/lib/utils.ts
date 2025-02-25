const API_UNSPLASH = "https://source.unsplash.com/featured/?";

export function getProductImage(productName: string) {
  return `${API_UNSPLASH}${encodeURIComponent(productName)}`;
}