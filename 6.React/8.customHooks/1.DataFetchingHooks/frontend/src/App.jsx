import { useEffect, useState } from "react";
import axios from "axios";

// data fetching hook
function useTodos(n) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const value = setInterval(() => {
      axios.get("http://localhost:3000/todos").then((res) => {
        setTodos(res.data.data);
        setLoading(false);
      });
    }, n * 1000);

    axios.get("http://localhost:3000/todos").then((res) => {
      setTodos(res.data.data);
      setLoading(false);
    });

    return () => {
      clearInterval(value);
    };
  }, [n]);

  return { todos, loading };
}

function App() {
  const { todos, loading } = useTodos(5);

  if (loading) {
    return "Loading...";
  }
  return (
    <div>
      {todos.map((todo) => {
        return <Todos key={todo._id} todo={todo}></Todos>;
      })}
    </div>
  );
}

function Todos({ todo }) {
  return (
    <div>
      <h1>{todo.title}</h1>
      <h3>{todo.description}</h3>
    </div>
  );
}

export default App;
