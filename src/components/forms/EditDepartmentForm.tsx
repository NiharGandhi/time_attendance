"use client"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import axios from 'axios';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from "react";
import { Departments } from "@prisma/client";
import { Switch } from "../ui/switch";
import { InviteMember } from "./DepartmentInvitationList";

const formSchema = z.object({
    departmentName: z.string().min(2, {
        message: "Department Name must be at least 2 characters.",
    }),
})


// Form to invite a new member to the organization.
export const EditDepartmentForm = ({ deptId }: { 
    deptId: string,
 }) => {

    const [department, setDepartment] = useState<Departments>()
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    useEffect(() => {
        const fetchLeave = async () => {
            const repsonse = await axios.get('/api/getDepartment', {
                params: {
                    id: deptId
                }
            });
            setDepartment(repsonse.data);
        }
        fetchLeave();
    }, [deptId])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            departmentName: ""
        }
    });

    useEffect(() => {
        if (department) {
            form.reset({
                departmentName: department.departmentName
            })
        }
    }, [form, department]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const updatedLeave = {
            departmentName: values.departmentName,
        };
        const addLeave = await axios.put(`/api/editDepartment/${deptId}`, updatedLeave);
        if (!addLeave) {
            console.log("Error");
        }
        toggleEdit();
    };

    const renderButtons = () => {
        if (isEditing) {
            return (
                <>
                    <Button type="button" onClick={toggleEdit}>Cancel</Button>
                    <Button className='ml-1' type="submit">Save</Button>
                </>
            );
        } else {
            return <Button type="button" onClick={toggleEdit}>Edit</Button>;
        }
    };

    return (
        <div className='p-2 border border-gray-300 rounded-md shadow-xl'>
            <div className="p-2 space-y-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="departmentName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="What is this dept. called?" {...field} disabled={!isEditing} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {renderButtons()}
                    </form>
                </Form>
                <div>
                    <h2 className="text-2xl">Add Members</h2>
                    <div className="my-2">
                        {department && department.departmentName && (
                            <InviteMember deptId={deptId} deptName={department?.departmentName} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
};

