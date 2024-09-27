"use client";

import { createCheckoutSession } from "@/actions/actions";
import ContentBlock from "@/components/content-block";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";
import { LightningBoltIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [isPending, startTransition] = useTransition();
  const { data: session, update, status } = useSession();
  const router = useRouter();

  return (
    <main className="flex flex-col items-center space-y-10">
      <H1>PetSoft acces requires payment</H1>

      {searchParams.success && (
        <Button
          onClick={async () => {
            await update(true);
            router.push("/app/dashboard");
          }}
          disabled={status === "loading" || session?.user.hasAccess}
        >
          Access PetSoft
        </Button>
      )}

      {!searchParams.success && (
        <>
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

          <ContentBlock className="p-4">
            <h2 className="text-lg">
              <LightningBoltIcon className="w-6 h-6 inline-block" /> For testing
              purposes, you can use the following card details:
            </h2>
            <ul className="ml-[30px]">
              <li>Card number: 4242 4242 4242 4242</li>
              <li>Expiry date: 04/44</li>
              <li>CVC: 444</li>
              <li>Full Name: 4</li>
            </ul>
          </ContentBlock>
        </>
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
