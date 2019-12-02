import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, render } from '@testing-library/react';
import CleanReact from '../src/index';

describe('r-html', () => {
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
      const target = getByTestId('target');
      expect(target).toHaveTextContent('Hello world');
      expect(target.children.length).toBe(1);
   });

   it('should throw an error if the provided value for the r-html directive is not a string', () => {
      const C = CleanReact;

      try {
         render(<C children={<div r-html={{}} />} />);
      } catch (err) {
         expect(err.toString()).toBe('Error: r-html expects a string as its value.');
      }

      try {
         render(<C children={<div r-html={[]} />} />);
      } catch (err) {
         expect(err.toString()).toBe('Error: r-html expects a string as its value.');
      }

      try {
         render(<C children={<div r-html={() => {}} />} />);
      } catch (err) {
         expect(err.toString()).toBe('Error: r-html expects a string as its value.');
      }

      try {
         render(<C children={<div r-html={1} />} />);
      } catch (err) {
         expect(err.toString()).toBe('Error: r-html expects a string as its value.');
      }

      try {
         render(<C children={<div r-html={null} />} />);
      } catch (err) {
         expect(err.toString()).toBe('Error: r-html expects a string as its value.');
      }

      try {
         render(<C children={<div r-html={undefined} />} />);
      } catch (err) {
         expect(err.toString()).toBe('Error: r-html expects a string as its value.');
      }

      try {
         render(<C children={<div r-html={Symbol.iterator} />} />);
      } catch (err) {
         expect(err.toString()).toBe('Error: r-html expects a string as its value.');
      }
   });
});
