import MaterialButton from "@/components/ui/inputs/MaterialButton";
import Card from "@/components/ui/Surfaces/Card";
import Link from "next/link";
import CenteredLayout from "@/components/ui/layout/Container";

export default function Home() {
  return (
    <CenteredLayout
      centered={true}
      className="flex flex-col items-center justify-between p-6 md:p-24 w-full"
    >
      <Card title="OpenCourse" subtitle="Get Started">
        <p className="py-2">
          OpenCourse is a free and open source platform for creating and sharing
          courses. It is built with Next.js and TailwindCSS. It is designed to
          be easy to use and easy to customize.
        </p>
        <Link href={"/login"}>
          <MaterialButton size={"full"}>Get Started</MaterialButton>
        </Link>
      </Card>
    </CenteredLayout>
  );
}
