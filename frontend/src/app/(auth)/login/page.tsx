import LoginForm from "@/components/ui/forms/LoginForm";
import Card from "@/components/ui/Surfaces/Card";
import CenteredLayout from "@/components/ui/layout/Container";
import { headers } from "next/headers";
import isMobileDevice from "@/components/utility/IsMobileDevice";

export default function Home() {
  const listHeaders = headers();
  const userAgent = listHeaders.get("user-agent");
  return (
    <CenteredLayout className="flex flex-col items-center justify-between p-24 w-full">
      <Card
        title={"Login"}
        isMobile={isMobileDevice(userAgent)}
        centerTitle={true}
      >
        <LoginForm />
      </Card>
    </CenteredLayout>
  );
}
