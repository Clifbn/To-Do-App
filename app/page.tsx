"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css"

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    async function loadTodos() {
      const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=10");
      const data: Todo[] = await res.json();
      setTodos(data);
    }

    loadTodos();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;

    const title = value;
    setValue("");

    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, completed: false }),
      });

      const created: Todo = await res.json();
      setTodos([created, ...todos]);
    } catch (err) {
      const localTodo: Todo = {
        id: Date.now(),
        title,
        completed: false,
      };
      setTodos([localTodo, ...todos]);
    }
  }

  async function handleDelete(id: number) {
    const previous = todos;
    setTodos(todos.filter((t) => t.id !== id));

    try {
      await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: "DELETE",
      });
    } catch (err) {
      setTodos(previous);
    }
  }


  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>To Do app</h1>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            className={styles.input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write a to do"
          />
          <button className={styles.addButton} type="submit">
            Add
          </button>
        </form>

        <ul className={styles.list}>
          {todos.map((todo) => (
            <li key={todo.id} className={styles.item}>
              <span
                className={`${styles.text} ${todo.completed ? styles.completed : ""
                  }`}
                onClick={() =>
                  setTodos(
                    todos.map((t) =>
                      t.id === todo.id
                        ? { ...t, completed: !t.completed }
                        : t
                    )
                  )
                }
              >
                {todo.title}
              </span>

              <button
                className={styles.delete}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(todo.id);
                }}
              >
                Delete
              </button>
            </li>
          ))}

        </ul>
      </div>
      <p className={styles.footer}>github repo: https://github.com/Clifbn/To-Do-App</p>
    </main>
    
  );


}


