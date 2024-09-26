import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <main className="flex flex-col items-center space-y-10">
      <H1>PetSoft acces requires payment</H1>

      <Button>Buy lifetime acces for $299</Button>
    </main>
  );
}
