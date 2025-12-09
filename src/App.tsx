import './App.css';
import { useState } from 'react';
import { tokenize, tokensToString } from './transpiler/lexer';
import { parse, toString } from './transpiler/parser';
import emit from './transpiler/emitter';

function App() {

  const [output, setOutput] = useState("")

  function onSourceChange(src: string) {
    let tokenized = tokenize(src);
    let parsed = parse(tokenized, false);
    let html = emit(parsed, false);
    setOutput(html)
  }

  return (
    <div className="App">
      <textarea className="src" onChange={ e => onSourceChange(e.target.value)} />
      <textarea readOnly className="output" value={output}> </textarea>
    </div>
  );
}

export default App;
