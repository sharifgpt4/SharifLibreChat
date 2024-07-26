import React from 'react';
import { Admin, Resource } from 'react-admin';
import authProvider from './providers/authProvider';
import dataProvider from './providers/dataProvider';
import { UserList, UserCreate, UserEdit, UserShow } from './users';
import { SubscriptionList, SubscriptionCreate, SubscriptionEdit, SubscriptionShow } from './subscriptions'; // You'll need to create these
import myTheme from './theme';
import CustomLayout from './CustomLayout'; // Import your custom layout

const App = () => (
  <Admin 
    authProvider={authProvider} 
    dataProvider={dataProvider} 
    theme={myTheme}
    layout={CustomLayout} // Use your custom layout here
  >
    <Resource name="user" list={UserList} create={UserCreate} edit={UserEdit} show={UserShow} />
    <Resource name="subscription" list={SubscriptionList} create={SubscriptionCreate} edit={SubscriptionEdit} show={SubscriptionShow} />

    {/* Add more <Resource> components as needed for other entities */}
  </Admin>
);

export default App;
