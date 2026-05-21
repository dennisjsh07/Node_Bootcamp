import { useState, useRef, useEffect } from "react";

function App() {
  const [incomeTax, setIncomeTax] = useState(5000);
  const divRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      console.log(divRef.current);
      divRef.current.innerHTML = 10;
    }, 5000);
  }, []);

  return (
    <div>
      Hi there, Your income tax returns are <div ref={divRef}>{incomeTax}</div>
    </div>
  );
}

export default App;
