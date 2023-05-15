import CenteredLayout from "@/components/ui/layout/Container";
import Card from "@/components/ui/Surfaces/Card";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import CheckError from "@/components/utility/CheckNextRedirectError";
import UpdateUserForm from "@/components/ui/forms/UpdateUserForm";

async function getUserData(id: number) {
  "use server";
  try {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/User/${Number.parseInt(String(id))}`,
      { headers: headers() }
    );
    if (request.status === 401) {
      return redirect(
        `/login?errors=${process.env.NEXT_PUBLIC_ERRORS_UNAUTHORIZED}`
      );
    }
    return request.json();
  } catch (e) {
    CheckError(e);
    return redirect(`/dashboard?errors=unknown`);
  }
}

async function getRoleData(id: number) {
  "use server";
  try {
    const request = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/Role/GetAllRoles`,
      {
        headers: headers(),
      }
    );
    return request.json();
  } catch (e) {
    return redirect(`/dashboard?errors=unknown`);
  }
}

export default async function Home({ params }: { params: { id: number } }) {
  const { id } = params;
  const userData = getUserData(id);
  const roleData = getRoleData(id);

  const [user, role] = await Promise.all([userData, roleData]);

  const name = `${user.firstName} ${user.lastName}`;
  return (
    <CenteredLayout>
      <Card title={`Update ${name}`} removeBg={true} centerTitle={true}>
        <UpdateUserForm user={user} role={role} />
      </Card>
    </CenteredLayout>
  );
}
