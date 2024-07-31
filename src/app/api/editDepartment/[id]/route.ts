import { client } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { parse } from "url";

export async function PUT(req: Request,) {
    try {
        const { pathname } = parse(req.url);
        const departmentId = pathname?.split("/").pop();

        if (!departmentId) {
            return new NextResponse("UNAUTHORIZED", { status: 500 })
        }

        const { departmentName } = await req.json();

        const updatedDepartment = await client.departments.update({
            where: {
                id: departmentId
            },
            data: {
                departmentName: departmentName
            }
        });


        return NextResponse.json(updatedDepartment);
    } catch (error) {
        console.log("ERROR API", error);
    }
}