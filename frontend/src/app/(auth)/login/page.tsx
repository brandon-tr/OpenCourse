import LoginForm from "@/components/ui/forms/LoginForm";
import Card from "@/components/ui/Surfaces/Card";
import CenteredLayout from "@/components/ui/layout/Container";
import {headers} from "next/headers";
import isMobileDevice from "@/components/utility/IsMobileDevice";
import {Metadata} from "next";
import {CheckErrors} from "@/components/utility/HandleFetchErrors";

export const metadata: Metadata = {
    title: "Login",
};

async function getData() {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/SiteSetting/GetLogins`,
            {cache: "no-store", headers: headers(), credentials: 'include'}
        );
        CheckErrors(response);
        return response.json();
    } catch (e: any) {
        if (e.message === "Too many requests") {
            throw new Error("Too many requests");
        }
    }
}

export default async function Page() {
    const listHeaders = headers();
    const userAgent = listHeaders.get("user-agent");
    const res = await getData();

    return (
        <CenteredLayout className="flex flex-col items-center justify-between p-24 w-full">
            <Card
                title={"Login"}
                isMobile={isMobileDevice(userAgent)}
                centerTitle={true}
            >
                <LoginForm isGoogleLoginEnabled={res.isGoogleLoginEnabled} registration={res.registration}/>
            </Card>
        </CenteredLayout>
    );
}
