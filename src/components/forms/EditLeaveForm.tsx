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
import { Leaves } from "@prisma/client";
import { Switch } from "../ui/switch";

const formSchema = z.object({
    leaveTitle: z.string().min(2, {
        message: "Leave Title must be at least 2 characters.",
    }),
    leaveDescription: z.string().min(2, {
        message: "Description must be at least 2 characters.",
    }),
    leaveDays: z.coerce.number().min(0),
    carryOverDays: z.coerce.number().min(0),
    isActive: z.boolean().default(true),
})


// Form to invite a new member to the organization.
export const EditLeaveForm = ({ leaveId, clerkOrganizationId }: { 
    leaveId: string,
    clerkOrganizationId: string
 }) => {

    const [leave, setLeave] = useState<Leaves>()
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    useEffect(() => {
        const fetchLeave = async () => {
            const repsonse = await axios.get('/api/getLeave', {
                params: {
                    id: leaveId
                }
            });
            setLeave(repsonse.data);
        }
        fetchLeave();
    }, [leaveId])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            leaveTitle: "",
            leaveDescription: "",
            leaveDays: 0,
            carryOverDays: 0,
            isActive: true,
        }
    });

    useEffect(() => {
        if (leave) {
            form.reset({
                leaveTitle: leave.leaveTitle,
                leaveDescription: leave.leaveDescription,
                leaveDays: leave.leaveDays,
                carryOverDays: leave.carryOverDays,
                isActive: leave.isActive,
            })
        }
    }, [form, leave]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const updatedLeave = {
            title: values.leaveTitle,
            description: values.leaveDescription,
            days: values.leaveDays,
            carryOver: values.carryOverDays,
            isActive: values.isActive,
            clerkOrganizationId: clerkOrganizationId
        };
        const addLeave = await axios.put(`/api/editLeave/${leaveId}`, updatedLeave);
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
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="leaveTitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Leave Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="What is this leave called?" {...field} disabled={!isEditing} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="leaveDescription"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Leave Description</FormLabel>
                                <FormControl>
                                    <Input placeholder="What is this leave about?" {...field} disabled={!isEditing} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="leaveDays"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Leave Days</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="How may days is this leave permitted?" {...field} disabled={!isEditing} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="carryOverDays"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Carry Over Days</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="How may days of carray over is permitted?" {...field} disabled={!isEditing} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">
                                        Leave Active?
                                    </FormLabel>
                                    <FormDescription>
                                        Enable this leave for all employees.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={!isEditing}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    {renderButtons()}
                </form>
            </Form>
        </div>
    )
};

