import Link from "next/link";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <header
      className="fixed flex flex-row items-center justify-between
     top-0 left-0 w-full shadow-2xl h-16 px-14 border-b"
    >
      <div>Next.js-Go </div>
      <div className="flex flex-row items-center gap-4">
        <Link href={"/register"}>
          <Button variant={"secondary"}>Register</Button>
        </Link>
        <Link href={"/login"}>
          <Button>Login</Button>
        </Link>
      </div>
    </header>
  );
}
