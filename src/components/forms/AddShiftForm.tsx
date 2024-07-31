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
import { Switch } from "@/components/ui/switch";
import { FaCalendarDay, FaClock } from "react-icons/fa";
import Select from 'react-select';
import React, { useEffect, useState } from "react";

const formSchema = z.object({
    shiftTitle: z.string().min(2, {
        message: "Leave Title must be at least 2 characters.",
    }),
    shiftDescription: z.string(),
    shiftStartTime: z.string(),
    shiftEndTime: z.string(),
    shiftStartDate: z.string(),
    shiftEndDate: z.string(),
    isActive: z.boolean().default(true),
    shiftLocation: z.string(),
    clerkOrganizationId: z.string().min(3),
    departments: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
});

export const ShiftForm = ({ clerkOrganizationId }: { clerkOrganizationId: string }) => {
    const [departments, setDepartments] = useState<{ value: string; label: string }[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            shiftTitle: "",
            shiftDescription: "",
            shiftStartTime: "",
            shiftEndTime: "",
            shiftStartDate: "",
            shiftEndDate: "",
            isActive: true,
            shiftLocation: "",
            clerkOrganizationId,
            departments: [],
        }
    });

    useEffect(() => {
        const fetchDepartments = async () => {
            const response = await axios.get("/api/getAllDepartments", {
                params: {
                    organizationId: clerkOrganizationId
                }
            });
            const formattedDepartments = response.data.map((department: { id: string; departmentName: string }) => ({
                value: department.id,
                label: department.departmentName
            }));
            setDepartments(formattedDepartments);
        };

        fetchDepartments();
    }, [clerkOrganizationId]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
        const addShift = await axios.post('/api/addshift', {
            ...values,
            clerkOrganizationId: clerkOrganizationId,
            departments: values.departments[0].value
        });
        if (!addShift) {
            console.log("Error");
        }
        form.reset();
    }

    return (
        <div className='p-2 border border-gray-300 rounded-md shadow-xl'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="shiftTitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Shift Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="What is this shift called?" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="shiftDescription"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Shift Description</FormLabel>
                                <FormControl>
                                    <Input placeholder="What is this shift about?" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="shiftStartDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Shift Start Date</FormLabel>
                                <FormControl>
                                    <div className="flex gap-2 items-center">
                                        <FaCalendarDay />
                                        <Input type="date" aria-label="Start Date" className="w-fit" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="shiftEndDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Shift End Date</FormLabel>
                                <FormControl>
                                    <div className="flex gap-2 items-center">
                                        <FaCalendarDay />
                                        <Input type="date" aria-label="End Date" className="w-fit" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="shiftStartTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Shift Start Time</FormLabel>
                                <FormControl>
                                    <div className="flex gap-2 items-center">
                                        <FaClock />
                                        <Input type="time" aria-label="Start Time" className="w-fit" {...field} />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="shiftEndTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Shift End Time</FormLabel>
                                <FormControl>
                                    <div className="flex gap-2 items-center">
                                        <FaClock />
                                        <Input type="time" aria-label="End Time" className="w-fit" {...field} />
                                    </div>
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
                                    <FormLabel className="text-base">Shift Active?</FormLabel>
                                    <FormDescription>Enable this shift for all employees.</FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="departments"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Departments</FormLabel>
                                <FormControl>
                                    <Select
                                        isMulti
                                        options={departments}
                                        onChange={(selectedOptions) => {
                                            field.onChange(selectedOptions);
                                        }}
                                        value={field.value}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    );
};
