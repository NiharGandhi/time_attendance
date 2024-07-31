import { client } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    console.log("POST");
    try {
        const { organizationId, inviterUserId, emailAddress, role } = await req.json();

        console.log("Details", organizationId, inviterUserId, emailAddress, role);

        // const db = await client.orgMembers.create({
        //     data: {
        //         memberName:
        //     }
        // })

        const response = await clerkClient.organizations.createOrganizationInvitation({ 
            organizationId, 
            inviterUserId, 
            emailAddress, 
            role, 
            redirectUrl: 'http://localhost:3000/auth/user-sign-up' });


        return NextResponse.json(response)

    } catch (error) {
        console.log(error);
    }
}

export async function GET() {
    const response = await clerkClient.invitations.getInvitationList();

    return NextResponse.json(response);
}

export async function DELETE(req: Request) {
    const { id } = await req.json();

    const invitationId = id;

    const response = await clerkClient.invitations.revokeInvitation(invitationId);

    console.log(response);

    return NextResponse.json(response);
}