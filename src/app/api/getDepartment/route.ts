import { client } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    console.log("GET");

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); 

    if (!id) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const leave = await client.departments.findUnique({
            where: {
                id: id
            }
        });
        return NextResponse.json(leave);

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
