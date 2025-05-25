import React, { useEffect, useState } from "react";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/todos")
      .then((res) => res.json())
      .then(setTodos)
      .catch((err) => console.error("Failed to fetch todos:", err));
  }, []);

  const handleAddOrUpdate = async () => {
    if (!input.trim()) return;

    if (editIndex !== null) {
      const updatedTodos = [...todos];
      const updatedTodo = { ...updatedTodos[editIndex], text: input };

      try {
        const res = await fetch(`http://localhost:5000/todos/${updatedTodo.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTodo),
        });

        if (!res.ok) throw new Error("Failed to update todo");

        updatedTodos[editIndex] = updatedTodo;
        setTodos(updatedTodos);
        setEditIndex(null);
        setInput("");
      } catch (err) {
        console.error("Update error:", err);
      }
    } else {
      try {
        const res = await fetch("http://localhost:5000/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: input }),
        });

        if (!res.ok) throw new Error("Failed to add todo");

        const newTodo = await res.json();

        if (newTodo && newTodo.id && newTodo.text) {
          setTodos((prev) => [...prev, newTodo]);
        }

        setInput("");
      } catch (err) {
        console.error("Add error:", err);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/todos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete todo");

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (index) => {
    setInput(todos[index].text);
    setEditIndex(index);
  };

  const handleSendToSlack = async () => {
    try {
      const res = await fetch("http://localhost:5000/summarize", {
        method: "POST",
      });
      const data = await res.json();
      setMessage(data.success ? "✅ Summary sent to Slack!" : "❌ Failed to send.");
    } catch (err) {
      console.error("Slack error:", err);
      setMessage("❌ Error sending to Slack.");
    }

    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">To-Do List</h2>

      <div className="flex mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a to-do..."
          className="flex-1 border px-2 py-1 rounded"
        />
        <button
          onClick={handleAddOrUpdate}
          className="ml-2 px-4 py-1 bg-blue-500 text-white rounded"
        >
          {editIndex !== null ? "Update" : "Add"}
        </button>
      </div>

      <ul className="mb-4">
        {todos.map((todo, index) => (
          <li key={todo.id} className="flex justify-between items-center mb-2">
            <span>{todo.text}</span>
            <div>
              <button onClick={() => handleEdit(index)} className="text-yellow-500 mr-2">
                Edit
              </button>
              <button onClick={() => handleDelete(todo.id)} className="text-red-500">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSendToSlack}
        className="w-full bg-green-600 text-white py-2 rounded"
      >
        Send Summary to Slack
      </button>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default TodoApp;
