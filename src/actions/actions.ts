"use server";

import prisma from "@/lib/db";

export async function addPet(formData) {
  await prisma.pet.create({
    data: {
      name: formData.get("name") as string,
      ownerName: formData.get("ownerName") as string,
      age: +(formData.get("age") as string),
      imageUrl: formData.get("imageUrl") as string,
      notes: formData.get("notes") as string,
    },
  });
}
