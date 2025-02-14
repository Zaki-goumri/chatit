"use client";

import { useState,useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Settings, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { useSocket } from '@/app/hooks/useSocket';
import { v4 as uuidv4 } from 'uuid';



interface Message {
  id: unknown;
  sender: string;
  content: string;
  timestamp: string;
  avatar?: string;
}

export default function ChatPage() {
  
  const { isConnected, messages, sendMessage } = useSocket();
  // const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (newMessage.trim()) {
        const sentMessage: Message = {
              id: uuidv4(),
              sender: "Me",
              content: newMessage,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              // isMe: true,
              avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&q=80",
            };
        sendMessage(sentMessage);
        setNewMessage('');
      }
    };
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-card shadow-lg transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}>
        <div className="flex h-full flex-col">
          <div className="p-4">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&q=80" />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Sarah Wilson</p>
                <p className={`mb-4 text-center ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
                          {isConnected ? 'Connected' : 'Disconnected'}
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
                <Button variant="ghost" className="w-full justify-start text-destructive">
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
            <h1 className="text-lg font-semibold">Chat</h1>
            <div className="w-9" /> {/* Spacer for alignment */}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {
              messages.length === 0 && (
                <div className="flex items-center justify-center">
                  <p className="text-muted-foreground">No messages yet...</p>
                </div>
              )
            
            }
            {messages.map((message) => (
              <div
                key={Number(message.id)}
                className={`flex items-start space-x-2 ${
                  true ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.avatar} />
                  <AvatarFallback>{message.sender[0]}</AvatarFallback>
                </Avatar>
                <div className={`max-w-[70%] space-y-1`}>
                  <div
                    className={`rounded-lg p-3 ${
                      true
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p>{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {message.timestamp}
                  </p>
                </div>
              </div >
            ))}
            <div ref={messagesEndRef}>
            </div>
          </div>
        </ScrollArea>

        {/* Message Input */}
        <form  onSubmit={handleSubmit}  className="border-t p-4">
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
    </div>
  );
}