"use client";

import Table from "@/components/ui/Surfaces/Table/Table";
import { createColumnHelper } from "@tanstack/table-core";
import {
  GetAllUsersResponseDto,
  UserPagination,
  UserRoleResponseDto,
} from "@/app/dashboard/view/users/(list)/page";
import { FC } from "react";
import Image from "next/image";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface TableUsersProps {
  paginationData: UserPagination;
}

async function getData(pageNumber: number, pageSize: number, search: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/User/GetAllUsers?PageNumber=${pageNumber}&PageSize=${pageSize}&Search=${search}`,
    {
      cache: "default",
      credentials: "include",
    }
  );
  if (response.status === 403)
    return redirect(
      `/login?errors=${process.env.NEXT_PUBLIC_ERRORS_UNAUTHORIZED}`
    );
  else if (response.status === 401) {
    return redirect(
      `/login?errors=${process.env.NEXT_PUBLIC_ERRORS_NOT_LOGGED_IN}`
    );
  }
  return response.json();
}

const TableUsers: FC<TableUsersProps> = ({ paginationData }) => {
  const columnHelper = createColumnHelper<GetAllUsersResponseDto>();
  const columns = [
    columnHelper.accessor("avatar", {
      id: "avatar",
      cell: (info) =>
        typeof info.getValue() === "string" ? (
          <Image
            width={70}
            height={70}
            src={info.getValue() || ""}
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
  ];
  return (
    <Table
      columns={columns}
      data={paginationData.users}
      paginationData={paginationData}
      getData={getData}
    />
  );
};

export default TableUsers;
