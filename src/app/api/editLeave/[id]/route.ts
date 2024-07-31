import { client } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { parse } from "url";

export async function PUT(req: Request,) {
    try {
        const { pathname } = parse(req.url);
        const leaveId = pathname?.split("/").pop();

        if (!leaveId) {
            return new NextResponse("UNAUTHORIZED", { status: 500 })
        }

        const { title, description, days, carryOver, isActive, clerkOrganizationId } = await req.json();

        const updatedLeave = await client.leaves.update({
            where: {
                id: leaveId
            },
            data: {
                leaveTitle: title,
                leaveDescription: description,
                leaveDays: days,
                carryOverDays: carryOver,
                isActive: isActive,
            }
        });

        if (isActive) {
            const members = await client.orgMembers.findMany({
                where: {
                    clerkOrganizationId: clerkOrganizationId
                }
            });

            const memberLeaveData = members.map(member => ({
                memberId: member.id,
                leaveId: updatedLeave.id,
            }));

            await client.memberLeaves.deleteMany({
                where: {
                    leaveId: leaveId
                }
            });

            await client.memberLeaves.createMany({
                data: memberLeaveData
            });
        } else {
            await client.memberLeaves.deleteMany({
                where: {
                    leaveId: leaveId
                }
            })
        }




        return NextResponse.json(updatedLeave);
    } catch (error) {
        console.log("ERROR API", error);
    }
}