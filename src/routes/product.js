import AppLayout from '../components/Layout/AppLayout.jsx';
import ProductList from '../pages/Product/ProductList.jsx';
import { PRODUCT_ROUTES } from './names';
import { createElement } from 'react';

export default [
  {
    path: PRODUCT_ROUTES.ROOT,
    element: createElement(AppLayout),
    children:[
      {
        path: PRODUCT_ROUTES.LIST,
        element: createElement(ProductList),
      },  
    ]
  },
];
