'use client';

import React from 'react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useOrganization } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { ShiftForm } from '@/components/forms/AddShiftForm';

const page = () => {

    const { organization, isLoaded } = useOrganization()

    if (!isLoaded) {
        return (
            <p>Loading...</p>
        )
    };

    if (!organization) {
        redirect('/');
    }

    return (
        <div className='p-2'>
            <h1 className="text-2xl">My Organization</h1>
            <Breadcrumb className="my-1">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/organization">My Organization</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Policies</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-[#534FEB]">Leaves</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className='my-4'>
                <ShiftForm clerkOrganizationId={organization.id} />
            </div>
        </div>
    )
}

export default page