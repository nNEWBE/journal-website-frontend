import { contentApi, type PageContentDTO } from "@/lib/api";
import { HomePageClient } from "@/components/home/home-page-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  let initialSections: PageContentDTO[] = [];
  try {
    const data = await contentApi.getPublished("home");
    if (Array.isArray(data)) {
      initialSections = data;
    }
  } catch (err) {
    console.error("Failed to fetch initial home sections on SSR:", err);
  }

  return <HomePageClient initialSections={initialSections} />;
}
