"use client";

import { createCheckoutSession } from "@/actions/actions";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";

export default function Page({ searchParams }) {
  console.log(searchParams);
  return (
    <main className="flex flex-col items-center space-y-10">
      <H1>PetSoft acces requires payment</H1>

      {!searchParams.success && (
        <Button
          onClick={async () => {
            await createCheckoutSession();
          }}
        >
          Buy lifetime acces for $299
        </Button>
      )}

      {searchParams.success && (
        <div>
          <p className="text-sm text-green-700">
            Payment succesful! You now have lifetime acces to PetSoft.
          </p>
        </div>
      )}
    </main>
  );
}
