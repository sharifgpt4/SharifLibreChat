import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  BooleanField,
  EditButton,
  ShowButton,
  DeleteButton,
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  Edit,
  Show,
  SimpleShowLayout,
  DateField,
} from 'react-admin';

export const SubscriptionList = props => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <NumberField source="price" />
      <NumberField source="duration" />
      <NumberField source="tokenCreditsCost" />
      <BooleanField source="isActive" />
      <TextField source="description" />
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const SubscriptionCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <NumberInput source="price" />
      <NumberInput source="duration" helpText="Duration in days" />
      <NumberInput source="tokenCreditsCost" />
      <TextInput source="description" />
      <BooleanInput source="isActive" />
    </SimpleForm>
  </Create>
);

export const SubscriptionEdit = props => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput disabled source="id" />
      <TextInput source="name" />
      <NumberInput source="price" />
      <NumberInput source="duration" helpText="Duration in days" />
      <NumberInput source="tokenCreditsCost" />
      <BooleanInput source="isActive" />
      <TextInput source="description" />

    </SimpleForm>
  </Edit>
);

export const SubscriptionShow = props => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <NumberField source="price" />
      <NumberField source="duration" />
      <NumberField source="tokenCreditsCost" />
      <BooleanField source="isActive" />
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
      <TextField source="description" />

    </SimpleShowLayout>
  </Show>
);
