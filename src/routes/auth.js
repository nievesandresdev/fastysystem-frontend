import Login from '../pages/Login.jsx';
import { createElement } from 'react';
import { AUTH_ROUTES } from './names';

export default [
  {
    path: AUTH_ROUTES.ROOT,
    element: createElement(Login),
  },
  {
    path: AUTH_ROUTES.LOGIN,
    element: createElement(Login),
  },
];
