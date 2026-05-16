import React, { useState } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([
    {
      title: "wake up",
      description: "wake up at 6",
    },
    {
      title: "start studying",
      description: "start studying at 6:05",
    },
  ]);
  return (
    <div>
      <Button todos={todos} setTodos={setTodos}></Button>
      <Todos title={todos[0].title} description={todos[0].description}></Todos>
      <Todos title={todos[1].title} description={todos[1].description}></Todos>
      {todos.map(function (todo) {
        return (
          <Todos title={todo.title} description={todo.description}></Todos>
        );
      })}
    </div>
  );
}

function Todos(props) {
  return (
    <div>
      <h1>Title: {props.title}</h1>
      <h2>Description: {props.description}</h2>
    </div>
  );
}

function Button(props) {
  function addTodos() {
    props.setTodos([
      ...props.todos,
      {
        title: "Get Ready",
        description: "Get Ready For work 8:00 AM",
      },
    ]);
  }
  return (
    <div>
      <button onClick={addTodos}>Add Todos</button>
    </div>
  );
}

export default App;
