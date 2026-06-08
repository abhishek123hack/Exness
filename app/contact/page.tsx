import { InnerPage } from "@/components/InnerPage";
import { pageData } from "@/lib/pageData";

export const metadata = {
  title: "Contact | Exness Global",
  description: "Contact Exness Global support, sales, onboarding and institutional desks."
};

export default function ContactPage() {
  return <InnerPage data={pageData.contact} />;
}
