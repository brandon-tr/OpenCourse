"use client";

import Table from "@/components/ui/Surfaces/Table/Table";
import {createColumnHelper} from "@tanstack/table-core";
import {GetAllUsersResponseDto, UserPagination, UserRoleResponseDto,} from "@/app/dashboard/view/users/(list)/page";
import {FC, useEffect, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import MaterialButton from "@/components/ui/inputs/MaterialButton";
import {useUiStore} from "@/components/store/Store";
import Notification from "@/components/ui/Surfaces/Alerts/Notification";

interface TableUsersProps {
    paginationData: UserPagination;
}

async function getData(pageNumber: number, pageSize: number, search: string) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Trash/GetAllTrash?PageNumber=${pageNumber}&PageSize=${pageSize}&Search=${search}`,
        {
            credentials: "include",
            cache: 'no-cache'
        }
    );
    return await response.json();
}

async function deleteUser(id: number) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/User/DeleteUser`,
        {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(id),
            credentials: "include",
        },
    );
    const json = await response.json();
    if (response.status === 200) {
        return {
            message: json.message,
            severity: "success" as "success",
        };
    } else if (json.error) {
        return {
            message: json.error,
            severity: "error" as "error",
        };
    } else {
        return {
            message: "Something went wrong",
            severity: "error" as "error",
        };
    }
}

async function recoverUser(id: number) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/User/recover`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(id),
            credentials: "include",
        },
    );
    const json = await response.json();
    if (response.status === 200) {
        return {
            message: json.message,
            severity: "success" as "success",
        };
    } else if (json.error) {
        return {
            message: json.error,
            severity: "error" as "error",
        };
    } else {
        return {
            message: "Something went wrong",
            severity: "error" as "error",
        };
    }
}

const TableTrashBin: FC<TableUsersProps> = ({paginationData}) => {
    const [data, setData] = useState(paginationData);
    const showNotification = useUiStore((state) => state.showNotification);
    const hideNotification = useUiStore((state) => state.hideNotification);
    const setTableData = useUiStore((state) => state.setTableData);
    const [rowChange, setRowChange] = useState({
        rowId: null,
        newData: "",
    });
    useEffect(() => {
        return () => {
            setTableData([]);
        };
    }, []);

    const router = useRouter();
    const columnHelper = createColumnHelper<GetAllUsersResponseDto>();
    const columns = [
        columnHelper.accessor("avatar", {
            id: "avatar",
            cell: (info) =>
                typeof info.getValue() === "string" ? (
                    <Image
                        width={70}
                        height={70}
                        src={info.getValue() ||
                            `${process.env.NEXT_PUBLIC_AVATAR_NOT_FOUND}${info.row.original.firstName}+${info.row.original.lastName}`
                        }
                        alt={"avatar"}
                        className={"rounded-full w-16 h-16"}
                    />
                ) : (
                    ""
                ),
            header: () => <span>Avatar</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor("id", {
            id: "id",
            cell: (info) => info.getValue(),
            header: () => <span>ID</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor("firstName", {
            cell: (info) => info.getValue(),
            header: () => <span>First Name</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor("lastName", {
            cell: (info) => info.getValue(),
            header: () => <span>Last Name</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor("email", {
            cell: (info) => info.getValue(),
            header: () => <span>Email</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor("isBanned", {
            cell: (info) => (info.getValue() === true ? "Yes" : "No"),
            header: () => <span>Banned?</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor("userRoles", {
            cell: (info) =>
                info
                    .getValue()
                    .map((role: UserRoleResponseDto) => role.name)
                    .join(", "),
            header: () => <span>Roles</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.display({
            id: "actions",
            cell: (info) => (
                <div className="flex justify-center gap-2">
                    <MaterialButton
                        onClick={() =>
                            router.push(`/dashboard/view/users/${info.row.original.id}`)
                        }
                    >
                        Edit
                    </MaterialButton>
                    <MaterialButton color={"danger"} onClick={() => {
                        hideNotification();
                        deleteUser(info.row.original.id).then(async (response) => {
                            if (response.severity === "success") {
                                let data = getData(1, 10, '').then((data) => {
                                    setData(data)
                                    setTableData(data.users)
                                })
                            }
                            showNotification(response.message, response.severity);
                        });
                    }}>Delete</MaterialButton>
                    <MaterialButton color={"warning"} onClick={() => {
                        hideNotification();
                        recoverUser(info.row.original.id).then(async (response) => {
                            if (response.severity === "success") {
                                let data = getData(1, 10, '').then((data) => {
                                    setData(data)
                                    setTableData(data.users)
                                })
                            }
                            showNotification(response.message, response.severity);
                        });
                    }}>Recover</MaterialButton>
                </div>
            ),
            header: () => <span>Actions</span>,
        }),
    ];
    return (
        <>
            <Table
                columns={columns}
                data={data.users}
                paginationData={data}
                getData={getData}
            />
            <Notification/>
        </>
    );
};

export default TableTrashBin;
