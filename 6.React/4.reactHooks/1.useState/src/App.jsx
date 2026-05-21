import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Button count={count} setCount={setCount}></Button>
    </div>
  );
}

function Button({ count, setCount }) {
  function increaseCount() {
    setCount((count) => count + 1);
  }
  return (
    <div onClick={increaseCount}>
      <button>Count is {count}</button>
    </div>
  );
}

export default App;
