import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  EditButton,
  DeleteButton,
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  Edit,
  Show,
  SimpleShowLayout,
  required, // This is correct if you're using react-admin version that exports 'required' directly
} from 'react-admin';

// If the above import for 'required' does not work, try importing 'validate' functions like this:
// import { required } from 'ra-core';

// List Users
export const UserList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <EmailField source="email" />
      <TextField source="role" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

// Create User
export const UserCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" validate={required()} />
      <TextInput source="username" validate={required()} />
      <TextInput source="email" type="email" validate={required()} />
      <TextInput source="password" type="password" validate={required()} />
      <SelectInput
        source="role"
        choices={[
          { id: 'USER', name: 'User' },
          { id: 'ADMIN', name: 'Admin' },
        ]}
        validate={required()}
      />
    </SimpleForm>
  </Create>
);

// Edit User
export const UserEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="name" validate={required()} />
      <TextInput source="username" validate={required()} />
      <TextInput source="email" type="email" validate={required()} />
      <SelectInput
        source="role"
        choices={[
          { id: 'USER', name: 'User' },
          { id: 'ADMIN', name: 'Admin' },
        ]}
        validate={required()}
      />
    </SimpleForm>
  </Edit>
);

// Show User
export const UserShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="username" />
      <EmailField source="email" />
      <TextField source="role" />
    </SimpleShowLayout>
  </Show>
);
