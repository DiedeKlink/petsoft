"use server";

import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function addPet(formData) {
  await prisma.pet.create({
    data: {
      name: formData.get("name") as string,
      ownerName: formData.get("ownerName") as string,
      age: +(formData.get("age") as string),
      imageUrl:
        (formData.get("imageUrl") as string) ||
        ("https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png" as string),
      notes: formData.get("notes") as string,
    },
  });

  revalidatePath("/app", "layout");
}
