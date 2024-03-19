"use client";
import { Button } from "@/app/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import React, { useState } from "react";
import { LoginRequest } from "../types/auth";
import { login } from "../api/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/auth";

export default function Login() {
  const [form, setForm] = useState<LoginRequest>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { dispatch } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await login(form);
      dispatch({ type: "LOGIN", payload: res.data?.token });
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} className="flex flex-col w-96 p-4 gap-2">
          <div className="flex flex-row gap-2 items-center justify-between">
            <Label>Email</Label>
            <Input
              placeholder="example@example.com"
              type="email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-[70%]"
            />
          </div>
          <div className="flex flex-row gap-2 items-center justify-between">
            <Label>Password</Label>
            <Input
              placeholder="Password..."
              type="password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-[70%]"
            />
          </div>
          <Button type="submit" disabled={loading}>
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
}
