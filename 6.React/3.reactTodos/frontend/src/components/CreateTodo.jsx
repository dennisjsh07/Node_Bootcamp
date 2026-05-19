import { useState } from "react";

export function CreateTodo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div>
      <input
        type="text"
        placeholder="title"
        style={{
          padding: 10,
          margin: 10,
        }}
        onChange={(e) => setTitle(e.target.value)}
      ></input>
      <br />
      <input
        type="text"
        placeholder="description"
        style={{
          padding: 10,
          margin: 10,
        }}
        onChange={(e) => setDescription(e.target.value)}
      ></input>
      <br />
      <button
        style={{
          padding: 10,
          margin: 10,
        }}
        onClick={() => {
          fetch("http://localhost:3000/create-todo", {
            method: "POST",
            body: JSON.stringify({
              title: title,
              description: description,
              completed: false,
            }),
            headers: {
              "Content-type": "application/json",
            },
          }).then(async function (res) {
            const json = await res.json();
            alert("Todo Added");
          });
        }}
      >
        Add a todo
      </button>
    </div>
  );
}
