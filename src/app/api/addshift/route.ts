import { client } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    console.log("POST");
    const { shiftTitle, shiftDescription, shiftStartDate, shiftEndDate, shiftStartTime, shiftEndTime, isActive, clerkOrganizationId, departments } = await req.json();

    try {
        const registerShift = await client.shifts.create({
            data: {
                shiftTitle: shiftTitle,
                shiftDescription: shiftDescription,
                shiftStartDate: shiftStartDate,
                shiftEndDate: shiftEndDate,
                shiftStartTime: shiftStartTime,
                shiftEndTime: shiftEndTime,
                isActive: isActive,
                clerkOrganizationId: clerkOrganizationId,
                departmentId: departments
            }
        });

        // If shift is active, assign it to all employees in the department.
        if (isActive) {
            // Fetch members of the specified departments
            const departmentMembers = await client.orgMembers.findMany({
                where: {
                    departmentId: departments
                },
            });

            // Map members to MemberShifts data
            const memberShiftsData = departmentMembers.map(departmentMember => ({
                memberId: departmentMember.id,
                shiftId: registerShift.id,
                shiftName: registerShift.shiftTitle
            }));

            // Create MemberShifts entries
            await client.memberShifts.createMany({
                data: memberShiftsData
            });
        }        


        return NextResponse.json(registerShift);

    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "An error occurred" }, { status: 500 });
    }
}
