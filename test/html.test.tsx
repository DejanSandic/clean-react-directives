import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, render } from '@testing-library/react';
import CleanReact from '../src/index';
import { disableError } from './utils';

describe('r-html', () => {
   beforeEach(disableError);
   afterEach(cleanup);
   console.error = (err: any) => {
      try {
         throw new Error(err);
      } catch (err) {}
   };

   it('should inject html string into the component', () => {
      const p = '<p>Hello world</p>';

      const Test = () => (
         <CleanReact>
            <div data-testid="target" r-html={p} />
         </CleanReact>
      );
      const { getByTestId } = render(<Test />);

      expect(getByTestId('target')).toContainHTML(p);
   });

   it('should throw an error if the provided value for the r-html directive is not a string', () => {});
});
