import dynamic from "next/dynamic";

const AuthButtons = dynamic(() => import("./auth-buttons"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});

export default function Header() {
  return (
    <header
      className="fixed flex flex-row items-center justify-between
     top-0 left-0 w-full shadow-2xl h-16 px-14 border-b"
    >
      <div>Next.js-Go </div>
      <div className="flex flex-row items-center gap-4">
        <AuthButtons />
      </div>
    </header>
  );
}
