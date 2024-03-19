"use client";
import { useAuth } from "@/app/context/auth";
import Link from "next/link";
import { Button } from "../../ui/button";
import { useRouter } from "next/navigation";

export default function AuthButtons() {
  const { state, dispatch } = useAuth();
  const router = useRouter();
  console.log(state);
  return (
    <>
      {!state?.isLoggedIn ? (
        <>
          <Link href={"/register"}>
            <Button variant={"secondary"}>Register</Button>
          </Link>
          <Link href={"/login"}>
            <Button>Login</Button>
          </Link>
        </>
      ) : (
        <>
          <div>{state?.username}</div>
          <Button
            onClick={() => {
              dispatch({ type: "LOGOUT" });
              router.push("/");
            }}
          >
            Logut
          </Button>
        </>
      )}
    </>
  );
}
