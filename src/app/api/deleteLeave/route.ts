import { client } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    console.log("DELETE LEAVE");
    const { id } = await req.json();
    console.log("Details", id);

    try {

        await client.memberLeaves.deleteMany({
            where: {
                leaveId: id
            }
        })

        const register = await client.leaves.delete({
            where: {
                id: id
            }
        });


        return NextResponse.json(register);

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
