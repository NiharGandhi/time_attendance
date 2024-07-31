// EmployeeDetailsPopover.tsx
"use client"

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { useMediaQuery } from '@react-hook/media-query'

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "../ui/input";
import axios from "axios";
import { useOrganization } from "@clerk/nextjs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    memberName: z.string().min(2, {
        message: "Leave Title must be at least 2 characters.",
    }),
    memberRole: z.string(),
    memberStatus: z.string(),
    memberEmail: z.string(),
    memberPhone: z.string(),
    clerkOrganizationId: z.string().min(3),
    memberDepartment: z.string(),
    leaves: z.array(z.string()).optional(),
    shifts: z.array(z.string()).optional(),
});

type EmployeeDetailsPopoverProps = {
    employee: {
        id: string
        memberName: string
        memberStatus: "ACTIVE" | "INACTIVE"
        memberEmail: string
        memberRole: string;
        memberDepartment: string
        memberShifts: { shiftId: string }[]
    }
    isOpen: boolean
    onClose: () => void
    shifts: any
}

const EmployeeDetailsPopover: React.FC<EmployeeDetailsPopoverProps> = ({ employee, isOpen, onClose, shifts }) => {
    if (!isOpen) return null;
    const [open, setOpen] = useState(false)

    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogTrigger asChild>
                    <Button variant="outline" className="hidden">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <ProfileForm className="" employee={employee} />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerTrigger asChild>
                <Button variant="outline">Edit Profile</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Edit profile</DrawerTitle>
                    <DrawerDescription>
                        Make changes to profile here. Click save when you're done.
                    </DrawerDescription>
                </DrawerHeader>
                <ProfileForm className="px-4" employee={employee} />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default EmployeeDetailsPopover

function ProfileForm({ className, employee }: { className: React.ComponentProps<"form">, employee: any }) {

    const [formData, setFormData] = useState(employee)
    const [alldepartments, setAllDepartments] = useState<{ value: string; label: string }[]>([]);
    const [status, setStatus] = useState("");
    const [dept, setDept] = useState("");

    const { organization, isLoaded } = useOrganization();

    if (!isLoaded) {
        <p>Loading...</p>
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            memberName: employee.memberName || "",
            memberEmail: employee.memberEmail || "",
            memberPhone: "", // Assuming this field is optional for now
            memberRole: employee.memberRole || "",
            memberStatus: employee.memberStatus || "",
            memberDepartment: employee.memberDepartment || "",
            shifts: employee.memberShifts.map(shift => shift.shiftId) || [],
        }
    });


    useEffect(() => {
        if (employee) {
            setDept(employee.memberDepartment)
        }
    }, [employee])


    useEffect(() => {
        const fetchDepartments = async () => {
            const response = await axios.get("/api/getAllDepartments", {
                params: {
                    organizationId: organization?.id
                }
            });
            const formattedDepartments = response.data.map((department: { id: string; departmentName: string }) => ({
                value: department.id,
                label: department.departmentName
            }));
            setAllDepartments(formattedDepartments);
        };

        fetchDepartments();
    }, [organization]);

    console.log("Departments: ", alldepartments)

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        // form.reset();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn("grid items-start gap-4", className)}>
                <FormField
                    control={form.control}
                    name="memberName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="memberEmail"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="memberStatus"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                                <Select
                                    value={field.value}
                                    onValueChange={setStatus}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="Inactive">
                                            Inactive
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="memberDepartment"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex items-center">
                                <FormLabel>Department</FormLabel>
                                <h4 className='ml-auto border border-[#534FEB] rounded-lg bg-[#534FEB]/20 w-10 flex justify-center text-[#534FEB]'>{dept}</h4>
                            </div>
                            <FormControl>
                                <Select
                                    defaultValue={field.value}
                                    onValueChange={setDept}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {alldepartments.map((dept) => (
                                            <SelectItem key={dept.value} value={dept.value}>
                                                {dept.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}