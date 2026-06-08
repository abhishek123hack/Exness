import { InnerPage } from "@/components/InnerPage";
import { pageData } from "@/lib/pageData";

export const metadata = {
  title: "Markets | Exness Global",
  description: "Trade crypto, forex, stocks, gold and indices with premium market access."
};

export default function MarketsPage() {
  return <InnerPage data={pageData.markets} />;
}
