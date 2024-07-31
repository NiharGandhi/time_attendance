'use client';

import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { FormEventHandler, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import axios from "axios";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


export default function CreateOrganization() {
    const { createOrganization } = useOrganizationList();
    const [organizationName, setOrganizationName] = useState("");
    const [file, setFile] = useState(null);
    const [color, setColor] = useState('');

    const handleFileChange = (e: { target: { files: SetStateAction<null>[]; }; }) => {
        setFile(e.target.files[0]);
    };

    const handleColorChange = (e: { target: { value: SetStateAction<string>; }; }) => {
        setColor(e.target.value)
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const response = await createOrganization({ name: organizationName });
        await response.setLogo({ file });
        if (response) {
            await axios.post('/api/organization', { organizationName: organizationName, organizationId: response.id, organizationLogo: response.imageUrl, organizationColorScheme: color });
        }
        setOrganizationName("");
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
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        type="text"
                        name="organizationName"
                        placeholder="Name of your Organization"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.currentTarget.value)}
                    />
                    <Input type="file" onChange={handleFileChange} accept="image/*" />
                    <Input type='color' onChange={handleColorChange} />
                    <Button type="submit">Create organization</Button>
                </form>
            </div>
        </div>
    );
}