import Card from "@/components/ui/Surfaces/Card";
import { SiteSettingsForm } from "@/components/ui/forms/SiteSettingsForm";
import { headers } from "next/headers";

async function getData() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/SiteSetting/1`,
    { headers: headers() }
  );
  const json = await response.json();
  return json;
}

export const metadata = {
  title: "Site Settings",
  description: "Administration options for the site",
};

export default async function SiteSettings() {
  const siteSettings = await getData();
  return (
    <Card title={"Site Settings"} centerTitle={false}>
      <div className={"max-w-md"}>
        <SiteSettingsForm site={siteSettings} />
      </div>
    </Card>
  );
}
