'use client';

import { useOrganization } from "@clerk/nextjs";
import { FormEventHandler, SetStateAction, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import axios from "axios";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useForm } from "react-hook-form";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { type Organization } from "@prisma/client"
import { redirect } from "next/navigation";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import TimeZonePicker from "./TimeZonePicker";
import { CountrySelect } from "./CountryPicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import Policies from "./Policies";
import Departments from "./Departments";


const formSchema = z.object({
    orgName: z.string().min(2).max(50),
    orgLogo: z.string(),
    orgColorScheme: z.string(),
    orgTimeZone: z.string(),
    orgLocation: z.string(),
    orgDateFormat: z.string(),
})

export default function MyOrganization() {

    const { organization, isLoaded } = useOrganization();

    const [organizationDetails, setOrganizationDetails] = useState<Organization>();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedTimezone, setSelectedTimezone] = useState("");
    const [selectedCountry, setSelectedCountry] = useState({});
    const [dateFormat, setDateFormat] = useState("");

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    if (isLoaded && !organization) {
        redirect("/");
    }

    useEffect(() => {
        if (organization) {
            fetchDetails();
        }
    }, [organization]);

    const fetchDetails = async () => {
        const orgDetails = await axios.get("/api/organization", {
            params: {
                organizationId: organization?.id
            }
        });
        setOrganizationDetails(orgDetails.data);
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            orgName: "",
            orgLogo: "",
            orgColorScheme: "",
            orgTimeZone: "",
            orgDateFormat: "",
            orgLocation: "",
        }
    });

    useEffect(() => {
        if (organizationDetails) {
            form.reset({
                orgName: organizationDetails.name,
                orgLogo: organizationDetails.logo,
                orgColorScheme: organizationDetails.colorScheme
            });
            setLoading(false);
        }
    }, [organizationDetails, form]);

    const renderButtons = () => {
        if (organizationDetails) {
            if (isEditing) {
                return (
                    <div className='flex'>
                        <Button type="button" onClick={toggleEdit}>Cancel</Button>
                        <Button className='ml-1' onClick={() => onSubmit(form.getValues())}>Save</Button>
                    </div>
                );
            } else {
                return <Button type="button" onClick={toggleEdit}>Edit</Button>;
            }
        } else {
            return <Button className='ml-1' onClick={() => onSubmit(form.getValues())}>Save</Button>;
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await organization?.update({ name: values.orgName });

            const orgDetails = await axios.put("/api/organization", {
                organizationName: values.orgName,
                organizationId: organization?.id,
                orgTimeZone: selectedTimezone.value,
                orgLocation: selectedCountry.label,
                orgDateFormat: dateFormat
            });

            setIsEditing(false);

            // Handle success (e.g., show a toast notification)
        } catch (error) {
            console.error("Error updating organization:", error);
            // Handle error
        }
    };

    return (
        <div className="p-2">
            <h1 className="text-2xl">My Organization</h1>
            <Breadcrumb className="my-1">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-[#534FEB]">My Organization</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="my-4">
                <Card className=" border border-gray-300 shadow-xl">
                    <CardContent>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                            <div>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-2">
                                        <FormField
                                            control={form.control}
                                            name="orgName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Organization Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={!isEditing} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="orgTimeZone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Organization Time Zone</FormLabel>
                                                    <TimeZonePicker disabled={!isEditing} selectedTimezone={selectedTimezone} setSelectedTimezone={setSelectedTimezone} />
                                                    <FormControl>
                                                        <Input {...field} disabled={true} value={isEditing ? selectedTimezone.value : organizationDetails?.timezone} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="orgLocation"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Organization Origin</FormLabel>
                                                    <CountrySelect disabled={!isEditing} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />
                                                    <FormControl>
                                                        <Input {...field} disabled={true} value={isEditing ? selectedCountry.label : organizationDetails?.location} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="orgDateFormat"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Choose your Date Format</FormLabel>
                                                    <Select
                                                        onValueChange={setDateFormat}
                                                        {...field}
                                                        disabled={!isEditing}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a Status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="dd-MMM-yy">
                                                                dd-MMM-yy
                                                            </SelectItem>
                                                            <SelectItem value="yyyy-MM-dd">
                                                                yyyy-MM-dd
                                                            </SelectItem>
                                                            <SelectItem value="dd-MMMM">
                                                                dd-MMMM
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormControl>
                                                        <Input {...field} disabled={!isEditing} value={isEditing ? dateFormat : organizationDetails?.dateFormat} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        {renderButtons()}
                                    </form>
                                </Form>
                            </div>
                            <div>
                                {organization && organization.id && (
                                    <Departments organizationId={organization?.id} />
                                )}
                                {/* <Policies /> */}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}