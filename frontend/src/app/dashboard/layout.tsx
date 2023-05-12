import CenteredLayout from "@/components/ui/layout/Container";
import SideNav from "@/components/ui/layout/SideNav";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import isMobileDevice from "@/components/utility/IsMobileDevice";

const items = [
  { title: "Dashboard", link: "/dashboard", category: "home" },
  { title: "Site Settings", link: "/", category: "home" },
  { title: "View Courses", link: "/", category: "views" },
  { title: "View Users", link: "/dashboard/view/users", category: "views" },
  { title: "View Stats", link: "/about", category: "views" },
  { title: "Add Course", link: "/contact", category: "Add" },
  { title: "Add User", link: "/contact", category: "Add" },
  { title: "Modify Course", link: "/contact", category: "Modify" },
  { title: "Modify User", link: "/contact", category: "Modify" },
];

async function getData() {
  "use server";
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/User/checkAdmin`,
      { cache: "no-store", headers: headers() }
    );
    if (response.status === 403) {
      return redirect(
        `/login?errors=${process.env.NEXT_PUBLIC_ERRORS_UNAUTHORIZED}`
      );
    } else if (response.status === 401) {
      return redirect(
        `/login?errors=${process.env.NEXT_PUBLIC_ERRORS_NOT_LOGGED_IN}`
      );
    }
    return true;
  } catch (e: any) {
    if (e?.digest.includes("NEXT_REDIRECT")) {
      return redirect(e.digest.split(";")[2]);
    }
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");
  await getData();
  return (
    <CenteredLayout centered={false} className={""}>
      <SideNav items={items} isMobile={isMobileDevice(userAgent)}>
        {children}
      </SideNav>
    </CenteredLayout>
  );
}
