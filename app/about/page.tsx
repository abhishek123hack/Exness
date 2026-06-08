import { InnerPage } from "@/components/InnerPage";
import { pageData } from "@/lib/pageData";

export const metadata = {
  title: "About | Exness Global",
  description: "Learn about Exness Global, a futuristic luxury fintech trading platform."
};

export default function AboutPage() {
  return <InnerPage data={pageData.about} />;
}
