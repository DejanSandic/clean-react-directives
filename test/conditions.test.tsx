import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, render } from '@testing-library/react';
import CleanReact from '../src/index';

describe('r-if, r-else-if, r-else', () => {
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

   it('should throw error if r-else or r-else-if is not placed after r-if', () => {
      try {
         render(
            <CleanReact>
               <div r-else-if={true}>Test</div>
            </CleanReact>
         );
      } catch (err) {
         expect(err.message).toBe('r-else-if can only be placed after r-if or r-else-if');
      }

      try {
         render(
            <CleanReact>
               <div r-else={true}>Test</div>
            </CleanReact>
         );
      } catch (err) {
         expect(err.message).toBe('r-else can only be placed after r-if or r-else-if');
      }
   });

   it('should throw error if r-if, r-else-if and r-else are combined on the same component', () => {
      try {
         render(
            <CleanReact>
               <div r-if={true} r-else-if={true}>
                  Test
               </div>
            </CleanReact>
         );
      } catch (err) {
         expect(err.message).toBe('You cannot combine r-if, r-else-if and r-else on the same component');
      }

      try {
         render(
            <CleanReact>
               <div r-if r-else={true}>
                  Test
               </div>
            </CleanReact>
         );
      } catch (err) {
         expect(err.message).toBe('You cannot combine r-if, r-else-if and r-else on the same component');
      }

      try {
         render(
            <CleanReact>
               <div r-else-if r-else={true}>
                  Test
               </div>
            </CleanReact>
         );
      } catch (err) {
         expect(err.message).toBe('You cannot combine r-if, r-else-if and r-else on the same component');
      }
   });
});
