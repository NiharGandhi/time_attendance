import React from 'react'
import { PiBeachBallBold } from 'react-icons/pi'
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

// Add Path and Function to DropdownMenu Items.
async function onDelete(id: string) {
    await axios.post('/api/deleteLeave', { id: id })
}

const ShiftCards = ({ id, shiftTitle, shiftDescription, shiftStartDate, shiftEndDate, shiftStartTime, shiftEndTime, deptName }: { id: string, shiftTitle: string, shiftDescription: string | null, shiftStartDate: string, shiftEndDate: string, shiftStartTime: string, shiftEndTime: string, deptName: string }) => {

    const router = useRouter();

    return (
        <div className='w-full flex flex-col p-2 border border-gray-300 rounded-md'>
            <div className='px-2 m-2 flex flex-col gap-2'>
                <div className='flex items-center'>
                    <h2 className='text-3xl line-clamp-1'>{shiftTitle}</h2>
                    <h4 className='ml-auto border border-[#534FEB] rounded-lg bg-[#534FEB]/20 w-10 flex justify-center text-[#534FEB]'>{deptName}</h4>
                </div>
                <p className='text-sm text-muted-foreground'>{shiftDescription}</p>
                <div className='flex items-end'>
                    <div className='space-y-1'>
                        <div>
                            <h3 className='text-sm'>Shift Days</h3>
                            <p className=''>{shiftStartDate} - {shiftEndDate}</p>
                        </div>
                        <div>
                            <h3 className='text-sm text-green-500'>Shift Time</h3>
                            <p className=''>{shiftStartTime} - {shiftEndTime}</p>
                        </div>
                    </div>
                    <div className='flex ml-auto mt-auto'>
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
                                    onClick={() => router.push(`/organization/policies/shifts/${id}`)}
                                >
                                    <div className='flex gap-2 items-center'>
                                        <FaRegEdit />
                                        Edit Shift
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onDelete(id)}
                                >
                                    <div className='flex gap-2 items-center text-red-600'>
                                        <FiTrash2 className='text-red-600' />
                                        Delete Shift
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShiftCards