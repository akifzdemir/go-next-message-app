import dynamic from "next/dynamic";
import Link from "next/link";

const AuthButtons = dynamic(() => import("./auth-buttons"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function Header() {
  return (
    <header
      className="fixed flex flex-row items-center justify-between
     top-0 left-0 w-full bg-black shadow-2xl h-16 px-14 border-b"
    >
      <Link href={"/"}>Next.js-Go </Link>
      <div className="flex flex-row items-center gap-4">
        <AuthButtons />
      </div>
    </header>
  );
}
