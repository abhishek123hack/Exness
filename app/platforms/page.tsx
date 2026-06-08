import { InnerPage } from "@/components/InnerPage";
import { pageData } from "@/lib/pageData";

export const metadata = {
  title: "Platforms | Exness Global",
  description: "MT4, MT5, WebTrader, mobile apps and AI trading platform."
};

export default function PlatformsPage() {
  return <InnerPage data={pageData.platforms} />;
}
