import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';
import license from 'rollup-plugin-license';
import path from 'path';

export default {
	input: 'src/index.ts',
	external: [ 'react' ],
	output: [
		{
			file: 'dist/index.cjs.js',
			format: 'cjs'
		},
		{
			file: 'dist/index.es.js',
			format: 'esm'
		},
		{
			name: 'lib',
			file: 'dist/index.umd.js',
			format: 'umd',
			globals: {
				react: 'React',
				classnames: 'classnames'
			}
		}
	],
	plugins: [
		resolve(),
		commonjs(),
		typescript({ clean: true }),
		terser({ include: [ /^.+\.umd\.js$/ ] }),
		license({
			banner: {
				content: {
					file: path.join(__dirname, 'licence'),
					encoding: 'utf-8'
				}
			}
		})
	]
};
