"use server";

import prisma from "@/lib/db";
import { sleep } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function addPet(formData) {
  await sleep(2000);

  try {
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
  } catch (error) {
    return {
      message: "Failed to add pet",
    };
  }

  revalidatePath("/app", "layout");
}

export async function editPet(petId, newPetData) {
  await sleep(2000);

  try {
    await prisma.pet.update({
      where: {
        id: petId,
      },
      data: {
        name: newPetData.get("name") as string,
        ownerName: newPetData.get("ownerName") as string,
        age: +(newPetData.get("age") as string),
        imageUrl:
          (newPetData.get("imageUrl") as string) ||
          ("https://bytegrad.com/course-assets/react-nextjs/pet-placeholder.png" as string),
        notes: newPetData.get("notes") as string,
      },
    });
  } catch (error) {
    return {
      message: "Failed to edit pet",
    };
  }

  revalidatePath("/app", "layout");
}

export async function checkoutPet(petId) {
  await sleep(2000);

  try {
    await prisma.pet.delete({
      where: {
        id: petId,
      },
    });
  } catch (error) {
    return {
      message: "Failed to checkout pet",
    };
  }

  revalidatePath("/app", "layout");
}
