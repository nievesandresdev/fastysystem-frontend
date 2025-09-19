import AppLayout from '../components/Layout/AppLayout.jsx';
import List from '../pages/Closure/List.jsx';
import { CLOSURE_ROUTES } from './names';
import { createElement } from 'react';


export default [
  {
    path: CLOSURE_ROUTES.ROOT,
    element: createElement(AppLayout),
    children:[
      {
        path: CLOSURE_ROUTES.LIST,
        element: createElement(List),
      },  
    ]
  },
];
