import CenteredLayout from "@/components/ui/layout/Container";
import SideNav from "@/components/ui/layout/SideNav";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import isMobileDevice from "@/components/utility/IsMobileDevice";
import CheckError from "@/components/utility/CheckNextRedirectError";

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
    return response.json();
  } catch (e: any) {
    CheckError(e);
    return redirect(`/login?errors=unknown`);
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const userAgent = headersList.get("user-agent");
  const res = await getData();
  console.log(res);

  const items = [
    { title: "Dashboard", link: "/dashboard", category: "home", visible: true },
    {
      title: "Site Settings",
      link: "/dashboard/site-settings",
      category: "home",
      visible: parseInt(res.level) > 2,
    },
    { title: "View Courses", link: "/", category: "views", visible: true },
    {
      title: "View Users",
      link: "/dashboard/view/users",
      category: "views",
      visible: true,
    },
    { title: "View Stats", link: "/about", category: "views", visible: true },
    { title: "Add Course", link: "/contact", category: "Add", visible: true },
    { title: "Add User", link: "/contact", category: "Add", visible: true },
    {
      title: "Modify Course",
      link: "/contact",
      category: "Modify",
      visible: true,
    },
    {
      title: "Modify User",
      link: "/contact",
      category: "Modify",
      visible: true,
    },
    { title: "Trash Bin", link: "/contact", category: "Trash", visible: true },
  ];

  return (
    <CenteredLayout centered={false} className={""}>
      <SideNav items={items} isMobile={isMobileDevice(userAgent)}>
        {children}
      </SideNav>
    </CenteredLayout>
  );
}
