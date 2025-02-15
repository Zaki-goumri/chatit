import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define the expected shape of the request body
interface RegisterRequestBody {
  email: string;
  password: string;
  name: string;
}

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = (await req.json()) as RegisterRequestBody;

    // Validate the request body
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json(
        { error: "Email and password and Name are required" },
        { status: 400 },
      );
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }
    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        password: body.password,
      },
    });

    // Return the newly created user
    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
