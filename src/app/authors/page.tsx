import defaults from "@/lib/cms/defaults/authors.json";
import { getPageContent } from "@/lib/cms/page-content";
import { AuthorsPageClient } from "@/components/authors/authors-page-client";

export default async function AuthorsPage() {
  const content = await getPageContent(defaults);
  return <AuthorsPageClient content={content} />;
}
