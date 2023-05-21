import "./globals.css";
import { Inter } from "next/font/google";
import AppBar from "@/components/ui/layout/AppBar";
import { headers } from "next/headers";
import isMobileDevice from "@/components/utility/IsMobileDevice";
import Notification from "@/components/ui/Surfaces/Alerts/Notification";
import { Metadata, ResolvingMetadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(
  parent?: ResolvingMetadata
): Promise<Metadata> {
  // fetch data
  const metadata = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/SiteSetting/meta`
  );
  const json = await metadata.json();
  console.log(json);
  return {
    title: json.siteName,
    description: json.siteDescription,
    keywords: json.siteKeywords
      .split(",")
      .map((keyword: string) => keyword.trim()),
    authors: json.siteAuthor,
  };
}

export async function getTitle() {
  const metadata = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/SiteSetting/title`
  );
  const json = await metadata.json();
  return json.siteName;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");
  const title = await getTitle();
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen w-full flex flex-col">
          <AppBar
            isMobile={isMobileDevice(userAgent)}
            avatarSrc={"https://ui-avatars.com/api/?name=John+Doe"}
            isLogoText={true}
            logoText={title}
            logoAlt={"logo"}
            badgeText={"32"}
          />
          {children}
          <Notification />
        </div>
      </body>
    </html>
  );
}
