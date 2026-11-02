import defaults from "@/lib/cms/defaults/not-found.json";
import { getPageContent } from "@/lib/cms/page-content";
import { NotFoundClient } from "@/components/layout/not-found-client";

export default async function NotFound() {
  const content = await getPageContent(defaults);
  return <NotFoundClient content={content} />;
}
