import React from 'react';
import { Layout } from 'react-admin';
import MyMenu from './MyMenu';
import { MyAppBar } from './MyAppBar';

const CustomLayout = (props) => <Layout {...props}  menu={MyMenu} appBar={MyAppBar} />;

export default CustomLayout;
