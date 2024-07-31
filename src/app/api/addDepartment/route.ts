import { client } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    // console.log("POST");
    const { departmentName, clerkOrganizationId } = await req.json();
    // console.log("Details", leaveTitle, leaveDescription, leaveDays, carryOverDays);

    try {
        const registerdepartment = await client.departments.create({
            data: {
                departmentName: departmentName,
                clerkOrganizationId: clerkOrganizationId,
            }
        });

        return NextResponse.json(registerdepartment);

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
