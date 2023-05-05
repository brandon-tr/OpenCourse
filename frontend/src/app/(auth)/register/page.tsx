import Image from "next/image";
import MaterialButton from "@/components/ui/inputs/MaterialButton";
import RegisterForm from "@/components/ui/forms/RegisterForm";
import Card from "@/components/ui/Surfaces/Card";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24 w-full">
      <Card title={"Register"} centerTitle={true}>
        <RegisterForm />
      </Card>
    </main>
  );
}
