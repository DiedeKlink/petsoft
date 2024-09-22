import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export default function PetForm({
  actionType,
}: {
  actionType: "add" | "edit";
}) {
  return (
    <form className="flex flex-col">
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" />
        </div>
        <div>
          <Label htmlFor="ownerName">Owner Name</Label>
          <Input id="ownerName" type="text" />
        </div>
        <div>
          <Label htmlFor="imageUrl">Image Url</Label>
          <Input id="imageUrl" type="text" />
        </div>
        <div>
          <Label htmlFor="age">Age</Label>
          <Input id="age" type="number" />
        </div>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" rows={3} />
        </div>
      </div>

      <Button type="submit" className="mt-5 self-end">
        {actionType === "add" ? "Add a new pet" : "Edit pet"}
      </Button>
    </form>
  );
}
