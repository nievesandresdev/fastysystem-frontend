import AppLayout from '../components/Layout/AppLayout.jsx';
import Invoice from '../pages/Biller/Invoice.jsx';
import { BillerightPanel } from '../components/Biller';
import { BILLER_ROUTES } from './names';


import { createElement } from 'react';



export default [
  {
    path: BILLER_ROUTES.ROOT,
    element: createElement(AppLayout, {
      rightPanel: createElement(BillerightPanel),
    }),
    children:[
      {
        path: BILLER_ROUTES.INVOICE,
        element: createElement(Invoice),
      },  
    ]
  },
];
