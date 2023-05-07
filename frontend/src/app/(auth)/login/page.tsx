import LoginForm from "@/components/ui/forms/LoginForm";
import Card from "@/components/ui/Surfaces/Card";
import CenteredLayout from "@/components/ui/layout/Container";

export default function Home() {
  return (
    <CenteredLayout className="flex flex-col items-center justify-between p-24 w-full">
      <Card title={"Login"} centerTitle={true}>
        <LoginForm />
      </Card>
    </CenteredLayout>
  );
}
