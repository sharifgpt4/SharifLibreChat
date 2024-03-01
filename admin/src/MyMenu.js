// MyMenu.js
import * as React from 'react';
import { useSelector } from 'react-redux';
import { DashboardMenuItem, MenuItemLink, usePermissions } from 'react-admin';
import PeopleIcon from '@mui/icons-material/People';

const MyMenu = () => {
    const { permissions } = usePermissions();

    return (
        <div>
            <DashboardMenuItem />
            <MenuItemLink to="/user" primaryText="Users" leftIcon={<PeopleIcon />} />
            {/* Add more links here */}
        </div>
    );
};

export default MyMenu;
