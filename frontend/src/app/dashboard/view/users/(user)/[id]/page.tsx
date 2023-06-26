import CenteredLayout from "@/components/ui/layout/Container";
import Card from "@/components/ui/Surfaces/Card";
import {redirect} from "next/navigation";
import {headers} from "next/headers";
import HandleRouteRedirectError from "@/components/utility/CheckNextRedirectError";
import UpdateUserForm from "@/components/ui/forms/UpdateUserForm";
import {Metadata, ResolvingMetadata} from "next";
import {CheckErrors} from "@/components/utility/HandleFetchErrors";

async function getUserData(id: number) {
    try {
        const request = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/User/${id}`,
            {headers: headers(), cache: "no-cache"}
        );
        CheckErrors(request);
        return request.json();
    } catch (e) {
        HandleRouteRedirectError(e);
        return redirect(`/dashboard?errors=unknown`);
    }
}

async function getRoleData(id: number) {
    try {
        const request = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/Role/GetAllRoles`,
            {
                headers: headers(),
            }
        );
        CheckErrors(request);
        return request.json();
    } catch (e) {
        return redirect(`/dashboard?errors=unknown`);
    }
}

type Props = {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
    {params, searchParams}: Props,
    parent?: ResolvingMetadata
): Promise<Metadata> {
    // read route params
    const id = params.id;

    // fetch data
    const data = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/User/${Number.parseInt(String(id))}`,
        {
            headers: headers(),
        }
    ).then((res) => res.json());

    return {
        title: "Update " + data.firstName + " " + data.lastName,
    };
}

export default async function Page({params}: { params: { id: number } }) {
    const {id} = params;
    const userData = getUserData(id);
    const roleData = getRoleData(id);

    const [user, role] = await Promise.all([userData, roleData]);

    const name = `${user.firstName} ${user.lastName}`;
    return (
        <CenteredLayout>
            <Card title={`Update ${name}`} removeBg={true} centerTitle={true}>
                <UpdateUserForm user={user} role={role}/>
            </Card>
        </CenteredLayout>
    );
}
