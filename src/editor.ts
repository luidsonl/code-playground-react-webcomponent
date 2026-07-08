import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { EditorState } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';

export function createEditor(
  container: HTMLElement,
  code: string,
  onChange: (code: string) => void
): EditorView {
  const view = new EditorView({
    state: EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        javascript({ jsx: true, typescript: true }),
        keymap.of([indentWithTab]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          '&': { height: '100%' },
          '.cm-scroller': { overflow: 'auto' },
          '.cm-content': { fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace", fontSize: '14px' },
          '.cm-gutters': { fontFamily: "'JetBrains Mono', 'Consolas', monospace", fontSize: '13px' },
        }),
      ],
    }),
    parent: container,
  });

  return view;
}
