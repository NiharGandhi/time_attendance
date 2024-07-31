import { client } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    console.log("POST");
    const { userName, userEmail, userOrgId, userOrgName, userRole, userStatus, deptId } = await req.json();
    console.log("Details", userName, userEmail, userOrgId, userOrgName, userRole, userStatus);

    try {
        const register = await client.orgMembers.create({
            data: {
                memberName: userName || "",
                memberEmail: userEmail || "",
                clerkOrganizationId: userOrgId,
                memberRole: userRole || "ADMIN",
                memberStatus: userStatus || "",
                departmentId: deptId
            }
        });


        return NextResponse.json(register);

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
