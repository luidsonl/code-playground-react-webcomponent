export interface ThemeColors {
  editor: {
    background: string;
    text: string;
    gutter: string;
    gutterText: string;
    activeLine: string;
    cursor: string;
    selection: string;
    matchingBracket: string;
  };
  chrome: {
    toolbarBg: string;
    toolbarText: string;
    toolbarBorder: string;
    border: string;
    previewBg: string;
    previewHeaderBg: string;
    previewHeaderText: string;
  };
  syntax: {
    keyword: string;
    string: string;
    number: string;
    bool: string;
    comment: string;
    variable: string;
    functionName: string;
    typeName: string;
    operator: string;
    tagName: string;
    attributeName: string;
    propertyName: string;
    self: string;
    regexp: string;
    bracket: string;
    invalid: string;
  };
}

export const themes: Record<string, ThemeColors> = {
  dark: {
    editor: {
      background: '#1e1e1e',
      text: '#d4d4d4',
      gutter: '#1e1e1e',
      gutterText: '#999999',
      activeLine: '#2a2a2a',
      cursor: '#6db3f2',
      selection: '#365880',
      matchingBracket: '#4a4d51',
    },
    chrome: {
      toolbarBg: '#252526',
      toolbarText: '#cccccc',
      toolbarBorder: '#3c3c3c',
      border: '#333333',
      previewBg: '#ffffff',
      previewHeaderBg: '#f8f9fa',
      previewHeaderText: '#666666',
    },
    syntax: {
      keyword: '#c678dd',
      string: '#98c379',
      number: '#d19a66',
      bool: '#d19a66',
      comment: '#5c6370',
      variable: '#e06c75',
      functionName: '#61afef',
      typeName: '#e5c07b',
      operator: '#56b6c2',
      tagName: '#e06c75',
      attributeName: '#d19a66',
      propertyName: '#e5c07b',
      self: '#e06c75',
      regexp: '#98c379',
      bracket: '#abb2bf',
      invalid: '#ff0000',
    },
  },
  light: {
    editor: {
      background: '#ffffff',
      text: '#24292e',
      gutter: '#ffffff',
      gutterText: '#959da5',
      activeLine: '#f6f8fa',
      cursor: '#044289',
      selection: '#c8e1ff',
      matchingBracket: '#f0f0f0',
    },
    chrome: {
      toolbarBg: '#f6f8fa',
      toolbarText: '#24292e',
      toolbarBorder: '#e1e4e8',
      border: '#e1e4e8',
      previewBg: '#ffffff',
      previewHeaderBg: '#f6f8fa',
      previewHeaderText: '#586069',
    },
    syntax: {
      keyword: '#d73a49',
      string: '#032f62',
      number: '#0550ae',
      bool: '#0550ae',
      comment: '#6a737d',
      variable: '#e36209',
      functionName: '#6f42c1',
      typeName: '#22863a',
      operator: '#d73a49',
      tagName: '#22863a',
      attributeName: '#6f42c1',
      propertyName: '#0550ae',
      self: '#e36209',
      regexp: '#032f62',
      bracket: '#24292e',
      invalid: '#d73a49',
    },
  },
  dracula: {
    editor: {
      background: '#282a36',
      text: '#f8f8f2',
      gutter: '#282a36',
      gutterText: '#8090c0',
      activeLine: '#313346',
      cursor: '#f8f8f0',
      selection: '#555973',
      matchingBracket: '#3b3d4a',
    },
    chrome: {
      toolbarBg: '#21222c',
      toolbarText: '#f8f8f2',
      toolbarBorder: '#44475a',
      border: '#44475a',
      previewBg: '#ffffff',
      previewHeaderBg: '#f8f9fa',
      previewHeaderText: '#666666',
    },
    syntax: {
      keyword: '#ff79c6',
      string: '#f1fa8c',
      number: '#bd93f9',
      bool: '#bd93f9',
      comment: '#6272a4',
      variable: '#50fa7b',
      functionName: '#50fa7b',
      typeName: '#8be9fd',
      operator: '#ff79c6',
      tagName: '#ff79c6',
      attributeName: '#50fa7b',
      propertyName: '#f8f8f2',
      self: '#50fa7b',
      regexp: '#f1fa8c',
      bracket: '#f8f8f2',
      invalid: '#ff5555',
    },
  },
  nord: {
    editor: {
      background: '#2e3440',
      text: '#d8dee9',
      gutter: '#2e3440',
      gutterText: '#7887a0',
      activeLine: '#3b4252',
      cursor: '#a5d8e8',
      selection: '#546687',
      matchingBracket: '#4c5568',
    },
    chrome: {
      toolbarBg: '#2e3440',
      toolbarText: '#d8dee9',
      toolbarBorder: '#3b4252',
      border: '#3b4252',
      previewBg: '#ffffff',
      previewHeaderBg: '#f8f9fa',
      previewHeaderText: '#666666',
    },
    syntax: {
      keyword: '#81a1c1',
      string: '#a3be8c',
      number: '#b48ead',
      bool: '#b48ead',
      comment: '#4c566a',
      variable: '#d8dee9',
      functionName: '#88c0d0',
      typeName: '#8fbcbb',
      operator: '#81a1c1',
      tagName: '#81a1c1',
      attributeName: '#d08770',
      propertyName: '#d8dee9',
      self: '#d8dee9',
      regexp: '#a3be8c',
      bracket: '#d8dee9',
      invalid: '#bf616a',
    },
  },
};

export const defaultTheme = 'dark';

export function getTheme(name?: string | null): ThemeColors {
  return themes[name ?? ''] || themes[defaultTheme];
}
