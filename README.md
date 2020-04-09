# clean-react-directives
Vue-like syntax for ReactJS
[CodeSandbox demo](https://codesandbox.io/s/wandering-sunset-uouen?file=/src/App.js)

# Quick look
```jsx
import React from 'react';
import C from 'clean-react-directives';

export const App = () => {
   let number = 2;
   let paragraph = '<p>Hello world</p>'

   return (
      <C>
         <div r-if={number % 2 === 0}>Number is divisible by 2</div>
         <div r-else-if={number === 3}>Number is my lucky number</div>
         <div r-else>Number is {number}</div>

         <div r-if={paragraph} r-html={paragraph}></div>

         <div r-class={{ 'full-width': false, 'with-borders': true }} />
      </C>
   );
};
```

# Installation
npm:
```bash
npm install clean-react-directives
```

yarn:
```bash
yarn add clean-react-directives
```

# Table of contents
-  [Conditions: r-if, r-else-if, r-else](#conditions)
-  [r-show](#r-show)
-  [r-class](#r-class)
-  [r-html](#r-html)
-  [Lack of other directives: r-text, r-for and r-model](#lack)
-  [Deep vs Shallow checking](#deep)
-  [PERFORMANCE OPTIMIZATION](#performance)
-  [Console hacking](#console)

<a id="conditions"></a>
# Conditions: r-if, r-else-if, r-else

The directives `r-if`, `r-else-if` and `r-else` are used to conditionally render a block they belong to. The block will only be rendered if the directive’s expression returns a truthy value.

Without clean-react-directives:
```jsx
export const App = () => {
   let number = 2;
   let firstVisit = true;

   return (
      <div>
         {number % 2 === 0 ? (
            <div>Number is divisible by 2</div>
         ) : number === 3 ? (
            <div>Number is my lucky number</div>
         ) : number === 13 ? (
            <div>This number is haunted</div>
         ) : (
            <div>Number is {number}</div>
         )}

         {!firstVisit && <div>Welcome back</div>}
      </div>
   );
};
```

With clean-react-directives:
```jsx
export const App = () => {
   let number = 2;
   let firstVisit = true;

   return (
      <div>
         <C>
            <div r-if={number % 2 === 0}>Number is divisible by 2</div>
            <div r-else-if={number === 3}>Number is my lucky number</div>
            <div r-else-if={number === 13}>This number is haunted</div>
            <div r-else>Number is {number}</div>

            <div r-if={!firstVisit}>Welcome back</div>
         </C>
      </div>
   );
};
```

<a id="r-show"></a>
# r-show

Another option for conditionally displaying an element is the `r-show` directive. <br>
The difference is that an element with `r-show` will always be rendered and remain in the DOM. `r-show` only toggles the display CSS property of the element.

Without clean-react-directives:
```jsx
export const App = () => {
   let inputVisible = false;

   return (
      <div>
         <input type="text" style={!inputVisible ? { display: 'none' } : {}}/>
      </div>
   );
};
```

With clean-react-directives:
```jsx
export const App = () => {
   let inputVisible = false;

   return (
      <div>
         <C>
            <input type="text" r-show={inputVisible} />
         </C>
      </div>
   );
};
```

<a id="r-class"></a>
# r-class

`clean-react-directives` uses `classnames` npm package behind the scenes to provide  joining classNames together. Example bellow is inspired with the examples from the classnames documentation.

Without clean-react-directives:
```jsx
export const App = () => {
   let foo = 'foo-bar';

   return (
      <div>
         <div className={`${foo} ${ bar ? ' bar' : ''}${ duck ? ' duck' : ''} baz${ quux ? ' quux' : ''}`}></div>
         <div className={`${ bar ? 'bar' : ''} ${ duck ? 'duck' : ''} ${ quux ? ' quux' : ''}`}></div>
      </div>
   );
};
```

With clean-react-directives:
```jsx
export const App = () => {
   let foo = 'foo-bar';

   return (
      <div>
         <C>   
            <div r-class={[foo, { bar: true, duck: false }, 'baz', { quux: true }]}></div>
            <div r-class={{ bar: true, duck: false, quux: true }}></div>
         </C>
      </div>
   );
};
```

`r-class` can be also used in the combination with the standard className directive:
```jsx
export const App = () => {
   return (
      <div>
         <C>   
            <div className="item" r-class={{ bar: true, duck: false }}></div>
         </C>
      </div>
   );
};
```


<a id="r-html"></a>
# r-html

Without clean-react-directives:
```jsx
export const App = () => {
   let paragraph = '<p>Hello world</p>';

   return (
      <div>
         <div dangerouslySetInnerHTML={{__html: paragraph}}></div>
      </div>
   );
};
```

With clean-react-directives:
```jsx
export const App = () => {
   let paragraph = '<p>Hello world</p>'

   return (
      <div>
         <C>
            <div r-html={paragraph}></div>
         </C>
      </div>
   );
};
```

<a id="lack"></a>
# Lack of other directives: r-text, r-for and r-model

The result of `r-text` directive can easily be reproduced with the example bellow, therefore there is no need for additional directive.
```jsx

export const App = () => {
   let text = 'Hello world'
   return <div>{text}</div>;
};
```

Implementation of the `r-for` and `r-model` directives would require the use of the custom Babel plugin. Because of this, adding the library to your project would be much more difficult.

Current implementation only requires you to install one React component, which can be used anywhere in your app without unnecessary configuration.

<a id="deep"></a>
# Deep vs Shallow checking

There are two possible ways to use directive checking with `clean-react-directives`, deep and shallow.

Shallow implementation would only check the direct children of the `C` component:
```jsx
export const App = () => {
   return (
      <C>
         {/* This scope is checked*/}
         <div v-if={true}>Hello</div>
         <div v-else>
            {/* This scope is not checked*/}
            <h1 v-show={false}>World</h1>
         </div>

         <div className="inner">
            {/* This scope is not checked*/}
            <div v-if={true}>Foo</div>
            <div v-else>Bar</div>
         </div>
      </C>
   );
};
```

Adding `deep` flag to the `C` component would check all descendant components:
```jsx
export const App = () => {
   return (
      /* All nested scopes are checked */
      <C deep>
         <div v-if={true}>Hello</div>
         <div v-else>
            <h1 v-show={false}>World</h1>
         </div>

         <div className="inner">
            <div v-if={true}>Foo</div>
            <div v-else>Bar</div>
         </div>
      </C>
   );
};
```

<a id="performance"></a>
# PERFORMANCE OPTIMIZATION

For performance purposes, always keep the `C` component as close to the components which have directives applied.

Less optimized way:
```jsx
export const App = () => {
   return (
      <div>
         <C deep>
            <div r-if={true}>Hello</div>
            <div r-else>World</div>
            <div r-class={{ foo: true }}>Foo</div>

            <div className="wrapper">
               <div className="level_1">
                  <div r-if={true}>React is awesome</div>
                  
                  <div className="level_2">
                     <div r-if={false}>Bar</div>
                     <div r-else-if={true}>Baz</div>
                  </div>
               </div>
            </div>
         </C>
      </div>
   );
};
```

Better optimized way:
```jsx
export const App = () => {
   return (
      <div>
         <C>
            <div r-if={true}>Hello</div>
            <div r-else>World</div>
            <div r-class={{ foo: true }}>Foo</div>
         </C>

         <div className="wrapper">
            <div className="level_1">
               
               <C deep>
                  <div r-if={true}>React is awesome</div>

                  <div className="level_2">
                     <div r-if={false}>Bar</div>
                     <div r-else-if={true}>Baz</div>
                  </div>
               </C>

            </div>
         </div>
      </div>
   );
};
```

<a id="console"></a>
# Console hacking

In the create-react-app in DEVELOPMENT mode, when passing a prop in the format `prop-name` the react component, React expects the value of that prop to be a string.

Since we are passing non-boolean values to the directives r-if, r-else-if, r-else, and r-show, React will throw an error ( Received `true` for a non-boolean attribute `r-if` ).

For this reason, we need to ignore the thrown error message if it is related to our library.

This is not ass clean as we would like it to be, but unfortunately, it is
the only solution we have at this point.
