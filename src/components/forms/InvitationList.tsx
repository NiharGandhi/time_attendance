"use client"

import { useOrganization, useUser } from '@clerk/nextjs';
import { OrganizationCustomRoleKey } from '@clerk/types';
import { ChangeEventHandler, use, useEffect, useRef, useState } from 'react';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from '../ui/button';
import { Input } from '../ui/input';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import axios from 'axios';
export const OrgMembersParams = {
    memberships: {
        pageSize: 5,
        keepPreviousData: true,
    },
};

export const OrgInvitationsParams = {
    invitations: {
        pageSize: 5,
        keepPreviousData: true,
    },
};

// Form to invite a new member to the organization.
export const InviteMember = () => {
    const { user, isLoaded: userLoaded } = useUser();
    const { isLoaded, organization, invitations } = useOrganization(OrgInvitationsParams)
    const [emailAddress, setEmailAddress] = useState("")
    const [employeeName, setEmployeeName] = useState("");
    const [status, setStatus] = useState("");
    const [disabled, setDisabled] = useState(false)

    if (!isLoaded || !organization || !userLoaded) {
        return <>Loading</>
    }

    const onSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()

        const submittedData = Object.fromEntries(
            new FormData(e.currentTarget).entries()
        ) as {
            email: string | undefined
            role: OrganizationCustomRoleKey | undefined
        }

        if (!submittedData.email || !submittedData.role) {
            return
        }

        setDisabled(true)
        await axios.post("/api/createInvitation", { organizationId: organization.id, inviterUserId: user?.id, emailAddress: submittedData.email, role: submittedData.role })
        await invitations?.revalidate?.()

        try {
            await axios.post('/api/addUser', { userName: employeeName, userEmail: emailAddress, userOrgId: organization.id, userRole: "EMPLOYEE", userStatus: status });

            setEmailAddress("")
            setDisabled(false)
        } catch (error) {
            console.log("Error: ",error);   
        }
    }

    return (
        <div className='p-2 border border-gray-300 rounded-md shadow-xl'>
            <form onSubmit={onSubmit} className='flex flex-col gap-4'>
                <div className='flex flex-col xl:flex-row gap-2'>
                    <Input
                        name="name"
                        type="text"
                        placeholder="Employee Name"
                        value={employeeName}
                        onChange={(e) => setEmployeeName(e.target.value)}
                    />
                    <Input
                        name="email"
                        type="text"
                        placeholder="Email address"
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                    />
                    <SelectRole fieldName={"role"} />
                    <Select
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
                    <Button type="submit" disabled={disabled} className='bg-[#534FEB]'>
                        Invite
                    </Button>
                </div>
            </form>
        </div>
    )
};

type SelectRoleProps = {
    fieldName?: string
    isDisabled?: boolean
    onChange?: any
    defaultRole?: string
}

const SelectRole = (props: SelectRoleProps) => {
    const { fieldName, isDisabled = false, onChange, defaultRole } = props
    const { organization } = useOrganization()
    const [fetchedRoles, setRoles] = useState<OrganizationCustomRoleKey[]>([])
    const isPopulated = useRef(false)

    useEffect(() => {
        if (isPopulated.current) return
        organization
            ?.getRoles({
                pageSize: 20,
                initialPage: 1,
            })
            .then((res) => {
                isPopulated.current = true
                setRoles(
                    res.data.map((roles) => roles.key as OrganizationCustomRoleKey)
                )
            })
    }, [organization?.id])

    if (fetchedRoles.length === 0) return null

    return (
        <Select
            disabled={isDisabled}
            defaultValue={defaultRole}
            onValueChange={onChange}
            name={fieldName}
        >
            <SelectTrigger>
                <SelectValue placeholder="Select a Role" />
            </SelectTrigger>
            <SelectContent>
                {fetchedRoles?.map((roleKey) => (
                    <SelectItem key={roleKey} value={roleKey}>
                        {roleKey}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}

// List of pending invitations to an organization.
export const InvitationList = () => {
    const { isLoaded, invitations, memberships } = useOrganization({
        ...OrgInvitationsParams,
        ...OrgMembersParams,
    });
    // const [invites, setInvites] = useState([])

    // useEffect(() => {
    //     fetchInvites();
    // }, []);

    // const fetchInvites = async () => {
    //     try {
    //         const response = await axios.get("/api/createInvitation")
    //         setInvites(response.data.data);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    if (!isLoaded) {
        return <>Loading</>;
    }

    return (
        <div className='flex flex-col'>
            <div className='my-4 p-2 border border-gray-300 rounded-md shadow-xl'>
                <Table>
                    <TableCaption>A list Employees.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Invited</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invitations?.data?.map((inv) => (
                            <TableRow key={inv.id}>
                                <TableCell>{inv.emailAddress}</TableCell>
                                <TableCell>{inv.createdAt.toLocaleDateString()}</TableCell>
                                <TableCell>{inv.role}</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={async () => {
                                            await inv.revoke();
                                            await Promise.all([
                                                memberships?.revalidate,
                                                invitations?.revalidate,
                                            ]);
                                            await axios.post("/api/deleteInvite", { userEmail: inv.emailAddress })
                                            window.location.reload();
                                        }}
                                        variant="destructive"                                    
                                    >
                                        Revoke
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className='flex gap-2 p-2 ml-auto'>
                <Button
                    disabled={!invitations?.hasPreviousPage || invitations?.isFetching}
                    onClick={() => invitations?.fetchPrevious?.()}
                    className='bg-[#534FEB]'
                >
                    Previous
                </Button>

                <Button
                    disabled={!invitations?.hasNextPage || invitations?.isFetching}
                    onClick={() => invitations?.fetchNext?.()}
                    className='bg-[#534FEB]'
                >
                    Next
                </Button>
            </div>
        </div>
    );
};