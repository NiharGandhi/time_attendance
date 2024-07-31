import React from 'react'
import { Button } from '../ui/button'
import { FaRegEdit } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { HiOutlineOfficeBuilding } from "react-icons/hi";


// Add Path and Function to DropdownMenu Items.
async function onDelete(id: string) {
    await axios.post('/api/deleteLeave', { id: id })
}

const DepartmentCards = ({ id, departmentName }: { id: string, departmentName: string }) => {

    const router = useRouter();

    return (
        <div className='w-full flex flex-col p-2 border border-gray-300 rounded-md'>
            <div className='px-2 m-2 flex gap-2 items-center'>
                <HiOutlineOfficeBuilding className='w-10 h-10 text-purple-600'/>
                <h2 className='text-3xl'>{departmentName}</h2>
                <div className='flex w-full justify-end'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => router.push(`/organization/departments/${id}`)}
                            >
                                <div className='flex gap-2 items-center'>
                                    <FaRegEdit />
                                    Edit Department
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onDelete(id)}
                            >
                                <div className='flex gap-2 items-center'>
                                    <FiTrash2 className='text-red-600' />
                                    Delete Department
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    )
}

export default DepartmentCards