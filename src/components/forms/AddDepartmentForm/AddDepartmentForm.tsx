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
    departmentName: z.string().min(2, {
        message: "Leave Title must be at least 2 characters.",
    }),
    clerkOrganizationId: z.string()
})


export const AddDepartmentForm = ({ clerkOrganizationId }: { clerkOrganizationId: string }) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            departmentName: "",
            clerkOrganizationId,
        }
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const addLeave = await axios.post('/api/addDepartment', values)
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
                        name="departmentName"
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
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    )
};

