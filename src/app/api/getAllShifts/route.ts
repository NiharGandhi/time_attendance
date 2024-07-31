import { client } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    console.log("GET");

    try {
        const allLeaves = await client.shifts.findMany({
            include: {
                department: true,
            }
        });
        return NextResponse.json(allLeaves);

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
