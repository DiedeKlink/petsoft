"use client";

import { addPet, checkoutPet, editPet } from "@/actions/actions";
import { PetEssentials } from "@/lib/types";
import { Pet } from "@prisma/client";

import React, {
  createContext,
  startTransition,
  useOptimistic,
  useState,
} from "react";
import { toast } from "sonner";

type PetContextProviderProps = {
  children: React.ReactNode;
  data: Pet[];
};

type TPetContext = {
  pets: Pet[];
  selectedPetId: Pet["id"] | null;
  selectedPet: Pet | undefined;
  numberOfPets: number;
  handleChangeSelectedPetId: (id: Pet["id"]) => void;
  handleCheckoutPet: (id: Pet["id"]) => Promise<void>;
  handleAddPet: (newPet: PetEssentials) => Promise<void>;
  handleEditPet: (petId: Pet["id"], newPetData: PetEssentials) => Promise<void>;
};

export const PetContext = createContext<TPetContext | null>(null);

export default function PetContextProvider({
  children,
  data,
}: PetContextProviderProps) {
  //state
  const [optimisticPets, setOptimisticPets] = useOptimistic(
    data,
    (state, { action, payload }) => {
      switch (action) {
        case "add":
          return [...state, { ...payload, id: Math.random().toString() }];
        case "edit":
          return state.map((pet) =>
            pet.id === payload.petId ? { ...pet, ...payload.newPetData } : pet
          );
        case "delete":
          return state.filter((pet) => pet.id !== payload);
        default:
          return state;
      }
    }
  );
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  //derived state
  const selectedPet = optimisticPets.find((pet) => pet.id === selectedPetId);
  const numberOfPets = optimisticPets.length;

  //event handlers / actions

  const handleAddPet = async (newPet: PetEssentials) => {
    setOptimisticPets({ action: "add", payload: newPet });
    const error = await addPet(newPet);
    if (error) {
      toast.warning(error.message);
    }
  };

  const handleEditPet = async (petId: Pet["id"], newPetData: PetEssentials) => {
    setOptimisticPets({ action: "edit", payload: { petId, newPetData } });
    const error = await editPet(petId, newPetData);
    if (error) {
      toast.warning(error.message);
    }
  };

  const handleCheckoutPet = async (id: Pet["id"]) => {
    setOptimisticPets({ action: "delete", payload: id });
    const error = await checkoutPet(id);
    if (error) {
      toast.warning(error.message);
    }

    setSelectedPetId(null);
  };

  const handleChangeSelectedPetId = (id: Pet["id"]) => {
    setSelectedPetId(id);
  };
  return (
    <PetContext.Provider
      value={{
        pets: optimisticPets,
        selectedPetId,
        selectedPet,
        handleChangeSelectedPetId,
        numberOfPets,
        handleCheckoutPet,
        handleAddPet,
        handleEditPet,
      }}
    >
      {children}
    </PetContext.Provider>
  );
}
