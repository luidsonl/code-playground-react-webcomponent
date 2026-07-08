import { createEditor } from './editor';
import { transpile } from './transpiler';
import { Preview } from './preview';
import { styles } from './styles';

class CodePlaygroundReact extends HTMLElement {
  private shadow: ShadowRoot;
  private editorView: ReturnType<typeof createEditor> | null = null;
  private preview: Preview | null = null;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private _code = '';

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void {
    this.render();
  }

  disconnectedCallback(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.preview?.destroy();
    this.editorView?.destroy();
  }

  static get observedAttributes(): string[] {
    return ['code', 'theme'];
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    if (name === 'code' && value !== null && value !== this._code) {
      this._code = value;
      if (this.editorView) {
        this.editorView.dispatch({
          changes: { from: 0, to: this.editorView.state.doc.length, insert: value },
        });
      }
    }
  }

  private getInitialCode(): string {
    const attrCode = this.getAttribute('code');
    if (attrCode !== null) return attrCode;
    const script = this.querySelector('script[type="text/plain"]');
    if (script) return this.dedent(script.textContent || '');
    const template = this.querySelector('template');
    if (template) return this.dedent(template.innerHTML);
    const text = this.textContent;
    if (text?.trim()) return this.dedent(text);
    return `import { useState } from 'react';

function HelloWorld() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Hello, React!</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>
        Increment
      </button>
    </div>
  );
}

export default HelloWorld;`;
  }

  private dedent(code: string): string {
    const lines = code.split('\n');
    if (lines.length === 0) return '';
    const minIndent = lines
      .filter(l => l.trim())
      .reduce((min, l) => Math.min(min, l.search(/\S/)), Infinity);
    if (minIndent === Infinity || minIndent === 0) return code.trim();
    return lines.map(l => l.slice(minIndent)).join('\n').trim();
  }

  private render(): void {
    const styleTag = document.createElement('style');
    styleTag.textContent = styles;
    this.shadow.appendChild(styleTag);

    const wrapper = document.createElement('div');
    wrapper.className = 'playground';
    this.shadow.appendChild(wrapper);

    const editorContainer = document.createElement('div');
    editorContainer.className = 'editor-panel';
    wrapper.appendChild(editorContainer);

    const editorToolbar = document.createElement('div');
    editorToolbar.className = 'toolbar';
    editorToolbar.innerHTML = '<span class="toolbar-label">Editor</span>';
    editorContainer.appendChild(editorToolbar);

    const editorBody = document.createElement('div');
    editorBody.style.height = 'calc(100% - 32px)';
    editorContainer.appendChild(editorBody);

    const previewContainer = document.createElement('div');
    previewContainer.className = 'preview-panel';
    wrapper.appendChild(previewContainer);

    const previewToolbar = document.createElement('div');
    previewToolbar.className = 'preview-header';
    previewToolbar.innerHTML = '<span class="toolbar-label">Preview</span>';
    previewContainer.appendChild(previewToolbar);

    const previewBody = document.createElement('div');
    previewBody.style.height = 'calc(100% - 28px)';
    previewContainer.appendChild(previewBody);

    requestAnimationFrame(() => {
      const code = this.getInitialCode();
      this._code = code;

      this.preview = new Preview(previewBody);

      this.editorView = createEditor(editorBody, code, (newCode: string) => {
        this._code = newCode;
        this.debouncedExecute(newCode);
      });

      this.preview.waitReady().then(() => {
        this.executeCode(code);
      });
    });
  }

  private debouncedExecute(code: string): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.executeCode(code);
    }, 400);
  }

  private executeCode(raw: string): void {
    if (!this.preview) return;
    try {
      const transpiled = transpile(raw);
      this.preview.execute(transpiled);
    } catch (err: unknown) {
      this.preview.showError(err instanceof Error ? err.message : String(err));
    }
  }
}

customElements.define('code-playground-react', CodePlaygroundReact);

export default CodePlaygroundReact;
