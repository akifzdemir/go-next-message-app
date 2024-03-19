import Link from "next/link";
import { Button } from "./components/ui/button";

export default function Home() {
  return (
    <main className="h-screen flex flex-col gap-12 items-center justify-center">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Go - Next.js Socket App
      </h1>
      <Link href={"/rooms"}>
        <Button>See Rooms</Button>
      </Link>
    </main>
  );
}
