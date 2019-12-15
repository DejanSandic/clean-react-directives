import React, { createElement, Fragment, Children, ReactNode } from 'react';
import classNames from 'classnames';

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
	let last = false;
	let lastCon = '';

	return Children.map(children, (child) => {
		if (!React.isValidElement(child)) return child;

		/**
       * When checking children, we want to stop when we run into CleanReact
       * component because it does its directive checking
       */
		if (child.type === CleanReact) return child;

		let props = { ...child.props };
		let children = props.children;
		let cloningRequired = false;

		/**
       * If deep flag is true check all children of the component
       */
		if (deep && children) {
			children = applyDirectives(children, deep);
			cloningRequired = true;
		}

		/**
       * Handle r-html directive
       *
       */
		if ('r-html' in props) {
			const __html = props['r-html'];
			if (typeof __html !== 'string') throw new Error('r-html expects a string as its value.');

			props = { ...props, dangerouslySetInnerHTML: { __html } };
			cloningRequired = true;
		}

		/**
       * Handle r-class directive
       *
       */
		if ('r-class' in props) {
			const rclass = props['r-class'];
			const className = props.className ? classNames(props.className, rclass) : classNames(rclass);
			props = { ...props, className };
			cloningRequired = true;
		}

		/**
       * Handle r-show directive
       *
       */
		if ('r-show' in props && !props['r-show']) {
			const style = child.props.style || {};
			props = { ...props, style: { ...style, display: 'none' } };
			cloningRequired = true;
		}

		/**
       * Handle r-if r-else-if and r-else directives
       *
       */
		let rif = 'r-if' in props && 'r-if';
		let relseif = 'r-else-if' in props && 'r-else-if';
		let relse = 'r-else' in props && 'r-else';

		if ((rif && relseif) || (rif && relse) || (relseif && relse)) {
			throw 'You cannot combine r-if, r-else-if and r-else on the same component';
		}

		if (rif) {
			lastCon = rif;
			last = props[rif];
			if (!last) return null;
		}

		if (relseif || relse) {
			if (lastCon !== 'r-if' && lastCon !== 'r-else-if') {
				lastCon = relseif || relse;
				throw `${lastCon} can only be placed after r-if or r-else-if`;
			}

			if ((!relse && !props[relseif]) || last) return null;
			last = true;
		}

		/**
       * If cloningRequired is set to true, meaning the child component has been modified,
       * strip down library-related props and clone the child using createElement function
       *
       * We use createElement and not cloneElement because cloneElement keeps the original
       * props of the child component
       */
		if (cloningRequired) {
			libProps.forEach((prop) => delete props[prop]);
			child = createElement(child.type, { ...props }, children);
		}

		return child;
	});
}

/**
 * Library related props
 */
const libProps = [ 'r-if', 'r-else-if', 'r-else', 'r-show', 'r-class', 'r-html' ];

/**
 * In the create-react-app in DEVELOPMENT mode, when passing a prop in the format `prop-name`
 * the react component, React expects the value of that prop to be a string
 *
 * Since we are passing non-boolean values to the directives r-if, r-else-if, r-else,
 * and r-show, React will throw an error ( Received `true` for a non-boolean attribute `r-if` )
 *
 * For this reason, we need to ignore the thrown error message if it is related to our library.
 * This is not ass clean as we would like it to be, but unfortunately, it is
 * the only solution we have at this point
 */
if (process && process.env && !process.env.rif && process.env.NODE_ENV !== 'production') {
	const error = console.error;

	console.error = (...args: string[]) => {
		function includesString(text: any, string: string) {
			if (typeof text !== 'string') return false;
			return text.includes(string);
		}

		const nonBoolean = args.some((arg) => includesString(arg, 'non-boolean'));
		const libRelated = args.some((arg: string) => libProps.some((prop) => includesString(arg, prop)));

		if (!nonBoolean || !libRelated) error(...args);
	};

	process.env.rif = 'true';
}
