import './App.css';
import { useState } from 'react';
import { tokenize, tokensToString } from './transpiler/lexer';

function App() {

  const [output, setOutput] = useState("")

  function onSourceChange(src: string) {
    let tokens = tokensToString(tokenize(src))
    setOutput(tokens)
  }

  return (
    <div className="App">
      <textarea className="src" onChange={ e => onSourceChange(e.target.value)} />
      <textarea readOnly className="output" value={output}> </textarea>
    </div>
  );
}

export default App;
