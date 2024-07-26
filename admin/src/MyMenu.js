// in src/MyMenu.js
import * as React from 'react';
import { Menu } from 'react-admin';
import BookIcon from '@mui/icons-material/Book';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import PeopleIcon from '@mui/icons-material/People';
import LabelIcon from '@mui/icons-material/Label';

export const MyMenu = () => (
    <Menu>
        <Menu.DashboardItem />
        <Menu.Item to="/user" primaryText="Users" leftIcon={<PeopleIcon />}/>
        <Menu.Item to="/subscription" primaryText="Subscription" leftIcon={<ChatBubbleIcon />}/>
        <Menu.Item to="/comments" primaryText="Comments" leftIcon={<LabelIcon />}/>
    </Menu>
);

export default MyMenu;