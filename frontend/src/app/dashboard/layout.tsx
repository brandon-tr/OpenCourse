import CenteredLayout from "@/components/ui/layout/Container";
import SideNav from "@/components/ui/layout/SideNav";
import { headers } from "next/headers";
import isMobileDevice from "@/components/utility/IsMobileDevice";

const items = [
  { title: "Dashboard", link: "/dashboard", category: "home" },
  { title: "Site Settings", link: "/", category: "home" },
  { title: "View Courses", link: "/", category: "views" },
  { title: "View Accounts", link: "/courses", category: "views" },
  { title: "View Stats", link: "/about", category: "views" },
  { title: "Add Course", link: "/contact", category: "Add" },
  { title: "Add Account", link: "/contact", category: "Add" },
  { title: "Modify Course", link: "/contact", category: "Modify" },
  { title: "Modify Account", link: "/contact", category: "Modify" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");
  return (
    <CenteredLayout centered={false}>
      <SideNav items={items} isMobile={isMobileDevice(userAgent)}>
        {children}
      </SideNav>
    </CenteredLayout>
  );
}
