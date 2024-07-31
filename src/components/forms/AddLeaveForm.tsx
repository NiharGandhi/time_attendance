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
    clerkOrganizationId: z.string().min(3)
})


export const LeaveForm = ({ clerkOrganizationId }: { clerkOrganizationId: string }) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            leaveTitle: "",
            leaveDescription: "",
            leaveDays: 0,
            carryOverDays: 0,
            isActive: true,
            clerkOrganizationId,
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const addLeave = await axios.post('/api/addLeave', values)
        if (!addLeave) {
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
                        name="leaveTitle"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Leave Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="What is this leave called?" {...field} />
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
                                    <Input placeholder="What is this leave about?" {...field} />
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
                                    <Input type="number" placeholder="How may days is this leave permitted?" {...field} />
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
                                    <Input type="number" placeholder="How may days of carray over is permitted?" {...field} />
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
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    )
};

