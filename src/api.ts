const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export type ApiTask = { id: string; title: string; columnId: string };

export async function fetchTasks(): Promise<ApiTask[]> {
  const res = await fetch(`${API_BASE}/tasks`);
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

export async function createTaskApi(
  title: string,
  columnId: string
): Promise<ApiTask> {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, columnId }),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}

export async function updateTaskApi(
  id: string,
  patch: Partial<{ title: string; columnId: string }>
) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}

export async function deleteTaskApi(id: string) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete task");
  return res.json();
}
