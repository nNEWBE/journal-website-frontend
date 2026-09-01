export function getBackendUrl(): string {
  const raw =
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://journal-website-backend-idj1.onrender.com"
      : "http://localhost:8080");

  return raw.replace(/\/+$/, "");
}
