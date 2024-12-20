// alternativa a thunks
import { useDispatch, useSelector } from 'react-redux';
import { calendarApi } from '../api';
import { clearErrorMessage, onChecking, onLogin, onLogout } from '../store/auth/authSlice';
import { onClear } from '../store';

export const useAuthStore = () => {
	const { status, user, errorMessage } = useSelector((state) => state.auth);
	const dispatch = useDispatch();

	const startLogin = async ({ email, password }) => {
		dispatch(onChecking());
		try {
			const { data } = await calendarApi.post('/auth', { email, password });
			localStorage.setItem('token', data.token);
			localStorage.setItem('token-init-date', new Date().getTime());
			dispatch(onLogin({ name: data.name, uid: data.uid }));
		} catch (error) {
			dispatch(onLogout('Credenciales incorrectas'));
			setTimeout(() => {
				dispatch(clearErrorMessage());
			}, 10);
		}
	};

	const startRegister = async ({ name, email, password }) => {
		dispatch(onChecking());
		try {
			const { data } = await calendarApi.post('/auth/new', { name, email, password });

			localStorage.setItem('token', data.token);
			localStorage.setItem('token-init-date', new Date().getTime());
			dispatch(onLogin({ name: data.name, uid: data.uid }));
		} catch (error) {
			console.log(error);
			dispatch(
				onLogout(error.response.data.msg || JSON.stringify(error.response.data.errors))
			);
			setTimeout(() => {
				dispatch(clearErrorMessage());
			}, 10);
		}
	};

	const checkAuthToken = async () => {
		const token = localStorage.getItem('token');
		if (!token) return dispatch(onLogout());

		try {
			const { data } = await calendarApi.get('auth/renew');
			localStorage.setItem('token', data.token);
			localStorage.setItem('token-init-date', new Date().getTime());
			dispatch(onLogin({ name: data.name, uid: data.uid }));
		} catch (error) {
			localStorage.clear();
			dispatch(onLogout());
		}
	};

	const startLogout = async () => {
		localStorage.clear();
		dispatch(onClear());
		dispatch(onLogout());
	};

	return {
		// Propiedades
		errorMessage,
		status,
		user,
		// Metodos
		checkAuthToken,
		startLogin,
		startRegister,
		startLogout,
	};
};
