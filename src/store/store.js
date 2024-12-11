import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './auth/authSlice';
import { uiSlice } from './ui/uiSlice';
import { calendarSlice } from './calendar/calendarSlice';

export const store = configureStore({
	reducer: {
		auth: authSlice.reducer,
		ui: uiSlice.reducer,
		calendar: calendarSlice.reducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});
