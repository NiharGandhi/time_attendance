import { client } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    console.log("GET");
    try {
        const register = await client.orgMembers.findMany({
            select: {
                clerkOrganizationId: true,
                id: true,
                memberName: true,
                memberEmail: true,
                memberPhone: true,
                memberRole: true,
                memberStatus: true,
                department: {
                    select: {
                        departmentName: true
                    }
                },
                memberLeaves: true,
                memberShifts: true
            }
        });

        // Map over the register array to extract department names
        const formattedData = register.map(member => ({
            clerkOrganizationId: member.clerkOrganizationId,
            id: member.id,
            memberName: member.memberName,
            memberEmail: member.memberEmail,
            memberPhone: member.memberPhone,
            memberRole: member.memberRole,
            memberStatus: member.memberStatus,
            memberShifts: member.memberShifts,
            memberLeaves: member.memberLeaves,
            memberDepartment: member.department.departmentName,
        }));

        return NextResponse.json(formattedData);

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "An error occurred while fetching data." }, { status: 500 });
    }
}
