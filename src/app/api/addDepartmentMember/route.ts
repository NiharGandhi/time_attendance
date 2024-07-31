import { client } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    console.log("POST");
    const { memberId, departmentId } = await req.json();
    console.log("Details", memberId, departmentId);

    try {
        const newDepartmentMember = await client.orgMembers.update({
            data: {
                departmentId: departmentId
            },
            where: {
                id: memberId
            }
        });


        return NextResponse.json(newDepartmentMember);

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
