import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, render } from '@testing-library/react';
import CleanReact from '../src/index';

describe('r-show', () => {
   afterEach(cleanup);

   it('should add style "display: none" to the component if provided condition is false', () => {
      let number = 4;
      let color = 'red';
      let day = 'monday';
      let newVisitor = false;
      let loaded = true;

      const Test = () => (
         <CleanReact>
            <div r-show={number === 4}>Number is 4</div>
            <div r-show={color === 'blue'}>Color is blue</div>
            <div r-show={day === 'monday'}>Monday</div>
            <div r-show={newVisitor}>Welcome</div>
            <div r-show={loaded}>Loaded</div>
         </CleanReact>
      );
      const { queryByText } = render(<Test />);

      expect(queryByText('Number is 4')).not.toHaveStyle('display: none');
      expect(queryByText('Color is blue')).toHaveStyle('display: none');
      expect(queryByText('Monday')).not.toHaveStyle('display: none');
      expect(queryByText('Welcome')).toHaveStyle('display: none');
      expect(queryByText('Loaded')).not.toHaveStyle('display: none');
   });
});
