import defaults from "@/lib/cms/defaults/contact.json";
import { getPageContent } from "@/lib/cms/page-content";
import { ContactPageClient } from "@/components/contact/contact-page-client";

export default async function ContactPage() {
  const content = await getPageContent(defaults);
  return <ContactPageClient content={content} />;
}
