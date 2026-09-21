import { redirect } from "next/navigation";

export default function AdminPipelineRedirectPage() {
  redirect("/dashboard/pipeline");
}
