import React, { createElement, Fragment, cloneElement, Children, ReactNode } from 'react';
import classNames from 'classnames';

/**
 * In create-react-app in DEVELOPMENT mode, when passing a prop in the format `prop-name`
 * to the react component, react expects value of that prop to be a string.
 * 
 * Since we are passing non-boolean values to props r-if, r-else-if, r-else and r-show,
 * react will throw an error ( Received `true` for a non-boolean attribute `r-if` ).
 * 
 * For this reason we need ignore thrown error message if it is related to our library.
 * This is not ass cleen as we would like it to be, but unfortunately it is
 * the only solutioin we have at this point
 */
if (process && process.env && !process.env.rif && process.env.NODE_ENV === 'development') {
	const error = console.error;

	console.error = (...args: string[]) => {
		const nonBoolean = args[0].includes('non-boolean');

		if (nonBoolean) {
			const libRelated = args.some((arg: string) => {
				const conditions = [ 'r-if', 'r-else-if', 'r-else', 'r-show', 'r-class' ];
				return conditions.some((condition) => arg.includes(condition));
			});
			if (libRelated) return;
		}

		error(...args);
	};

	process.env.rif = 'true';
}

/**
 * Export default HOC component
 */
interface Props {
	children?: ReactNode;
	deep?: boolean;
}
export default function CleanReact({ children, deep }: Props) {
	return createElement(Fragment, {}, applyDirectives(children, deep));
}

/**
 * Main function
 */
function applyDirectives(children: ReactNode, deep: boolean): ReactNode {
	if (!React.isValidElement(children)) return children;

	let last = false;

	return Children.map(children, (child) => {
		if (!React.isValidElement(child)) return child;

		/**
		 * When checking children, we want to stop when we run into ReactClean
		 * component because it does its own directive checking.
		 */
		if (child.type === CleanReact) return child;

		const { props } = child;
		let modifiedChildren;
		let modifiedProps = {};
		let cloningRequired = false;

		/**
		 * If deep flag is true check all children of the component
		 */
		if (deep && props.children) {
			modifiedChildren = applyDirectives(props.children, deep);
			cloningRequired = true;
		}

		/**
		 * Handle r-html directive
		 * 
		 */
		if ('r-html' in props) {
			const __html = props['r-html'];
			if (typeof __html !== 'string') throw new Error('r-html expects a string as its value.');

			modifiedProps = { ...modifiedProps, dangerouslySetInnerHTML: { __html } };
			cloningRequired = true;
		}

		/**
		 * Handle r-class directive
		 * 
		 */
		if ('r-class' in props) {
			const rclass = props['r-class'];
			const className = props.className ? classNames(props.className, rclass) : classNames(rclass);
			modifiedProps = { ...modifiedProps, className };
			cloningRequired = true;
		}

		/**
		 * Handle r-show directive
		 * 
		 */
		if ('r-show' in props && !props['r-show']) {
			const style = child.props.style || {};
			modifiedProps = { ...modifiedProps, style: { ...style, display: 'none' } };
			cloningRequired = true;
		}

		/**
		 * Handle r-if r-else-if and r-else directives
		 * 
		 */
		if ('r-if' in props || 'r-else-if' in props || 'r-else' in props) {
			const { 'r-if': rif, 'r-else-if': relseif } = props;

			// Reset the last directive check
			if ('r-if' in props) last = false;

			if (rif || (relseif && !last) || ('r-else' in props && !last)) {
				last = true;
			} else {
				return null;
			}
		}

		/**
		 * If needed, replace the child with its clone with updated properties
		 * and strip all library specific props
		 * 
		 */
		if (cloningRequired) {
			child = cloneElement(child, { ...props, ...modifiedProps }, modifiedChildren || props.children);
		}

		return child;
	});
}
