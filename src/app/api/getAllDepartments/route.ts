import { client } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    console.log("GET");

    const { searchParams } = new URL(req.url); 
    const clerkOrganizationId = searchParams.get("organizationId");

    console.log(clerkOrganizationId);

    if (!clerkOrganizationId) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const allLeaves = await client.departments.findMany({
            where: {
                clerkOrganizationId: clerkOrganizationId
            }
        });
        return NextResponse.json(allLeaves);

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
