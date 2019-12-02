import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, render } from '@testing-library/react';
import CleanReact from '../src/index';

describe('r-class', () => {
   afterEach(cleanup);

   it('should conditionally join classNames together', () => {
      const foo = 'foo';

      const Test = () => (
         <CleanReact>
            <div r-class="foo bar">String</div>
            <div r-class={['foo', 'bar', 'baz']}>Array</div>
            <div r-class={{ bar: true, duck: false, quux: true }}>Object</div>
            <div r-class={[foo, { bar: true, duck: false }, 'baz', { quux: true }]}>Mix</div>
            <div className="foo" r-class={[{ bar: true }, 'baz']}>
               Combined
            </div>
         </CleanReact>
      );
      const { queryByText } = render(<Test />);

      expect(queryByText('String')).toHaveAttribute('class', 'foo bar');
      expect(queryByText('Array')).toHaveAttribute('class', 'foo bar baz');
      expect(queryByText('Object')).toHaveAttribute('class', 'bar quux');
      expect(queryByText('Mix')).toHaveAttribute('class', 'foo bar baz quux');
      expect(queryByText('Combined')).toHaveAttribute('class', 'foo bar baz');
   });
});
