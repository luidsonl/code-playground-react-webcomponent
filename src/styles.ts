import { ThemeColors } from './themes';

export function getStyles(theme: ThemeColors): string {
  return `
:host {
  display: block;
  border: 1px solid ${theme.chrome.border};
  border-radius: 10px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  contain: layout style;
}

.playground {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 400px;
  height: 100%;
}

.editor-panel {
  position: relative;
  background: ${theme.editor.background};
  overflow: hidden;
  border-right: 1px solid ${theme.chrome.border};
}

.editor-panel .cm-editor {
  height: 100%;
}

.editor-panel .cm-editor .cm-scroller {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
}

.preview-panel {
  position: relative;
  background: ${theme.chrome.previewBg};
  overflow: hidden;
}

.preview-panel iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: ${theme.chrome.toolbarBg};
  color: ${theme.chrome.toolbarText};
  font-size: 12px;
  gap: 8px;
  border-bottom: 1px solid ${theme.chrome.toolbarBorder};
}

.toolbar-label {
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 11px;
  color: ${theme.chrome.toolbarText};
  opacity: 0.6;
}

.toolbar-actions {
  display: flex;
  gap: 6px;
}

.toolbar button {
  background: none;
  border: 1px solid ${theme.chrome.toolbarText};
  color: ${theme.chrome.toolbarText};
  padding: 3px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  font-family: inherit;
  transition: background 0.15s;
  opacity: 0.7;
}

.toolbar button:hover {
  opacity: 1;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 12px;
  background: ${theme.chrome.previewHeaderBg};
  color: ${theme.chrome.previewHeaderText};
  font-size: 12px;
  border-bottom: 1px solid ${theme.chrome.border};
}

.preview-header .toolbar-label {
  color: ${theme.chrome.previewHeaderText};
  opacity: 0.7;
}

@media (max-width: 767px) {
  .playground {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    min-height: 600px;
  }

  .editor-panel {
    border-right: none;
    border-bottom: 1px solid ${theme.chrome.border};
  }
}

.error-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  background: #fff5f5;
  color: #c53030;
  font-family: monospace;
  font-size: 13px;
  white-space: pre-wrap;
  word-break: break-word;
}
`;
}

