import Accordion from "@/components/ui/Surfaces/accordion/Accordion";
import CenteredLayout from "@/components/ui/layout/Container";

export default function Home() {
  return (
    <CenteredLayout className="flex flex-col items-center justify-between p-6 md:p-24 w-full gap-4">
      <Accordion
        title={"What is the purpose of this website?"}
        content={
          "This website is a personal project of mine. " +
          "I wanted to create a website that would allow me to showcase my skills as a developer and designer. " +
          "I also wanted to create a website that would allow me to share my thoughts and ideas with the world. " +
          "I hope you enjoy it!"
        }
      />
      <Accordion title={"How do I use this"} content={"No clue"} />
    </CenteredLayout>
  );
}
