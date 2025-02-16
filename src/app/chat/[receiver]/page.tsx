"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Settings, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { useSocket } from "@/app/hooks/useSocket";
import { v4 as uuidv4 } from "uuid";
import { useUserStore } from "@/lib/store";
import { useParams } from "next/navigation";

interface Message {
  id: string;
  sender: string; // Sender's ID
  receiver: string; // Receiver's ID
  content: string; // Message content
  timestamp: string; // Timestamp
  isMe: boolean; // Whether the message is sent by the current user
  avatar?: string; // Optional avatar URL
}

export default function ChatPage() {
  const { receiver } = useParams(); // Extract receiver from the URL
  const user = useUserStore((state) => state.user); // Current user (sender)
  const { isConnected, messages: socketMessages, sendMessage } = useSocket();
  const [newMessage, setNewMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const newMessages = socketMessages.map((msg) => {
      if (typeof msg === "string") {
        return {
          id: uuidv4(),
          sender: "unknown", 
          receiver: receiver as string, 
          content: msg,
          timestamp: new Date().toLocaleTimeString(),
          isMe: false,
        };
      }
      return { ...msg, id: msg.id || uuidv4(), isMe: false };
    });

    setMessages((prevMessages) => {
      const uniqueNewMessages = newMessages.filter(
        (newMsg) => !prevMessages.some((prevMsg) => prevMsg.id === newMsg.id)
      );
      return [...prevMessages, ...uniqueNewMessages];
    });
  }, [socketMessages, receiver]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const sentMessage = {
        id: uuidv4(), 
        sender: user?.id ?? "Me", 
        receiver: receiver as string, 
        content: newMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMe: true, 
        avatar:
          "https://media.licdn.com/dms/image/v2/D4D03AQHXpJebXN8V6g/profile-displayphoto-shrink_100_100/B4DZP3_UD_GUAU-/0/1735032392292?e=1744848000&v=beta&t=-hJBPowYamc7cbkZndwgynr9VwC-bKOG3rvld9ZfTlA",
      };
      sendMessage(sentMessage); 
      setMessages((prev) => [...prev, sentMessage]); 
      setNewMessage(""); 
    }
  };

  return (
    <main className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-card shadow-lg transition-transform duration-200 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="https://avatars.githubusercontent.com/u/153986120?v=4" />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p
                  className={`mb-4 text-center ${
                    isConnected ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isConnected ? "Connected" : "Disconnected"}
                </p>
              </div>
            </div>
          </div>
          <ScrollArea className="flex-1 border-t">
            <div className="p-4 space-y-4">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
              <Link href="/">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </Link>
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">Chat with {receiver}</h1>
            <div className="w-9" /> {/* Spacer for alignment */}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center">
                <p className="text-muted-foreground">No messages yet...</p>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 ${
                  message.isMe ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.avatar} />
                  <AvatarFallback>{message.sender}</AvatarFallback>
                </Avatar>
                <div className={`max-w-[70%] space-y-1`}>
                  <div
                    className={`rounded-lg p-3 ${
                      message.isMe
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef}></div>
          </div>
        </ScrollArea>

        {/* Message Input */}
        <form onSubmit={handleSubmit} className="border-t p-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}