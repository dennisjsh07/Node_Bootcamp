function App() {
  return (
    <div>
      <CardWrapper>Hi Dennis</CardWrapper>
      <CardWrapper>Hello world</CardWrapper>
    </div>
  );
}

function CardWrapper({ children }) {
  return (
    <div style={{ border: "2px solid black", padding: "20px" }}>{children}</div>
  );
}

export default App;
