import AppLayout from '../components/Layout/AppLayout.jsx';
import List from '../pages/Expense/List.tsx';
import { EXPENSE_ROUTES } from './names';
import { createElement } from 'react';



export default [
  {
    path: EXPENSE_ROUTES.ROOT,
    element: createElement(AppLayout),
    children:[
      {
        path: EXPENSE_ROUTES.LIST,
        element: createElement(List),
      },  
    ]
  },
];
