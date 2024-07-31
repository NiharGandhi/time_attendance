import { InvitationList, InviteMember } from '@/components/forms/InvitationList'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'

import React from 'react'

const page = () => {
    return (
        <div className='p-2'>
            <h1 className="text-2xl">Invite Employees</h1>
            <Breadcrumb className="my-1">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-[#534FEB]">Invite Employees</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className='my-4'>
                <InviteMember />
                <InvitationList />
            </div>
        </div>
    )
}

export default page