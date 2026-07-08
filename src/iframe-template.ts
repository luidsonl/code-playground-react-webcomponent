export function createIframeHTML(reactCode: string, reactDOMCode: string): string {
  return '<!DOCTYPE html>' +
    '<html>' +
    '<head>' +
    '<style>' +
      'body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}' +
      '#root{padding:16px;min-height:100px}' +
      '.error{color:#e53e3e;padding:16px;font-family:monospace;white-space:pre-wrap;font-size:13px}' +
      '.waiting{color:#718096;padding:16px;font-size:14px}' +
    '</style>' +
    '</head>' +
    '<body>' +
    '<div id="root"><div class="waiting">Waiting for code...</div></div>' +
    '<script>' + reactCode + '</' + 'script>' +
    '<script>' + reactDOMCode + '</' + 'script>' +
    '<script>' +
    'window.addEventListener("message",function(e){' +
      'if(e.data.type!=="execute")return;' +
      'var r=document.getElementById("root");' +
      'try{' +
        'if(window.__root__){window.__root__.unmount();window.__root__=null}' +
        'var f=new Function("React","ReactDOM",e.data.code+"\\nreturn __COMPONENT__;");' +
        'var C=f(React,ReactDOM);' +
        'if(C){' +
          'window.__root__=ReactDOM.createRoot(r);' +
          'window.__root__.render(React.createElement(C));' +
        '}' +
      '}catch(err){' +
        'r.innerHTML="<pre class=\\"error\\">"+err.message+"\\n"+(err.stack||"")+"</pre>";' +
      '}' +
    '});' +
    'window.parent.postMessage({type:"ready"},"*");' +
    '</' + 'script>' +
    '</body>' +
    '</html>';
}
