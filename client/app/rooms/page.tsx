import Link from "next/link";
import { Button } from "../components/ui/button";
import { Card, CardHeader } from "../components/ui/card";
import { RoomResponse } from "../types/ws";

async function getData() {
  const res = await fetch("http://localhost:8080/ws/rooms", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Rooms() {
  const data = await getData();
  const rooms: RoomResponse[] = data?.rooms;
  return (
    <div className="grid grid-cols-3 gap-4 px-12 pt-24">
      {rooms.map((room) => (
        <Card key={room.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <span>{room.name}</span>
            <Link href={`/rooms/${room.id}`}>
              <Button variant={"default"}>Join</Button>
            </Link>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
