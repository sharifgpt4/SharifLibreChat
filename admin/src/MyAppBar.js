// in src/MyAppBar.js
import * as React from 'react';
import { AppBar, TitlePortal } from 'react-admin';
import Box from '@mui/material/Box';

export const MyAppBar = () => (
    <AppBar color="primary">
        <TitlePortal />
        Qstar admin panel
        <Box flex="1" />
    </AppBar>
);