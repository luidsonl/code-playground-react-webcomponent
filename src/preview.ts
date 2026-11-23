import { createIframeHTML } from './iframe-template';

import reactSource from 'react-source';
import reactDOMSource from 'react-dom-source';

export interface PreviewOptions {
  allowForms?: boolean;
}

export class Preview {
  private iframe: HTMLIFrameElement;
  private ready = false;
  private pendingCode: string | null = null;
  private onReady: (() => void) | null = null;
  private allowForms = false;

  constructor(container: HTMLElement, options: PreviewOptions = {}) {
    this.allowForms = options.allowForms ?? false;
    this.iframe = document.createElement('iframe');
    this.updateSandbox();
    this.iframe.style.width = '100%';
    this.iframe.style.height = '100%';
    this.iframe.style.border = 'none';
    this.iframe.style.display = 'block';
    container.appendChild(this.iframe);

    const html = createIframeHTML(reactSource, reactDOMSource);
    const blob = new Blob([html], { type: 'text/html' });
    this.iframe.src = URL.createObjectURL(blob);

    this.handleMessage = this.handleMessage.bind(this);
    window.addEventListener('message', this.handleMessage);
  }

  private updateSandbox(): void {
    const flags = ['allow-scripts', 'allow-same-origin'];
    if (this.allowForms) flags.push('allow-forms');
    this.iframe.setAttribute('sandbox', flags.join(' '));
  }

  setAllowForms(allow: boolean): void {
    if (this.allowForms === allow) return;
    this.allowForms = allow;
    this.updateSandbox();
  }

  private handleMessage(event: MessageEvent): void {
    if (event.source === this.iframe.contentWindow && event.data.type === 'ready') {
      this.ready = true;
      if (this.pendingCode) {
        this.execute(this.pendingCode);
        this.pendingCode = null;
      }
      if (this.onReady) {
        this.onReady();
        this.onReady = null;
      }
    }
  }

  showError(message: string): void {
    this.iframe.contentWindow?.postMessage({ type: 'error', message }, '*');
  }

  execute(code: string): void {
    if (!this.ready) {
      this.pendingCode = code;
      return;
    }
    this.iframe.contentWindow?.postMessage({ type: 'execute', code }, '*');
  }

  waitReady(): Promise<void> {
    if (this.ready) return Promise.resolve();
    return new Promise((resolve) => {
      this.onReady = resolve;
    });
  }

  destroy(): void {
    window.removeEventListener('message', this.handleMessage);
    if (this.iframe.parentNode) {
      this.iframe.parentNode.removeChild(this.iframe);
    }
    const url = this.iframe.src;
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }
}
