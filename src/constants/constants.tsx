import { SideNavItem } from '@/types/types';
import { Icon } from '@iconify/react';

export const SIDENAV_ITEMS: SideNavItem[] = [
    {
        title: 'Dashboard',
        path: '/dashboard',
        icon: <Icon icon="lucide:layout-dashboard" width="24" height="24" />,
    },
    {
        title: 'Employee',
        path: '/employee',
        icon: <Icon icon="lucide:user-round" width="24" height="24" />,
        submenu: true,
        subMenuItems: [
            { title: 'Employee Directory', path: '/employee-directory' },
            { title: 'Add Employee', path: '/employee-directory/invite-employee' },
            { title: 'Attendance', path: '/employee-directory/employee-attendance' },
        ],
    },
    {
        title: 'Organization',
        path: '/organization',
        icon: <Icon icon="lucide:building-2" width="24" height="24" />,
        submenu: true,
        subMenuItems: [
            { title: 'Organization', path: '/organization' },
            { title: 'Policies', path: '/organization/policies' },
        ],
    },
    {
        title: 'Settings',
        path: '/settings',
        icon: <Icon icon="lucide:settings" width="24" height="24" />,
        submenu: true,
        subMenuItems: [
            { title: 'Account', path: '/settings/account' },
            { title: 'Privacy', path: '/settings/privacy' },
        ],
    },
    {
        title: 'Help',
        path: '/help',
        icon: <Icon icon="lucide:help-circle" width="24" height="24" />,
    },
];