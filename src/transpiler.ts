import babelSource from 'babel-source';

let Babel: any = null;

function getBabel(): any {
  if (!Babel) {
    const mod = { exports: {} };
    const fn = new Function('module', 'exports', babelSource);
    fn(mod, mod.exports);
    Babel = mod.exports;
  }
  return Babel;
}

export function transpile(code: string, lang?: string): string {
  const b = getBabel();

  const isTsx = lang === 'tsx';
  const presets: any[] = [['react', { runtime: 'classic' }]];
  if (isTsx) presets.push(['typescript']);

  const result = b.transform(code, {
    filename: isTsx ? 'file.tsx' : 'file.jsx',
    presets,
    plugins: [
      function reactImportRewriter(api: any) {
        const t = api.types;
        return {
          visitor: {
            ImportDeclaration(path: any) {
              if (path.node.source.value !== 'react') return;

              const specifiers = path.node.specifiers;
              if (specifiers.length === 0) {
                path.remove();
                return;
              }

              const namedSpecifiers = specifiers.filter(
                (s: any) => s.type === 'ImportSpecifier'
              );

              const defaultSpecifier = specifiers.find(
                (s: any) => s.type === 'ImportDefaultSpecifier'
              );

              const namespaceSpecifier = specifiers.find(
                (s: any) => s.type === 'ImportNamespaceSpecifier'
              );

              if (namedSpecifiers.length > 0) {
                const properties = namedSpecifiers.map((s: any) =>
                  t.objectProperty(
                    t.identifier(s.imported.name),
                    t.identifier(s.local.name),
                    false,
                    true
                  )
                );

                path.replaceWith(
                  t.variableDeclaration('const', [
                    t.variableDeclarator(
                      t.objectPattern(properties),
                      t.identifier('React')
                    ),
                  ])
                );
              } else if (defaultSpecifier || namespaceSpecifier) {
                path.remove();
              }
            },
          },
        };
      },
      function exportDefaultPlugin(api: any) {
        const types = api.types;
        return {
          visitor: {
            ExportDefaultDeclaration(path: any) {
              const decl = path.node.declaration;
              const id = types.identifier('__COMPONENT__');

              if (
                decl.type === 'FunctionDeclaration' ||
                decl.type === 'ClassDeclaration'
              ) {
                const name = decl.id || id;
                path.replaceWithMultiple([
                  decl,
                  types.variableDeclaration('var', [
                    types.variableDeclarator(id, name),
                  ]),
                ]);
              } else {
                path.replaceWith(
                  types.variableDeclaration('var', [
                    types.variableDeclarator(id, decl),
                  ]),
                );
              }
            },
          },
        };
      },
    ],
    sourceType: 'module',
  });

  let output: string = result.code;
  output = output.replace(/["']use strict["'];?\s*/g, '');
  return output;
}
