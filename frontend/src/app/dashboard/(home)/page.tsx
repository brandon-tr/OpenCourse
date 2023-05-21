import Card from "@/components/ui/Surfaces/Card";

export const metadata = {
  title: "Dashboard",
  description: "Admin Dashboard",
};

export default function Home() {
  return (
    <main className="flex justify-between w-full">
      <Card removeBg={true} title={"Dashboard"} centerTitle={true}>
        <div>
          <p>1heee</p>
        </div>
      </Card>
    </main>
  );
}
