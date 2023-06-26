import TableTrashBin from "@/components/TablePages/TrashBin/TableTrashBin";
import {Metadata} from "next";
import {headers} from "next/headers";
import TableContainer from "@/components/ui/layout/TableContainer";
import {CheckErrors} from "@/components/utility/HandleFetchErrors";

export const metadata: Metadata = {
    title: "Trash Bin User List",
    description: "Total user list",
};

async function getData() {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/Trash/GetAllTrash?PageNumber=1&PageSize=10`,
            {
                cache: "no-store",
                headers: headers(),
                credentials: "include",
            }
        );
        CheckErrors(response);
        return response.json();
    } catch (e) {
        return e
    }
}

export default async function Page() {
    const data = await getData();
    return (
        <TableContainer>
            <TableTrashBin paginationData={data}/>
        </TableContainer>
    );
}