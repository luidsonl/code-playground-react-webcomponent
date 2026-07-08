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
  },
};

export const defaultTheme = 'dark';

export function getTheme(name?: string | null): ThemeColors {
  return themes[name ?? ''] || themes[defaultTheme];
}
