"use client";

import { useEffect, useState } from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  completedAt: string | null;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  async function loadTasks() {
    const res = await fetch(`${apiBase}/api/task`, { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      setTasks(data.tasks || data);
    }
  }

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${apiBase}/api/task`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
      credentials: "include",
    });
    if (res.ok) {
      setTitle("");
      setDescription("");
      loadTasks();
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <main className="p-4 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Task Dashboard</h1>
      <form onSubmit={createTask} className="space-y-2">
        <input
          className="border p-2 w-full"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="border p-2 w-full"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Task
        </button>
      </form>
      <ul className="space-y-2">
        {tasks.map((t) => (
          <li key={t.id} className="border p-2 rounded flex justify-between">
            <span>
              <strong>{t.title}</strong>
              {t.description && <p className="text-sm">{t.description}</p>}
            </span>
            {t.completedAt && <span className="text-green-600">Done</span>}
          </li>
        ))}
      </ul>
    </main>
  );
}
