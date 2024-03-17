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
  ArrayField
} from 'react-admin';

import { useRecordContext } from 'react-admin';

const StringArrayField = ({ source }) => {
  const record = useRecordContext();
  if (!record) return null;
  
  const items = record[source];
  if (!Array.isArray(items)) return <p>No description</p>;

  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
};

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
      {/* Use custom StringArrayField for description */}
      <StringArrayField source="description" />
    </SimpleShowLayout>
  </Show>
);



export const SubscriptionCreate = props => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <NumberInput source="price" />
      <NumberInput source="duration" helpText="Duration in days" />
      <NumberInput source="tokenCreditsCost" />
      {/* Use TextInput with multiline prop for description */}
      <TextInput
  source="description"
  multiline
/>
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
      {/* Use TextInput with multiline prop for description */}
      <TextInput
  source="description"
  multiline
/>
    </SimpleForm>
  </Edit>
);


