import React, { useEffect, useMemo, useState } from 'react';
import ReactModal from 'react-modal';
import './CalendarModal.css';
import { addHours, differenceInSeconds } from 'date-fns';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import { useCalendarStore, useUiStore } from '../../hooks';

registerLocale('es', es);

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
	},
};
ReactModal.setAppElement('#root');

export const CalendarModal = () => {
	const { isDateModalOpen, closeDateModal } = useUiStore();

	const { activeEvent, startSavingEvent } = useCalendarStore();

	const [formSubmitted, setformSubmitted] = useState(false);

	const [formValues, setFormValues] = useState({
		title: '',
		notes: '',
		start: new Date(),
		end: addHours(new Date(), 2),
	});

	const titleClass = useMemo(() => {
		if (!formSubmitted) return '';

		return formValues.title.length > 0 ? '' : 'is-invalid';
	}, [formValues.title, formSubmitted]);

	useEffect(() => {
		if (activeEvent !== null) {
			setFormValues({ ...activeEvent });
		}
	}, [activeEvent]);

	const onInputChanged = ({ target }) => {
		setFormValues({
			...formValues,
			[target.name]: target.value,
		});
	};

	const onDateChanged = (date, changing) => {
		setFormValues({
			...formValues,
			[changing]: date,
		});
	};

	const onCloseModal = () => {
		console.log('cerrando modal');
		closeDateModal();
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		setformSubmitted(true);

		const difference = differenceInSeconds(formValues.end, formValues.start);
		console.log(difference);
		if (isNaN(difference) || difference <= 0) {
			console.log('Error en fechas');
			Swal.fire('Fechas incorrectas', 'Revisar las fechas ingresadas', 'error');
			return;
		}

		if (formValues.title.length <= 0) return;

		console.log(formValues);

		await startSavingEvent(formValues);
		closeDateModal();
		setformSubmitted(false);
	};

	return (
		<ReactModal
			isOpen={isDateModalOpen}
			onRequestClose={onCloseModal}
			style={customStyles}
			className={'modal'}
			overlayClassName={'modal-fondo'}
			closeTimeoutMS={200}
		>
			<h1> Nuevo evento </h1>
			<hr />
			<form className='container' onSubmit={onSubmit}>
				<div className='form-group mb-2'>
					<label>Fecha y hora inicio</label>
					<DatePicker
						selected={formValues.start}
						onChange={(date) => onDateChanged(date, 'start')}
						className='form-control'
						dateFormat={'Pp'}
						showTimeSelect
						locale={'es'}
						timeCaption='Hora'
					/>
				</div>

				<div className='form-group mb-2'>
					<label>Fecha y hora fin</label>
					<DatePicker
						minDate={formValues.start}
						selected={formValues.end}
						onChange={(date) => onDateChanged(date, 'end')}
						className='form-control'
						dateFormat={'Pp'}
						showTimeSelect
						locale={'es'}
						timeCaption='Hora'
					/>
				</div>

				<hr />
				<div className='form-group mb-2'>
					<label>Titulo y notas</label>
					<input
						type='text'
						className={`form-control ${titleClass}`}
						placeholder='Título del evento'
						name='title'
						autoComplete='off'
						value={formValues.title}
						onChange={onInputChanged}
					/>
					<small id='emailHelp' className='form-text text-muted'>
						Una descripción corta
					</small>
				</div>

				<div className='form-group mb-2'>
					<textarea
						type='text'
						className='form-control'
						placeholder='Notas'
						rows='5'
						name='notes'
						value={formValues.notes}
						onChange={onInputChanged}
					></textarea>
					<small id='emailHelp' className='form-text text-muted'>
						Información adicional
					</small>
				</div>

				<button type='submit' className='btn btn-outline-primary btn-block'>
					<i className='far fa-save'></i>
					<span> Guardar</span>
				</button>
			</form>
		</ReactModal>
	);
};
