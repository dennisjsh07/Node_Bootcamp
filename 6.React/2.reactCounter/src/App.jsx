import React, { useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <Button count={count} setCount={setCount}></Button>
    </div>
  );
}

function Button(props) {
  function onButtonClick() {
    props.setCount(props.count + 1);
  }
  return <button onClick={onButtonClick}>Counter {props.count}</button>;
  // return React.createElement("button", {onClick: onButtonClick}, `Counter ${props.count}`);
}

export default App;
