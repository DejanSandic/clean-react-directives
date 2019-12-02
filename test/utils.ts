export const disableError = () => {
   const error = console.error;

   console.error = (...args: string[]) => {
      const nonBoolean = args[0].includes('non-boolean');

      if (nonBoolean) {
         const libRelated = args.some((arg: string) => {
            const conditions = ['r-if', 'r-else-if', 'r-else', 'r-show', 'r-class'];
            return conditions.some(condition => arg.includes(condition));
         });
         if (libRelated) return;
      }

      error(...args);
   };
};
