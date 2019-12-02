import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, render } from '@testing-library/react';
import CleanReact from '../src/index';
import { disableError } from './utils';

describe('CleanReact', () => {
   beforeEach(disableError);
   afterEach(cleanup);

   it('should not apply directives to the nested components without the deep flag', () => {
      const p = '<p>Hello world</p>';

      const Test = () => (
         <CleanReact>
            <div>
               <div r-if={false}>Condition</div>
               <div r-show={false}>Show</div>
               <div r-class="foo">Class</div>
               <div data-testid="target" v-html={p} />
            </div>
         </CleanReact>
      );
      const { queryByText, getByTestId } = render(<Test />);

      expect(queryByText('Condition')).toBeTruthy();
      expect(queryByText('Show')).not.toHaveStyle('display: none');
      expect(queryByText('Class')).not.toHaveAttribute('class', 'foo');
      expect(getByTestId('target')).not.toHaveTextContent('Hello world');
   });

   it('should apply directives to the nested components with the deep flag', () => {
      const p = '<p>Hello world</p>';

      const Test = () => (
         <CleanReact deep>
            <div>
               <div r-if={false}>Condition</div>
               <div r-show={false}>Show</div>
               <div r-class="foo">Class</div>
               <div data-testid="target" r-html={p} />
            </div>
         </CleanReact>
      );
      const { queryByText, getByTestId } = render(<Test />);

      expect(queryByText('Condition')).toBeFalsy();
      expect(queryByText('Show')).toHaveStyle('display: none');
      expect(queryByText('Class')).toHaveAttribute('class', 'foo');
      expect(getByTestId('target')).toHaveTextContent('Hello world');
   });
});
