import "./globals.css";
import {Inter} from "next/font/google";
import AppBar from "@/components/ui/layout/AppBar";
import {headers} from "next/headers";
import isMobileDevice from "@/components/utility/IsMobileDevice";
import Notification from "@/components/ui/Surfaces/Alerts/Notification";
import {Metadata, ResolvingMetadata} from "next";
import {CheckErrors} from "@/components/utility/HandleFetchErrors";
import {NavigationEvents} from "@/components/ui/Surfaces/loading/NavigationEvents";
import React, {Suspense} from "react";
import {CheckAndThrowError} from "@/components/utility/CheckAndThrowError";

const inter = Inter({subsets: ["latin"]});

export async function generateMetadata(
    parent?: ResolvingMetadata
): Promise<Metadata> {
    // fetch data
    try {
        const metadata = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/SiteSetting/meta`,
            {
                next: {
                    revalidate: 10
                }
            }
        );
        CheckErrors(metadata);
        const json = await metadata.json();
        return {
            title: json.siteName,
            description: json.siteDescription,
            keywords: json.siteKeywords
                .split(",")
                .map((keyword: string) => keyword.trim()),
            authors: json.siteAuthor,
            openGraph: {
                title: json.siteName,
                siteName: json.siteName,
                description: json.siteDescription,
                type: "website",
                url: json.siteUrl,
                emails: json.siteEmail,
            }
        };
    } catch (e) {
        return {
            title: "OpenCourse",
            description: "OpenCourse is a free and open source platform for creating and sharing courses.",
            keywords: ["OpenCourse", "Open Source", "Free"],
        };
    }
}

export async function getTitle() {
    try {
        const metadata = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/SiteSetting/title`, {}
        );
        const response = await metadata.json();
        CheckErrors(response);

        return response.siteName;
    } catch (e) {
        console.log(e)
        CheckAndThrowError(e);
    }
}

async function GetUserDetail() {
    const request = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/User/GetUser`, {
            headers: headers(),
            credentials: 'include',
            next: {
                revalidate: 60
            }
        }
    );
    if (request.ok) {
        const response = await request.json();
        CheckErrors(response);
        return response;
    }
}

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    const headersList = headers();
    const userAgent = headersList.get("user-agent");
    const user = await GetUserDetail();

    const title = await getTitle();
    return (
        <html lang="en">
        <body className={inter.className}>
        <div className="min-h-screen w-full flex flex-col">
            <Suspense fallback={null}>
                <NavigationEvents/>
            </Suspense>
            <AppBar
                isMobile={isMobileDevice(userAgent)}
                avatarSrc={"https://ui-avatars.com/api/?name=John+Doe"}
                isLogoText={true}
                logoText={title ?? ''}
                logoAlt={"logo"}
                badgeText={"32"}
                userLogin={user}
            />
            {children}
            <Notification/>
        </div>
        </body>
        </html>
    );
}
