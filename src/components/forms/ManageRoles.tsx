'use client';

import { useState, useEffect, ChangeEventHandler, useRef } from 'react';
import { useOrganization, useUser } from '@clerk/nextjs';
import type { OrganizationCustomRoleKey } from '@clerk/types';

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
import { Label } from '../ui/label';

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

// List of organization memberships. Administrators can
// change member roles or remove members from the organization.
export const ManageRoles = () => {
    const { user } = useUser();
    const { isLoaded, memberships } = useOrganization(OrgMembersParams);

    if (!isLoaded) {
        return <>Loading</>;
    }

    return (
        <div className='p-2 border border-gray-300 rounded-md shadow-xl'>
            <Table>
                <TableHeader>
                    <TableRow className='bg-[#F5F5F5]'>
                        <TableHead className='text-[#000000]'>User</TableHead>
                        <TableHead className='text-[#000000]'>Joined</TableHead>
                        <TableHead className='text-[#000000]'>Role</TableHead>
                        <TableHead className='text-[#000000]'>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {memberships?.data?.map((mem) => (
                        <TableRow key={mem.id}>
                            <TableCell>
                                {mem.publicUserData.identifier}{' '}
                                {mem.publicUserData.userId === user?.id && '(You)'}
                            </TableCell>
                            <TableCell>{mem.createdAt.toLocaleDateString()}</TableCell>
                            <TableCell>
                                <SelectRole
                                    defaultRole={mem.role}
                                    onChange={async (e) => {
                                        await mem.update({
                                            role: e.target.value as OrganizationCustomRoleKey,
                                        });
                                        await memberships?.revalidate();
                                    }}
                                />
                            </TableCell>
                            <TableCell>
                                <Button
                                    onClick={async () => {
                                        await mem.destroy();
                                        await memberships?.revalidate();

                                        await axios.post("/api/deleteInvite", { userEmail: mem.publicUserData.identifier })
                                    }}
                                    variant="destructive"                                    
                                >
                                    Remove
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className='flex p-2 gap-2 ml-auto'>
                <Button
                    disabled={!memberships?.hasPreviousPage || memberships?.isFetching}
                    onClick={() => memberships?.fetchPrevious?.()}
                    className='bg-[#534FEB]'
                >
                    Previous
                </Button>

                <Button
                    disabled={!memberships?.hasNextPage || memberships?.isFetching}
                    onClick={() => memberships?.fetchNext?.()}
                    className='bg-[#534FEB]'
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

type SelectRoleProps = {
    fieldName?: string;
    isDisabled?: boolean;
    onChange?: ChangeEventHandler<HTMLSelectElement>;
    defaultRole?: string;
};

const SelectRole = (props: SelectRoleProps) => {
    const { fieldName, isDisabled = false, onChange, defaultRole } = props;
    const { organization } = useOrganization();
    const [fetchedRoles, setRoles] = useState<OrganizationCustomRoleKey[]>([]);
    const isPopulated = useRef(false);

    useEffect(() => {
        if (isPopulated.current) return;
        organization
            ?.getRoles({
                pageSize: 20,
                initialPage: 1,
            })
            .then((res) => {
                isPopulated.current = true;
                setRoles(
                    res.data.map((roles) => roles.key as OrganizationCustomRoleKey)
                );
            });
    }, [organization?.id]);

    if (fetchedRoles.length === 0) return null;

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
    );
};