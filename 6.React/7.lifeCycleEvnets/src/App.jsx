/**
 * useEffect : This hook hooks you into the lifecycle of a component.
 * when a component mounts on the screen it is one lifecycle and when unmounted it is another lifcycle
 */
import { useState, useEffect } from "react";
function App() {
  const [render, setRender] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setRender(false);
    }, 5000);
  }, []);

  return <div>{render ? <MyComponent /> : <></>}</div>;
}

function MyComponent() {
  useEffect(() => {
    console.error("component mounted");
    return () => {
      console.log("Component Unmounted");
    };
  }, []);
  return <div>Hi from component</div>;
}

export default App;
