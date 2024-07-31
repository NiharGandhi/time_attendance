import { client } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    console.log("DELETE POST");
    const { userEmail, id } = await req.json();
    console.log("Details", userEmail);

    try {

        const invitationId = id;

        const response = await clerkClient.invitations.revokeInvitation(invitationId);

        const register = await client.orgMembers.delete({
            where: {
                memberEmail: userEmail || ""
            }
        });


        return NextResponse.json(register);

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
