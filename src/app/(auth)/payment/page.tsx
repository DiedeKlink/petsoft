"use client";

import { createCheckoutSession } from "@/actions/actions";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

export default function Page({ searchParams }) {
  const [isPending, startTransition] = useTransition();

  return (
    <main className="flex flex-col items-center space-y-10">
      <H1>PetSoft acces requires payment</H1>

      {!searchParams.success && (
        <Button
          disabled={isPending}
          onClick={async () => {
            startTransition(async () => {
              await createCheckoutSession();
            });
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
      {searchParams.cancelled && (
        <p className="text-sm text-red-700">
          Payment cancelled. You can try again.
        </p>
      )}
    </main>
  );
}
