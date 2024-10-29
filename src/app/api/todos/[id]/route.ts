import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

interface Segments {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Segments) {
  // tomamos el id de los paramos
  const { id } = params;

  // buscamos el todo por id
  const todo = await prisma.todo.findFirst({
    where: { id },
  });

  // si no lo encuentra, retornamos un 404
  if (!todo) {
    return NextResponse.json(
      { message: `todo con id ${id} no existe ` },
      { status: 404 }
    );
  }

  return NextResponse.json(todo);
}
