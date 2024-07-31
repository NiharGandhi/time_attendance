'use client';

import React, { useEffect, useState } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import DisplayCards from '@/components/cards/DisplayCards';
import { HiOutlineBriefcase } from "react-icons/hi2";
import { PiOfficeChair } from "react-icons/pi";
import { LuBadgeAlert } from "react-icons/lu";
import { IoMdAlarm } from "react-icons/io";
import { TbBeach } from "react-icons/tb";


const page = () => {

    var [date, setDate] = useState(new Date());

    useEffect(() => {

        var timer = setInterval(() => setDate(new Date()), 1000)

        return function cleanup() {
            clearInterval(timer);
        }

    })

    return (
        <div className='p-2'>
            <h1 className="text-2xl">Employee Attendance</h1>
            <div className='flex justify-between items-center'>
                <Breadcrumb className="my-1">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/employee-directory">Employee</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-[#534FEB]">Attendance</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className='flex gap-4'>
                    <p>{date.toDateString()}</p>
                    <p>{date.getHours()} : {date.getMinutes()}</p>
                </div>
            </div>
            <div className='my-4'>
                <div className='flex justify-evenly gap-2'>
                    <DisplayCards icon={<HiOutlineBriefcase/>} title='Total Workforce' metric={150}/>
                    <DisplayCards icon={<PiOfficeChair />} title='Total Workforce' metric={150} />
                    <DisplayCards icon={<LuBadgeAlert />} title='Total Workforce' metric={150} />
                    <DisplayCards icon={<IoMdAlarm />} title='Total Workforce' metric={150} />
                    <DisplayCards icon={<TbBeach />} title='Total Workforce' metric={150} />
                </div>
                <div>
                    Search
                </div>
                <div>
                    Attendance Table
                </div>
            </div>
        </div>
    )
}

export default page