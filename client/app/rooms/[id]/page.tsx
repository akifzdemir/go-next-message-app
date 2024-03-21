"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useAuth } from "@/app/context/auth";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { cn } from "@/app/lib/utils";

type Message = {
  Content: string;
  Username: string;
};

export default function Page({ params }: { params: { id: string } }) {
  const { state } = useAuth();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (state.isLoggedIn === true) {
      const newWs = new WebSocket(
        `ws://localhost:8080/ws/join-room/${params.id}?userId=${state.userId}&username=${state.username}`
      );
      newWs.onopen = () => {
        toast.success("Joined room", { position: "top-center" });
      };

      newWs.onmessage = (event) => {
        const message: Message = JSON.parse(event.data);
        setMessages((prev) => [...prev, message]);
      };

      newWs.onclose = () => {
        console.log("WebSocket disconnected");
      };

      setWs(newWs);
    }
  }, [state, params.id]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (ws && message.trim() !== "") {
      ws.send(message);
      setMessage("");
    }
  };

  return (
    <div className="h-screen flex  pt-24 px-12 flex-col justify-between">
      <div className="flex gap-3 flex-col">
        {messages?.map((message, i) => (
          <Card
            className={cn(
              "p-0 w-1/3",
              state.username === message.Username ? "self-end " : "self-start",
              message.Content === "A User has joined the room" && "self-center"
            )}
            key={i}
          >
            <CardHeader className="p-1"> {message.Username}</CardHeader>
            <CardContent className="p-1">{message.Content}</CardContent>
          </Card>
        ))}
      </div>
      <form
        onSubmit={sendMessage}
        className="flex flex-row mt-4  pb-12 items-center gap-6 justify-between"
      >
        <Input
          placeholder="Message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
