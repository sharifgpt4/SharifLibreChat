// App.js
import React from 'react';
import { Admin, Resource } from 'react-admin';
import authProvider from './authProvider';
import dataProvider from './dataProvider';
import { UserList, UserCreate, UserEdit, UserShow } from './users';
import MyMenu from './MyMenu';

const App = () => (
  <Admin authProvider={authProvider} dataProvider={dataProvider} menu={MyMenu}>
    <Resource name="user" list={UserList} create={UserCreate} edit={UserEdit} show={UserShow} />
  </Admin>
);

export default App;
