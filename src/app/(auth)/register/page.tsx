"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Cone, MessageCircle } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store";
import type { User } from "@/lib/store";

type RegisterRequest = { email: string; password: string; name: string };
type RegisterResponse = { user:{ email: string; password: string; name: string,id:number }};


const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password must be less than 100 characters"),
});

export default function RegisterPage() {
  const [isMounted, setIsMounted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  
  const setUser = useUserStore(state => state.setUser);

  const registerUser = async (data: RegisterRequest): Promise<User> => {
    const response = await axios.post<RegisterResponse>("/register/api", data);
    return {email:response.data.user.email,name:response.data.user.name}; 
  }; 
  
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      setUser({...data});
      router.push("/chat");
    },
  
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response) {
        console.log((error.response.data as { error?: string }).error);
      } else {
        console.error("Unknown error");
      }
    }
  });

  
  function onSubmit(values: z.infer<typeof formSchema>) {
      mutation.mutate(values);
    }
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <MessageCircle className="mx-auto h-8 w-8 text-primary" />
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Enter your information to get started</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Name"
                {...register("name")}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
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
            <Button type="submit" className="w-full">Register</Button>
            <span className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </span>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}