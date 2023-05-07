import RegisterForm from "@/components/ui/forms/RegisterForm";
import Card from "@/components/ui/Surfaces/Card";
import CenteredLayout from "@/components/ui/layout/Container";

export default function Home() {
  return (
    <CenteredLayout className="flex flex-col items-center justify-between p-24 w-full">
      <Card title={"Register"} centerTitle={true}>
        <RegisterForm />
      </Card>
    </CenteredLayout>
  );
}
