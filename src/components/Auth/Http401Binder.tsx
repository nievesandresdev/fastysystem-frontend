// Http401Binder.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setOnUnauthorized } from '@/api/http';
import { useAppDispatch } from '@/hooks/store';
import { logout } from '@/stores/auth/authSlice';
import { AUTH_ROUTES } from '@/routes/names';

export default function Http401Binder() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setOnUnauthorized(() => {
      dispatch(logout());
      navigate(AUTH_ROUTES.LOGIN, { replace: true });
    });
    return () => setOnUnauthorized(undefined);
  }, [dispatch, navigate]);

  return null;
}
