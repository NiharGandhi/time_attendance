'use client';

import React, { useEffect, useState } from 'react'
import LeaveCards from '../cards/LeaveCards'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { type Departments } from "@prisma/client"
import { useOrganization } from '@clerk/nextjs'
import DepartmentCards from '../cards/DepartmentCards';

const Departments = ({ organizationId }: { organizationId: string }) => {

    console.log(organizationId);

    const [allLeave, setAllLeave] = useState<Departments[]>([]);

    const router = useRouter();

    useEffect(() => {
        fetchAllLeaves();
    }, []);

    const fetchAllLeaves = async () => {
        const response = await axios.get('/api/getAllDepartments', {
            params: {
                organizationId: organizationId
            }
        });
        setAllLeave(response.data);
        console.log(response.data);
    }

    return (
        <div className='p-2'>
            <div className='flex flex-col'>
                <div>
                    <div className='flex justify-between items-center'>
                        <h3>Departments</h3>
                        <Button
                            variant="outline"
                            onClick={() => router.push('/organization/departments')}
                        >Add Departments</Button>
                    </div>
                    <div className="my-2 grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {allLeave.map((leave, index) => (
                            <DepartmentCards
                                id={leave.id}
                                departmentName={leave.departmentName}
                            />
                        ))}
                    </div>
                </div>
                <div>

                </div>
            </div>
        </div>
    )
}

export default Departments