"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store";
import type { User } from "@/lib/store";

// Define the form schema using Zod
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginRequest = { email: string; password: string };
type LoginResponse = { user: { email: string; name: string; id: number } };

export default function LoginPage() {
  const [isMounted, setIsMounted] = useState(false);
  const setUser = useUserStore((state) => state.setUser);
  const router = useRouter();

  // Initialize useForm with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Define the login mutation
  const loginUser = async (data: LoginRequest): Promise<User> => {
    const response = await axios.post<LoginResponse>("/login/api", data);
    return { email: response.data.user.email, name: response.data.user.name };
  };

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setUser({ ...data }); // Update the user state in Zustand
      router.push("/chat"); // Redirect to the chat page
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response) {
        console.log((error.response.data as { error?: string }).error);
        alert(error.response.data.error || "Login failed");
      } else {
        console.error("Unknown error:", error);
        alert("An unknown error occurred");
      }
    },
  });

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  // Ensure the component is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <MessageCircle className="mx-auto h-8 w-8 text-primary" />
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your credentials to continue</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                {...register("email")}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                {...register("password")}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? "Logging in..." : "Login"}
            </Button>
            <span className="text-sm text-muted-foreground text-center">
              Dont have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Register
              </Link>
            </span>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}