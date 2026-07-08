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
    const text = this.textContent?.trim();
    if (text) return text;
    return `function HelloWorld() {
  const [count, setCount] = React.useState(0);
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
      console.warn('[code-playground-react] Transpile error:', err);
    }
  }
}

customElements.define('code-playground-react', CodePlaygroundReact);

export default CodePlaygroundReact;
