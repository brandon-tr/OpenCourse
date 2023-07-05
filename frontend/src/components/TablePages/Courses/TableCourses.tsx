"use client";

import {createColumnHelper} from "@tanstack/table-core";
import {FC, useEffect, useState} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import MaterialButton from "@/components/ui/inputs/MaterialButton";
import {useUiStore} from "@/components/store/Store";
import Notification from "@/components/ui/Surfaces/Alerts/Notification";
import {CheckErrors} from "@/components/utility/HandleFetchErrors";
import {CheckAndThrowError} from "@/components/utility/CheckAndThrowError";
import {CourseDto, PagedCoursesResponseDto} from "@/app/dashboard/view/(courses)/courses/page";
import Table from "@/components/ui/Surfaces/Table/Table";

interface TableCourseProps {
    paginationData: PagedCoursesResponseDto;
}

async function getData(pageNumber: number, pageSize: number, search: string) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/Course?PageNumber=${pageNumber}&PageSize=${pageSize}&Search=${search}`,
            {
                credentials: "include",
                cache: 'no-cache'
            }
        )
        let result = await response.json();
        CheckErrors(response, result);
        return result;
    } catch (e) {
        CheckAndThrowError(e);
    }
}

async function deleteCourse(id: number) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Course/${id}`,
        {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
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

const TableCourses: FC<TableCourseProps> = ({paginationData}) => {
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
    const columnHelper = createColumnHelper<CourseDto>();
    const columns = [
        columnHelper.accessor("image", {
            id: "image",
            cell: (info) =>
                typeof info.getValue() === "string" ? (
                    <Image
                        width={70}
                        height={70}
                        src={`https://picsum.photos/200/300`}
                        alt={"Image"}
                        className={"rounded-full w-16 h-16"}
                    />
                ) : (
                    ""
                ),
            header: () => <span>Image</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor("id", {
            id: "id",
            cell: (info) => info.getValue(),
            header: () => <span>ID</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor("title", {
            cell: (info) => info.getValue(),
            header: () => <span>Title</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor("updatedAt", {
            cell: (info) => new Date(info.getValue()).toDateString(),
            header: () => <span>Last Updated At</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor("createdAt", {
            cell: (info) => new Date(info.getValue()).toDateString(),
            header: () => <span>Created At</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor("videoCount", {
            cell: (info) => info.getValue(),
            header: () => <span>Video Count</span>,
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
                        deleteCourse(info.row.original.id).then(async (response) => {
                            if (response.severity === "success") {
                                let data = getData(1, 10, '').then((data) => {
                                    setData(data)
                                    setTableData(data.courses)
                                })
                            }
                            showNotification(response.message, response.severity);
                        });
                    }}>Delete</MaterialButton>
                </div>
            ),
            header: () => <span>Actions</span>,
        }),
    ];
    return (
        <>
            <Table
                columns={columns}
                data={data.courses}
                paginationData={data}
                getData={getData}
            />
            <Notification/>
        </>
    );
};

export default TableCourses;
