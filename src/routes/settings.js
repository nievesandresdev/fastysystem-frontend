import AppLayout from '../components/Layout/AppLayout.jsx';
import ListUsers from '../pages/Settings/ListUsers.jsx';
import { SETTING_ROUTES } from './names';
import { createElement } from 'react';



export default [
  {
    path: SETTING_ROUTES.ROOT,
    element: createElement(AppLayout),
    children:[
      {
        path: SETTING_ROUTES.LIST_USERS,
        element: createElement(ListUsers),
      },  
    ]
  },
];
