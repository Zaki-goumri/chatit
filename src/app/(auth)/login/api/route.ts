import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define the expected shape of the request body
interface LoginRequestBody {
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = (await req.json()) as LoginRequestBody;

    // Validate the request body
    if (!body.email || !body.password ) {
      return NextResponse.json(
        { error: "Email and password and are required" },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email},
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "User already does not exist" },
        { status: 400 }
      );
    }
    if (body.password !== existingUser.password) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 400 }
      );
    }

    // Return the newly created user
    return NextResponse.json({ user: existingUser }, { status: 200 });
  } catch (error) {
    console.error("Error loiging user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}