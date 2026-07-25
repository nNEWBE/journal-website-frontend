import { redirect } from "next/navigation";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = String(params.q ?? "").trim();
  const type = String(params.type ?? "").trim();
  const topic = String(params.topic ?? "").trim();

  const urlParams = new URLSearchParams();
  if (q) urlParams.set("q", q);
  if (type) urlParams.set("type", type);
  if (topic) urlParams.set("topic", topic);

  const queryStr = urlParams.toString();
  redirect(queryStr ? `/articles?${queryStr}` : "/articles");
}
