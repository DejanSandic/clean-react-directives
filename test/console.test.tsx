import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { cleanup, render } from '@testing-library/react';

const originalConsoleError = console.error;

describe('console.error', () => {
   beforeEach(() => {
      cleanup();
      process.env.NODE_ENV = 'test';
      jest.resetModules();
      console.error = originalConsoleError;
   });

   it('should log the error if it is not library related', async () => {
      await import('../src/index');

      const Test = () => {
         throw new Error('Test error');
      };

      try {
         render(<Test />);
      } catch (err) {
         expect(err.toString()).toBe('Error: Test error');
      }
   });

   it('should log the non-boolean error if the library is not imported', async () => {
      console.error = (err: any) => {
         try {
            throw new Error(err);
         } catch (err) {}
      };

      try {
         render(<div r-if={true} />);
      } catch (err) {
         const string = err.toString().includes('non-boolean attribute');
         expect(string).toBeTruthy();
      }
   });

   it('should not log the non-boolean error if th library is imported', async () => {
      let thrown = false;
      await import('../src/index');

      try {
         render(<div r-if={true} />);
      } catch (err) {
         thrown = true;
      } finally {
         expect(thrown).toBeFalsy();
      }
   });
});
