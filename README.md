# code-playground-react

Web component that provides a live React code editor with real-time preview, built with [CodeMirror 6](https://codemirror.net/6/) and [Babel](https://babeljs.io/).

## Build artifacts

| File | Description |
|------|-------------|
| `dist/code-playground-react.js` | Bundle principal (IIFE). Inclui todo o código do web component, CodeMirror, Babel, React e ReactDOM. |
| `dist/code-playground-react.js.map` | Source map para debug. |
| `index.html` | Página de demonstração. Arquivo manual (não gerado pelo build). |

## Arquitetura

### Dependências em runtime (embutidas no bundle)

| Lib | Função |
|-----|--------|
| [CodeMirror 6](https://codemirror.net/6/) | Editor de código com syntax highlighting, JSX e TypeScript. |
| [@babel/standalone](https://babeljs.io/docs/babel-standalone) | Transpila JSX/TSX para JavaScript puro. |
| [React](https://react.dev/) + [ReactDOM](https://react.dev/) | Renderização do preview. |

React e Babel são embutidos no bundle via plugins customizados do Rollup (`embedReactSources` e `embedBabelStandalone`). Eles são lidos dos `node_modules` em tempo de build e convertidos em módulos virtuais (`react-source`, `react-dom-source`, `babel-source`), eliminando a necessidade de o usuário final carregar essas libs separadamente.

### Estrutura de diretórios

```
src/
  index.ts           — Web component principal (custom element)
  editor.ts          — Integração com CodeMirror
  preview.ts         — Iframe de preview com comunicação via postMessage
  iframe-template.ts — Template HTML do iframe (React, ReactDOM, runner)
  transpiler.ts      — Transpilação JSX → JS com Babel
  styles.ts          — Estilos do Shadow DOM
  env.d.ts           — Declarações de tipos para os módulos virtuais
```

### Fluxo de execução

1. O componente `<code-playground-react>` é montado no DOM.
2. Um Shadow DOM é criado com editor (CodeMirror) à esquerda e preview (iframe) à direita.
3. O código-fonte do usuário é transpilado via Babel (JSX → JS, `export default` → variável `__COMPONENT__`).
4. O código transpilado é enviado ao iframe via `postMessage`.
5. Dentro do iframe, React e ReactDOM já estão carregados. O código é executado com `new Function()` e o componente exportado é renderizado via `ReactDOM.createRoot`.

### Preview isolado

O preview roda em um iframe com `sandbox="allow-scripts allow-same-origin"`, garantindo isolamento. A comunicação com o componente pai é feita exclusivamente via `postMessage`.

## Como usar

### 1. Inclua o script

```html
<script src="code-playground-react.js"></script>
```

### 2. Use o web component

```html
<code-playground-react
  code="function App() { return <h1>Hello</h1>; } export default App;"
></code-playground-react>
```

Se o atributo `code` não for fornecido, o componente busca um `<template>` interno:

```html
<code-playground-react>
  <template>
function Greeting() {
  return <h1>Hello, World!</h1>;
}
export default Greeting;
  </template>
</code-playground-react>
```

> O `<template>` é recomendado para código inline, pois o browser não tenta interpretar tags JSX como HTML.  
> A indentação comum é automaticamente removida — você pode alinhar o código à estrutura HTML sem afetar o resultado.

### 3. Controle via JavaScript

```js
const el = document.querySelector('code-playground-react');
el.setAttribute('code', `function Counter() {
  const [count, setCount] = React.useState(0);
  return <h2>{count}</h2>;
}
export default Counter;`);
```

### Atributos (parâmetros)

| Atributo | Tipo | Padrão | Descrição |
|----------|------|--------|-----------|
| `code` | `string` | Código padrão (Hello World) | Código React/JSX a ser executado no preview. |
| `theme` | `string` | — | Reservado para tema futuro. Atualmente sem efeito. |

Ordem de resolução do código:

1. Atributo `code`
2. `<template>` interno
3. `textContent` (fallback para conteúdo textual sem template)
4. Código padrão (Hello World com contador)

Tanto o `<template>` quanto o `textContent` passam por `dedent`: a indentação mínima comum entre as linhas é detectada e removida automaticamente, permitindo que o código seja indentado para alinhar com a estrutura HTML sem poluir o editor.

### Preferência: `<template>`

Sempre que possível, use `<template>` em vez de `textContent` para passar código inline:

```html
<!-- ✅ Correto: JSX protegido pelo template -->
<code-playground-react>
  <template>
function App() {
  return <h1>Hi</h1>;
}
export default App;
  </template>
</code-playground-react>

<!-- ❌ Não funciona: browser interpreta <h1> como HTML -->
<code-playground-react>
  function App() {
    return <h1>Hi</h1>;
  }
  export default App;
</code-playground-react>
```

### Regras do código

- O código deve conter um `export default` de um componente React (função ou classe).
- React e ReactDOM são globais dentro do código — use `React.useState`, `React.createElement`, etc.
- JSX é suportado.

## Desenvolvimento

```bash
npm run build    # Gera dist/code-playground-react.js
npm run dev      # Modo watch (recompila a cada alteração)
```

### Build (Rollup)

O bundle é gerado com:
- `@rollup/plugin-typescript` — compilação TS
- `@rollup/plugin-node-resolve` + `@rollup/plugin-commonjs` — resolução de módulos
- `@rollup/plugin-terser` — minificação
- Plugins customizados `embedBabelStandalone` e `embedReactSources` — embutem Babel, React e ReactDOM como strings no bundle
