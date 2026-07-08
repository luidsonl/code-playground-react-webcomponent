import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { EditorState, Compartment } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { indentWithTab } from '@codemirror/commands';
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { ThemeColors } from './themes';

function createSyntaxExt(theme: ThemeColors) {
  const s = theme.syntax;
  const hl = HighlightStyle.define([
    { tag: tags.keyword, color: s.keyword },
    { tag: tags.definitionKeyword, color: s.keyword },
    { tag: tags.moduleKeyword, color: s.keyword },
    { tag: tags.controlKeyword, color: s.keyword },
    { tag: tags.operatorKeyword, color: s.keyword },
    { tag: tags.string, color: s.string },
    { tag: tags.docString, color: s.string },
    { tag: tags.character, color: s.string },
    { tag: tags.number, color: s.number },
    { tag: tags.bool, color: s.bool },
    { tag: tags.null, color: s.bool },
    { tag: tags.atom, color: s.bool },
    { tag: tags.comment, color: s.comment, fontStyle: 'italic' },
    { tag: tags.lineComment, color: s.comment, fontStyle: 'italic' },
    { tag: tags.blockComment, color: s.comment, fontStyle: 'italic' },
    { tag: tags.variableName, color: s.variable },
    { tag: tags.local(tags.variableName), color: s.variable },
    { tag: tags.special(tags.variableName), color: s.variable },
    { tag: tags.function(tags.variableName), color: s.functionName },
    { tag: tags.typeName, color: s.typeName },
    { tag: tags.className, color: s.typeName },
    { tag: tags.namespace, color: s.typeName },
    { tag: tags.operator, color: s.operator },
    { tag: tags.derefOperator, color: s.operator },
    { tag: tags.arithmeticOperator, color: s.operator },
    { tag: tags.logicOperator, color: s.operator },
    { tag: tags.compareOperator, color: s.operator },
    { tag: tags.tagName, color: s.tagName },
    { tag: tags.attributeName, color: s.attributeName },
    { tag: tags.propertyName, color: s.propertyName },
    { tag: tags.self, color: s.self },
    { tag: tags.regexp, color: s.regexp },
    { tag: tags.escape, color: s.regexp },
    { tag: tags.special(tags.string), color: s.regexp },
    { tag: tags.bracket, color: s.bracket },
    { tag: tags.angleBracket, color: s.bracket },
    { tag: tags.squareBracket, color: s.bracket },
    { tag: tags.paren, color: s.bracket },
    { tag: tags.brace, color: s.bracket },
    { tag: tags.separator, color: s.bracket },
    { tag: tags.invalid, color: s.invalid },
  ]);
  return syntaxHighlighting(hl);
}

function createThemeExt(theme: ThemeColors) {
  return [
    EditorView.theme({
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
    }),
    createSyntaxExt(theme),
  ];
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
