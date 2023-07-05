import AddCourseForm from "@/components/ui/forms/AddCourseForm";
import CenteredLayout from "@/components/ui/layout/Container";

export const metadata = {
    title: "Add Course",
    description: "Add Course Page",
};

export default function Page() {
    return (
        <CenteredLayout centered={false}>
            <AddCourseForm/>
        </CenteredLayout>
    );
}