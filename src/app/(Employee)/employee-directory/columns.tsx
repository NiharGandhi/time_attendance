// YourTableComponent.tsx
"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { Copy, ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import EmployeeDetailsPopover from "@/components/cards/EmployeeDetailsPopover"

export type Members = {
    id: string
    memberName: string
    memberStatus: "ACTIVE" | "INACTIVE"
    memberEmail: string
    memberRole: string
    memberDepartment: string
    memberShifts: { shiftId: string; }[]
}

export const columns: ColumnDef<Members>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "memberName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "memberEmail",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "memberStatus",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("memberStatus")

            if (status === "Active") {
                return (
                    <h4 className='border border-green-600 rounded-lg bg-green-600/20 w-fit p-1 flex justify-center text-green-600'>{status}</h4>
                )
            } else if (status === "Inactive") {
                return (
                    <h4 className='border border-red-600 rounded-lg bg-red-600/20 w-fit p-1 flex justify-center text-red-600'>{status}</h4>
                )
            } else {
                return;
            }
        }
    },
    {
        accessorKey: "memberRole",
        header: "Role",
    },
    {
        accessorKey: "memberDepartment",
        header: "Department",
        cell: ({ row }) => <h4 className='border border-[#534FEB] rounded-lg bg-[#534FEB]/20 w-10 flex justify-center text-[#534FEB]'>{row.getValue("memberDepartment")}</h4>
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const employee = row.original
            const [isPopoverOpen, setIsPopoverOpen] = useState(false)

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(employee.id)}
                                className="gap-1"
                            >
                                <Copy className="w-3 h-3" />
                                Copy Employee ID
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(employee.memberEmail)}
                                className="gap-1"
                            >
                                <Copy className="w-3 h-3" />
                                Copy Email ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setIsPopoverOpen(true)}
                            >
                                View Employee Details
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <EmployeeDetailsPopover
                        employee={employee}
                        isOpen={isPopoverOpen}
                        onClose={() => setIsPopoverOpen(false)}
                    />
                </>
            )
        },
    },
]
