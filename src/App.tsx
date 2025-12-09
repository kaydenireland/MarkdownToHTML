import './App.css';
import { useState } from 'react';
import { tokenize, tokensToString } from './transpiler/lexer';
import { parse, toString } from './transpiler/parser';
import emit from './transpiler/emitter';

function App() {

  const [output, setOutput] = useState("");
  const [debugParser, setDebugParser] = useState(false);
  const [debugEmitter, setDebugEmitter] = useState(false);
  const [showRawHtml, setShowRawHtml] = useState(false);

  function onSourceChange(src: string) {
    const tokenized = tokenize(src);
    const parsed = parse(tokenized, debugParser);
    const html = emit(parsed, debugEmitter, debugParser);
    setOutput(html);
  }

  return (
  <div className="App">
    <div className="topbar">
      <div className="left">
        <label>
          <input type="checkbox" checked={debugParser} onChange={() => setDebugParser(v => !v)} />
          Parser Debug
        </label>

        <label>
          <input type="checkbox" checked={debugEmitter} onChange={() => setDebugEmitter(v => !v)} />
          Emitter Debug
        </label>
      </div>

      <div className="right">
        <label>
          <input type="checkbox" checked={showRawHtml} onChange={() => setShowRawHtml(v => !v)}/>
          Raw HTML
        </label>
      </div>
    </div>

    <div className="main">
      <textarea className="src" onChange={e => onSourceChange(e.target.value)} />

      {showRawHtml ? (
        <textarea  readOnly  className="output" value={output} />
      ) : (
        <div className="renderedOutput" dangerouslySetInnerHTML={{ __html: output }} />
      )}
    </div>
  </div>
);
}

export default App;
