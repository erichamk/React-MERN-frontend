import React, { useEffect, useState } from 'react';
import { NavBar, CalendarEvent, CalendarModal, FabAddNew, FabDelete } from '../';

import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getMessagesES, localizer } from '../../helpers';
import { useAuthStore, useCalendarStore, useUiStore } from '../../hooks';

export const CalendarPage = () => {
	const { user } = useAuthStore();
	const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week');
	const { openDateModal } = useUiStore();
	const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();

	const eventStyleGetter = (event, start, end, isSelected) => {
		const isMyEvent = user.uid === event.user._id || user.uid === event.user.uid;
		const style = {
			backgroundColor: isMyEvent ? '#347CF7' : '#464660',
			borderRadius: '0px',
			opacity: 0.8,
			color: 'white',
		};
		return { style };
	};

	const onDoubleClick = (event) => {
		console.log({ doubleClick: event });
		openDateModal();
	};

	const onSelect = (event) => {
		console.log({ click: event });
		setActiveEvent(event);
	};
	const onViewChanged = (event) => {
		localStorage.setItem('lastView', event);
		setLastView(event);
	};
	useEffect(() => {
		startLoadingEvents();
	}, []);

	return (
		<>
			<NavBar />

			<Calendar
				culture='es'
				localizer={localizer}
				events={events}
				defaultView={lastView}
				startAccessor='start'
				endAccessor='end'
				style={{ height: 'calc(100vh - 80px)' }}
				messages={getMessagesES()}
				eventPropGetter={eventStyleGetter}
				components={{
					event: CalendarEvent,
				}}
				onDoubleClickEvent={onDoubleClick}
				onSelectEvent={onSelect}
				onView={onViewChanged}
			/>

			<CalendarModal />

			<FabAddNew />
			<FabDelete />
		</>
	);
};
