import { client } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    // console.log("POST");
    const { leaveTitle, leaveDescription, leaveDays, carryOverDays, isActive, clerkOrganizationId } = await req.json();
    // console.log("Details", leaveTitle, leaveDescription, leaveDays, carryOverDays);

    try {
        const registerLeave = await client.leaves.create({
            data: {
                leaveTitle: leaveTitle,
                leaveDescription: leaveDescription,
                leaveDays: leaveDays,
                carryOverDays: carryOverDays,
                isActive: isActive,
                clerkOrganizationId: clerkOrganizationId,
            }
        });

        // If leave is active, assign it to all employees.
        if (isActive) {
            const members = await client.orgMembers.findMany({
                where: {
                    clerkOrganizationId: clerkOrganizationId
                }
            });

            const memberLeaveData = members.map(member => ({
                memberId: member.id,
                leaveId: registerLeave.id
            }));

            await client.memberLeaves.createMany({
                data: memberLeaveData
            });
        }        


        return NextResponse.json(registerLeave);

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
