import { client } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    console.log("POST");
    try {
        const { organizationName, organizationId, organizationLogo, organizationColorScheme, orgTimeZone, orgLocation, orgDateFormat } = await req.json();

        console.log("Details", organizationName, organizationId, organizationLogo, organizationColorScheme, orgTimeZone, orgLocation, orgDateFormat);

        const register = await client.organization.create({
            data: {
                name: organizationName,
                logo: organizationLogo,
                colorScheme: organizationColorScheme,
                clerkOrganizationId: organizationId,
                timezone: orgTimeZone,
                location: orgLocation,
                dateFormat: orgDateFormat,
            }
        })

        return NextResponse.json(register)

    } catch (error) {
        console.log(error);
    }
}


export async function PUT(req: Request) {
    console.log("PUT");
    try {
        const { organizationName, organizationId, orgTimeZone, orgLocation, orgDateFormat } = await req.json();

        console.log("Details", organizationName);

        const register = await client.organization.update({
            data: {
                name: organizationName,
                timezone: orgTimeZone,
                location: orgLocation,
                dateFormat: orgDateFormat,
            },
            where: {
                clerkOrganizationId: organizationId
            }
        });

        return NextResponse.json(register)

    } catch (error) {
        console.log(error);
    }
}


export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const organizationId = searchParams.get('organizationId');

        if (!organizationId) {
            return new NextResponse("Error Finding organization", { status: 404 });
        }

        const org = await client.organization.findUnique({
            where: {
                clerkOrganizationId: organizationId
            }
        })

        return NextResponse.json(org);

    } catch (error) {
        console.log(error);
    }
}