import TableContainer from "@/components/ui/layout/TableContainer";
import TableUsers from "@/components/TablePages/users/TableUsers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export interface UserRoleResponseDto {
  id: number;
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

async function getData() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/User/GetAllUsers?PageNumber=1&PageSize=10`,
    {
      cache: "default",
      headers: headers(),
      next: {
        revalidate: 60,
      },
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

export default async function Home() {
  const data = await getData();
  return (
    <TableContainer>
      <TableUsers paginationData={data.value} />
    </TableContainer>
  );
}
