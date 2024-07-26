// CustomLoginPage.js
import React, { useState } from 'react';
import { useLogin, useNotify } from 'react-admin';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme'; // import your theme
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const CustomLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();
  const notify = useNotify();

  const submit = (e) => {
    e.preventDefault();
    login({ email, password }).catch(() => notify('Invalid email or password'));
  };

  return (
    <form onSubmit={submit}>
      <TextField
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      <Box display="flex" justifyContent="center" mt={2}>
        <Button variant="contained" color="primary" type="submit">
          Login
        </Button>
      </Box>
    </form>
  );
};

const CustomLoginPage = () => (
  <ThemeProvider theme={theme}>
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Card>
        <CardContent>
          <CustomLoginForm />
        </CardContent>
      </Card>
    </Box>
  </ThemeProvider>
);

export default CustomLoginPage;
