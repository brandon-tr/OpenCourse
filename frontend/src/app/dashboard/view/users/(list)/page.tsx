import TableContainer from "@/components/ui/layout/TableContainer";
import TableUsers from "@/components/TablePages/users/TableUsers";
import { headers } from "next/headers";
import { Metadata } from "next";
import { CheckErrors } from "@/components/utility/HandleFetchErrors";

export interface UserRoleResponseDto {
  id: string;
  name: string;
  level: number;
}

export interface GetAllUsersResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isBanned: boolean;
  password?: string;
  confirmPassword?: string;
  userRoles: UserRoleResponseDto[];
}

export interface UserPagination {
  users: GetAllUsersResponseDto[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export const metadata: Metadata = {
  title: "User List",
  description: "Total user list",
};

async function getData() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/User/GetAllUsers?PageNumber=1&PageSize=10`,
    {
      cache: "no-store",
      headers: headers(),
      credentials: "include",
    }
  );
  CheckErrors(response);
  return response.json();
}

export default async function Page() {
  const data = await getData();
  return (
    <TableContainer>
      <TableUsers paginationData={data.value} />
    </TableContainer>
  );
}
