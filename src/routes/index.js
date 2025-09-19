import { createBrowserRouter  } from 'react-router-dom';
import authRoutes from './auth'
import billerRoutes from './biller'
import reportRoutes from './report'
import settingRoutes from './settings'
import productRoutes from './product'
import clousureRoutes from './clousure'


const router = createBrowserRouter([
  ...authRoutes,
  ...billerRoutes,
  ...reportRoutes,
  ...settingRoutes,
  ...productRoutes,
  ...clousureRoutes
]);


export default router;
