"use client";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import React, { useState } from "react";
import { RegisterRequest } from "../types/auth";
import { login, register } from "../api/auth";
import { useRouter } from "next/navigation";

export default function Register() {
  const [form, setForm] = useState<RegisterRequest>({
    email: "",
    password: "",
    username: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await register(form);
      router.push("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col  p-4 gap-2">
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
              <Label>Username</Label>
              <Input
                placeholder="Your username..."
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
            <div className="flex flex-row gap-2 items-center justify-between">
              <Label>Password Verication</Label>
              <Input
                placeholder="Password again..."
                type="password"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-[70%]"
              />
            </div>
            <Button type="submit" disabled={loading}>
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
