import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

function embedBabelStandalone() {
  return {
    name: 'embed-babel',
    resolveId(id) {
      if (id === 'babel-source') return '\0babel-source';
      return null;
    },
    load(id) {
      if (id === '\0babel-source') {
        const babelPath = require.resolve('@babel/standalone/babel.min.js');
        const content = fs.readFileSync(babelPath, 'utf-8');
        return `export default ${JSON.stringify(content)}`;
      }
      return null;
    }
  };
}

function embedReactSources() {
  let reactSource = '';
  let reactDOMSource = '';

  return {
    name: 'embed-react',
    buildStart() {
      const reactPkgDir = path.dirname(require.resolve('react/package.json'));
      const reactDOMPkgDir = path.dirname(require.resolve('react-dom/package.json'));
      reactSource = fs.readFileSync(
        path.join(reactPkgDir, 'umd', 'react.production.min.js'),
        'utf-8'
      );
      reactDOMSource = fs.readFileSync(
        path.join(reactDOMPkgDir, 'umd', 'react-dom.production.min.js'),
        'utf-8'
      );
    },
    resolveId(id) {
      if (id === 'react-source') return '\0react-source';
      if (id === 'react-dom-source') return '\0react-dom-source';
      return null;
    },
    load(id) {
      if (id === '\0react-source') {
        return `export default ${JSON.stringify(reactSource)}`;
      }
      if (id === '\0react-dom-source') {
        return `export default ${JSON.stringify(reactDOMSource)}`;
      }
      return null;
    }
  };
}

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/code-playground-react.js',
    format: 'iife',
    name: 'CodePlaygroundReact',
    sourcemap: true,
  },
  plugins: [
    embedBabelStandalone(),
    embedReactSources(),
    resolve({
      browser: true,
      preferBuiltins: false,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      sourceMap: true,
      inlineSources: true,
    }),
    terser({
      compress: {
        passes: 1,
      },
      mangle: {
        reserved: ['CodePlaygroundReact'],
      },
      format: {
        comments: false,
      },
    }),
  ]
};
