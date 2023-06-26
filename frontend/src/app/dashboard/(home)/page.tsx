import Card from "@/components/ui/Surfaces/Card";
import UserCountWebHook from "@/components/WebSockets/UserCountWebHook";

export const metadata = {
  title: "Dashboard",
  description: "Admin Dashboard",
};

export default  function Page() {
  return (
    <main className="flex justify-between w-full">
      <Card removeBg={true} title={"Dashboard"} centerTitle={true}>
        <div>
          Current Users: <UserCountWebHook />
        </div>
      </Card>
    </main>
  );
}
