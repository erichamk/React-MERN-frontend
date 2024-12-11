import React, { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoginPage } from '../auth';
import { CalendarPage } from '../calendar';
import { getEnvVariables } from '../helpers';
import { useAuthStore } from '../hooks';

export const AppRouter = () => {
	const env = getEnvVariables();

	// const status = 'not-authenticated';
	const { status, checkAuthToken } = useAuthStore();

	useEffect(() => {
		checkAuthToken();
	}, []);

	if (status === 'checking') {
		return <h3>Cargando...</h3>;
	}
	return (
		<Routes>
			{status === 'not-authenticated' ? (
				<>
					<Route path='/auth/*' element={<LoginPage />} />
					<Route path='/*' element={<Navigate to={'/auth/login'} />} />
				</>
			) : (
				<>
					<Route path='/' element={<CalendarPage />} />
					<Route path='/*' element={<Navigate to={'/'} />} />
				</>
			)}
		</Routes>
	);
};
