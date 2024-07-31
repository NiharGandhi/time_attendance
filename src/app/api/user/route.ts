import { client } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    console.log("POST");
    try {
        const { userName, userEmail, userOrgId, userOrgName, userRole, userStatus, departmentId } = await req.json();

        console.log("Details", userEmail, userOrgId, userOrgName);

        const register = await client.orgMembers.create({
            data: {
                memberName: userName || "",
                memberEmail: userEmail || "",
                clerkOrganizationId: userOrgId || "",
                memberOrg: userOrgName,
                memberRole: userRole || "ADMIN",
                memberStatus: userStatus || "",
                departmentId: departmentId || ""
            }
        })

        return NextResponse.json(register)

    } catch (error) {
        console.log(error);
    }
}

export async function PUT(req: Request) {
    console.log("UPDATE DETAIL of USER");
    try {
        const { memberId, memberName, memberEmail, clerkOrganizationId, memberStatus, memberDepartment } = await req.json();

        console.log("Details", memberId, memberName, memberEmail, clerkOrganizationId, memberStatus, memberDepartment);

        const register = await client.orgMembers.update({
            data: {
                memberName: memberName || "",
                memberEmail: memberEmail || "",
                clerkOrganizationId: clerkOrganizationId || "",
                memberStatus: memberStatus || "",
                departmentId: memberDepartment || ""
            },
            where: {
                id: memberId
            }
        })

        return NextResponse.json(register)

    } catch (error) {
        console.log(error);
    }
}