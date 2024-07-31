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
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import LeavePolicy from '@/components/forms/Policies';
import ShiftPolicy from '@/components/forms/ShiftPolicy';

const PoliciesPage = () => {

  const router = useRouter();

  return (
    <div className='p-2'>
      <h1 className="text-2xl">Organization Policies</h1>
      <Breadcrumb className="my-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-[#534FEB]">Org. Policies</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className='my-4'>
        <div className='p-2 border border-gray-300 rounded-md shadow-xl'>
          <div className='grid grid-cols-1 xl:grid-cols-2'>
            <div className='p-2'>
              <div className='flex items-center justify-between'>
                <h2>Leave Policies</h2>
                <Button
                  variant="outline"
                  onClick={() => router.push('/organization/policies/leave-policy')}
                >Add Policies</Button>
              </div>
              <LeavePolicy />
            </div>
            <div className='p-2'>
              <div className='flex items-center justify-between'>
                <h2>Shifts</h2>
                <Button 
                  variant="outline"
                  onClick={() => router.push('/organization/policies/shifts')}
                >Add Shifts</Button>
              </div>
              <ShiftPolicy />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PoliciesPage