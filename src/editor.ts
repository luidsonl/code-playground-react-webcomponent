import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { EditorState, Compartment } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { ThemeColors } from './themes';

function createThemeExt(theme: ThemeColors) {
  return EditorView.theme({
    '&': {
      backgroundColor: theme.editor.background,
      color: theme.editor.text,
      height: '100%',
    },
    '.cm-scroller': {
      overflow: 'auto',
    },
    '.cm-content': {
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
      fontSize: '14px',
      caretColor: theme.editor.cursor,
    },
    '.cm-cursor': {
      borderLeftColor: theme.editor.cursor,
    },
    '.cm-cursor-secondary': {
      borderLeftColor: theme.editor.cursor,
    },
    '.cm-selectionBackground': {
      backgroundColor: theme.editor.selection,
    },
    '.cm-activeLine': {
      backgroundColor: theme.editor.activeLine,
    },
    '.cm-matchingBracket': {
      backgroundColor: theme.editor.matchingBracket,
    },
    '.cm-gutters': {
      backgroundColor: theme.editor.gutter,
      color: theme.editor.gutterText,
      borderRight: 'none',
      fontFamily: "'JetBrains Mono', 'Consolas', monospace",
      fontSize: '13px',
    },
    '.cm-activeLineGutter': {
      backgroundColor: theme.editor.activeLine,
    },
    '.cm-foldPlaceholder': {
      backgroundColor: 'transparent',
      color: theme.editor.gutterText,
    },
  });
}

export function createEditor(
  container: HTMLElement,
  code: string,
  onChange: (code: string) => void,
  theme: ThemeColors
): { view: EditorView; updateTheme: (theme: ThemeColors) => void } {
  const themeCompartment = new Compartment();

  const view = new EditorView({
    state: EditorState.create({
      doc: code,
      extensions: [
        basicSetup,
        javascript({ jsx: true, typescript: true }),
        keymap.of([indentWithTab]),
        themeCompartment.of(createThemeExt(theme)),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
      ],
    }),
    parent: container,
  });

  return {
    view,
    updateTheme: (newTheme: ThemeColors) => {
      view.dispatch({
        effects: themeCompartment.reconfigure(createThemeExt(newTheme)),
      });
    },
  };
}
