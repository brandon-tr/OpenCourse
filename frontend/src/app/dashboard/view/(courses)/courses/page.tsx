import CenteredLayout from "@/components/ui/layout/Container";
import {headers} from "next/headers";
import {CheckErrors} from "@/components/utility/HandleFetchErrors";
import TableCourses from "@/components/TablePages/Courses/TableCourses";

export const metadata = {
    title: "View Course",
    description: "View Courses Page",
};

export interface CourseDto {
    id: number;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    image: string;
    videoCount: number;
}


export interface PagedCoursesResponseDto {
    courses: CourseDto[];
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    hasPrevious: boolean;
    hasNext: boolean;
}

async function getData() {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/Course`,
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
    console.log(data)
    return (
        <CenteredLayout centered={false}>
            <TableCourses paginationData={data}/>
        </CenteredLayout>
    );
}