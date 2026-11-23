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

### Imports do React

O playground suporta importar hooks do React diretamente:

```tsx
import { useState, useEffect } from 'react';
```

Isso é convertido pelo Babel para `const { useState, useEffect } = React;` automaticamente.  
`import React from 'react'` e `import * as React from 'react'` são removidos (React já está no escopo).

### Preview isolado

O preview roda em um iframe com `sandbox="allow-scripts allow-same-origin"` por padrão, garantindo isolamento. A comunicação com o componente pai é feita exclusivamente via `postMessage`. Quando `allow-forms` está ativo (padrão), o sandbox também inclui `allow-forms` para permitir envio de formulários no código do preview.

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

Se o atributo `code` não for fornecido, o componente busca um `<script type="text/plain">` interno:

```html
<code-playground-react>
  <script type="text/plain">
    import { useState } from 'react';

    function Counter() {
      const [count, setCount] = useState(0);
      return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
    }
    export default Counter;
  </script>
</code-playground-react>
```

> `<script type="text/plain">` é o método recomendado: o browser trata o conteúdo como texto puro, sem tentar parsear JSX como HTML.  
> A indentação comum é automaticamente removida — você pode alinhar o código à estrutura HTML sem afetar o resultado.

> **Não use `<template>`**: o browser parseia o conteúdo como HTML, corrompendo JSX com atributos como `onClick={...}` ou `style={{...}}`.

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
| `theme` | `string` | `dark` | Tema do editor. Valores: `dark`, `light`, `dracula`, `nord`. |
| `lang` | `string` | `tsx` | Modo de linguagem do editor. Valores: `jsx`, `tsx`. |
| `height` | `string` | automático | Altura total do playground. Aceita número (interpretado como `px`) ou unidade CSS (`px`, `rem`, `em`, `vh`, `vw`, `%`). |
| `allow-forms` | `boolean` | `true` | Controla se o iframe do preview permite envio de formulários (`allow-forms` no sandbox). Use `allow-forms="false"` para bloquear. |

### Altura e scroll

O atributo `height` define a altura fixa do elemento. Aceita um número — interpretado como pixels — ou uma unidade CSS:

```html
<code-playground-react height="500">
  <script type="text/plain">
    ...código...
  </script>
</code-playground-react>
```

```html
<code-playground-react height="50vh"></code-playground-react>
```

Se omitido, o componente usa altura automática com altura mínima de `400px`.

Quando o conteúdo (código ou resultado do preview) ultrapassa a altura definida, o scroll é ativado automaticamente **tanto no editor de código quanto no preview** — em vez de o playground crescer, cada painel ganha sua própria barra de rolagem.

O atributo é reativo via `setAttribute`:

```js
el.setAttribute('height', '600px');
```

### Temas

O componente oferece 4 temas integrados:

| Tema | Editor | Destaque |
|------|--------|----------|
| `dark` (padrão) | Fundo escuro `#1e1e1e` | Inspirado no One Dark, fácil para longas sessões |
| `light` | Fundo claro `#ffffff` | Inspirado no GitHub, ideal para ambientes bem iluminados |
| `dracula` | Fundo roxo escuro `#282a36` | Alto contraste, cores vibrantes |
| `nord` | Fundo azul acinzentado `#2e3440` | Suave e agradável para leitura |

```html
<code-playground-react theme="nord">
  <script type="text/plain">
    ...código...
  </script>
</code-playground-react>
```

O tema pode ser alterado dinamicamente via `setAttribute`:

```js
el.setAttribute('theme', 'dracula');
```

Isso atualiza em tempo real o fundo do editor, gutter, toolbar e demais elementos do playground.

Ordem de resolução do código:

1. Atributo `code`
2. `<script type="text/plain">` interno
3. `textContent`
4. Código padrão (Hello World com contador)

Tanto `<script type="text/plain">` quanto `textContent` passam por `dedent`: a indentação mínima comum entre as linhas é detectada e removida automaticamente.

### Preferência: `<script type="text/plain">`

Sempre use `<script type="text/plain">` em vez de `textContent`:

```html
<!-- ✅ Correto: JSX preservado, suporta onClick, style etc -->
<code-playground-react>
  <script type="text/plain">
    import { useState } from 'react';
    function App() {
      const [n, setN] = useState(0);
      return <button onClick={() => setN(n + 1)}>{n}</button>;
    }
    export default App;
  </script>
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
- React e ReactDOM são globais dentro do código.
- Imports do React (`import { useState } from 'react'`) são suportados.
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
