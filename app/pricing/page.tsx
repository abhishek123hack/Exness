import { InnerPage } from "@/components/InnerPage";
import { pageData } from "@/lib/pageData";

export const metadata = {
  title: "Pricing | Exness Global",
  description: "Transparent spreads, commissions, leverage and premium trading fees."
};

export default function PricingPage() {
  return <InnerPage data={pageData.pricing} />;
}
