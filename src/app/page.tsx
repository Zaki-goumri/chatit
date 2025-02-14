import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted">
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <MessageCircle className="mx-auto h-12 w-12 text-primary" />
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Welcome to ChatSync</h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Connect with people around the world in real-time. Start chatting now!
          </p>
        </div>
        <div className="space-x-4">
          <Link href="/login">
            <Button size="lg">Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" size="lg">Register</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}