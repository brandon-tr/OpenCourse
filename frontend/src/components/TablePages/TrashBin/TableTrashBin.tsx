"use client";

import Table from "@/components/ui/Surfaces/Table/Table";
import { createColumnHelper } from "@tanstack/table-core";
import { UserRoleResponseDto } from "@/app/dashboard/view/users/(list)/page";
import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import MaterialButton from "@/components/ui/inputs/MaterialButton";
import { useUiStore } from "@/components/store/Store";
import Notification from "@/components/ui/Surfaces/Alerts/Notification";
import { CheckErrors } from "@/components/utility/HandleFetchErrors";
import { CheckAndThrowError } from "@/components/utility/CheckAndThrowError";

export interface TrashBinDto {
  id: string;
  name: string;
  userRoles?: UserRoleResponseDto[];
  dateToDelete?: Date;
  image?: string;
  videoCount?: number;
  type: string;
}

export interface PagedTrashBinResponseDto {
  data: TrashBinDto[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

interface TrashBin {
  paginationData: PagedTrashBinResponseDto;
}

async function getData(pageNumber: number, pageSize: number, search: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/Trash/GetAllTrash?PageNumber=${pageNumber}&PageSize=${pageSize}&Search=${search}`,
      {
        credentials: "include",
        cache: "no-cache",
      }
    );
    let result = await response.json();
    CheckErrors(response, result);
    return result;
  } catch (e) {
    CheckAndThrowError(e);
  }
}

async function deleteItem(id: string, type: string) {
  let ob = {
    id,
    type,
  };
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/Trash/DeleteItem`,
    {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ob),
      credentials: "include",
    }
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

async function recoverItem(id: string, type: string) {
  let ob = {
    id,
    type,
  };
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/Trash/RecoverItem`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ob),
      credentials: "include",
    }
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

const TableTrashBin: FC<TrashBin> = ({ paginationData }) => {
  const [data, setData] = useState(paginationData);
  console.log(paginationData);
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
  const columnHelper = createColumnHelper<TrashBinDto>();
  const columns = [
    columnHelper.accessor("image", {
      id: "image",
      cell: (info) =>
        info.getValue() ? (
          typeof info.getValue() === "string" ? (
            <Image
              width={70}
              height={70}
              src={info.getValue() || ""}
              alt={"image"}
              className={"rounded-full w-16 h-16"}
            />
          ) : (
            ""
          )
        ) : (
          ""
        ),
      header: () => <span>Image</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("type", {
      cell: (info) => info.getValue(),
      header: () => <span>Type</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("id", {
      id: "id",
      cell: (info) => info.getValue(),
      header: () => <span>ID</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      header: () => <span>Name</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("videoCount", {
      cell: (info) => info.getValue() || "N/A",
      header: () => <span>Video Count</span>,
      footer: (info) => info.column.id,
    }),
    columnHelper.accessor("userRoles", {
      cell: (info) => {
        return info.getValue()
          ? info
              .getValue()
              ?.map((role: UserRoleResponseDto) => role.name)
              .join(", ")
          : "N/A";
      },
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
          <MaterialButton
            color={"danger"}
            onClick={() => {
              hideNotification();
              console.log(info.row);
              deleteItem(info.row.original.id, info.row.original.type).then(
                async (response) => {
                  if (response.severity === "success") {
                    let data = getData(1, 10, "").then((data) => {
                      setData(data);
                      setTableData(data.users);
                    });
                  }
                  showNotification(response.message, response.severity);
                }
              );
            }}
          >
            Delete
          </MaterialButton>
          <MaterialButton
            color={"warning"}
            onClick={() => {
              hideNotification();
              recoverItem(info.row.original.id, info.row.original.type).then(
                async (response) => {
                  if (response.severity === "success") {
                    let data = getData(1, 10, "").then((data) => {
                      setData(data);
                      setTableData(data.users);
                    });
                  }
                  showNotification(response.message, response.severity);
                }
              );
            }}
          >
            Recover
          </MaterialButton>
        </div>
      ),
      header: () => <span>Actions</span>,
    }),
  ];
  return (
    <>
      <Table
        columns={columns}
        data={data.data}
        paginationData={data}
        getData={getData}
      />
      <Notification />
    </>
  );
};

export default TableTrashBin;
