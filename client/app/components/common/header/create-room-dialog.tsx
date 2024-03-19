"use client";
import { createRoom } from "@/app/api/ws";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { RoomRequest } from "@/app/types/ws";
import React, { useState } from "react";
import { toast } from "sonner";

export function CreateRoomDialog() {
  const [form, setForm] = useState<RoomRequest>({
    name: "",
  });
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await createRoom(form);
      toast("Room Created");
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Room</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Room</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="flex flex-row items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Room Name"
                className="col-span-3"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
