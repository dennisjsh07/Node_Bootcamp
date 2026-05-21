import { useState, useEffect } from "react";

function App() {
  const [bankData, setBankDate] = useState({});
  const [exchangeData, setExchangeData] = useState({});
  console.log("Hi there");

  useEffect(() => {
    setTimeout(() => {
      setBankDate({
        income: 100,
      });
    }, 3000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setExchangeData({
        returns: 100,
      });
    }, 1000);
  }, []);

  const incomeTax = bankData.income + exchangeData.returns;
  return <div>Hi there, Your income tax returns are {incomeTax}</div>;
}

export default App;
