import CenteredLayout from "@/components/ui/layout/Container";
import SideNav from "@/components/ui/layout/SideNav";
import {headers} from "next/headers";
import isMobileDevice from "@/components/utility/IsMobileDevice";
import HandleRouteRedirectError from "@/components/utility/CheckNextRedirectError";
import {CheckErrors} from "@/components/utility/HandleFetchErrors";

async function getData() {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/User/checkAdmin`,
            {cache: "no-store", headers: headers(), credentials: 'include'}
        );
        CheckErrors(response);
        return response.json();
    } catch (e: any) {
        if (e.message === "Too many requests") {
            throw new Error("Too many requests");
        }
        return HandleRouteRedirectError(e);
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

    const items = [
        {title: "Dashboard", link: "/dashboard", category: "home", visible: true},
        {
            title: "Site Settings",
            link: "/dashboard/site-settings",
            category: "home",
            visible: parseInt(res.level) > 2,
        },
        {title: "View Courses", link: "/", category: "views", visible: true},
        {
            title: "View Users",
            link: "/dashboard/view/users",
            category: "views",
            visible: true,
        },
        {title: "View Stats", link: "/about", category: "views", visible: true},
        {title: "Add Course", link: "/dashboard/add-course", category: "Add", visible: true},
        {title: "Add User", link: "/contact", category: "Add", visible: true},
        {title: "Trash Bin", link: "/dashboard/trash", category: "Trash", visible: true},
    ];

    return (
        <CenteredLayout centered={false} className={""}>
            <SideNav items={items} isMobile={isMobileDevice(userAgent)}>
                {children}
            </SideNav>
        </CenteredLayout>
    );
}
