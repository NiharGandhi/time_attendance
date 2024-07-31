'use client'

import React, { useEffect, useState } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { DataTable } from './data-table'
import { Members, columns } from "./columns"
import axios from 'axios'

const page = () => {
  const [members, setMembers] = useState([])

  useEffect(() => {
    const fetchMembers = async () => {
      const response = await axios.get("/api/getAllMembers")
      setMembers(response.data)
    };

    fetchMembers()
  }, []);



  return (
    <div className='p-2'>
      <h1 className="text-2xl">Employees Directory</h1>
      <Breadcrumb className="my-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-[#534FEB]">Employee Directory</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="container mx-auto my-4">
        <DataTable columns={columns} data={members} />
      </div>
    </div>
  )
}

export default page