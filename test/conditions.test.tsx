import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, render } from '@testing-library/react';
import CleanReact from '../src/index';
import { disableError } from './utils';

describe('r-if, r-else-if, r-else', () => {
	beforeEach(disableError);
	afterEach(cleanup);

	it('should render components based on the conditions', () => {
		let number = 4;
		let color = 'red';
		let day = 'monday';
		let newVisitor = false;
		let loaded = true;

		const Test = () => (
			<CleanReact>
				<div r-if={number === 4}>Number is 4</div>
				<div r-else-if={number > 4}>Number is greater than 4</div>
				<div r-else>Number is lesser thant 4</div>

				<div r-if={color === 'blue'}>Color is blue</div>
				<div r-else-if={color === 'red'}>Color is red</div>
				<div r-else>I don't like this color</div>

				<div r-if={day === 'saturday'}>Saturday</div>
				<div r-else-if={day === 'sunday'}>Sunday</div>
				<div r-else>Work day</div>

				<div r-if={newVisitor}>Welcome</div>
				<div r-else>Welcome back</div>

				<div r-if={loaded}>Loaded</div>
			</CleanReact>
		);
		const { queryByText } = render(<Test />);

		expect(queryByText('Number is 4')).toBeTruthy();
		expect(queryByText('Number is greater than 4')).toBeFalsy();
		expect(queryByText('Number is lesser thant 4')).toBeFalsy();

		expect(queryByText('Color is blue')).toBeFalsy();
		expect(queryByText('Color is red')).toBeTruthy();
		expect(queryByText("I don't like this color")).toBeFalsy();

		expect(queryByText('Saturday')).toBeFalsy();
		expect(queryByText('Sunday')).toBeFalsy();
		expect(queryByText('Work day')).toBeTruthy();

		expect(queryByText('Welcome')).toBeFalsy();
		expect(queryByText('Welcome back')).toBeTruthy();

		expect(queryByText('Loaded')).toBeTruthy();
	});
});
