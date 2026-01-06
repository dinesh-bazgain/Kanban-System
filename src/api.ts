const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

const LOCAL_STORAGE_KEY = "kanban_tasks";

// Check if backend is reachable
export async function isBackendAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/tasks`, { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}

function getLocalTasks(): ApiTask[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setLocalTasks(tasks: ApiTask[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
}

export type ApiTask = { id: string; title: string; columnId: string };

export async function fetchTasks(): Promise<ApiTask[]> {
  if (await isBackendAvailable()) {
    const res = await fetch(`${API_BASE}/tasks`);
    if (!res.ok) throw new Error("Failed to fetch tasks");
    const tasks = await res.json();
    setLocalTasks(tasks); // keep localStorage in sync
    return tasks;
  } else {
    return getLocalTasks();
  }
}

export async function createTaskApi(
  title: string,
  columnId: string
): Promise<ApiTask> {
  if (await isBackendAvailable()) {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, columnId }),
    });
    if (!res.ok) throw new Error("Failed to create task");
    const task = await res.json();
    // Sync to localStorage
    const local = getLocalTasks();
    setLocalTasks([...local, task]);
    return task;
  } else {
    // Fallback: create local task
    const id = `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const task = { id, title, columnId };
    const local = getLocalTasks();
    setLocalTasks([...local, task]);
    return task;
  }
}

export async function updateTaskApi(
  id: string,
  patch: Partial<{ title: string; columnId: string }>
) {
  if (await isBackendAvailable()) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) throw new Error("Failed to update task");
    const updated = await res.json();
    // Sync to localStorage
    const local = getLocalTasks().map((t) =>
      t.id === id ? { ...t, ...patch } : t
    );
    setLocalTasks(local);
    return updated;
  } else {
    // Fallback: update local task
    const local = getLocalTasks().map((t) =>
      t.id === id ? { ...t, ...patch } : t
    );
    setLocalTasks(local);
    return local.find((t) => t.id === id);
  }
}

export async function deleteTaskApi(id: string) {
  if (await isBackendAvailable()) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete task");
    // Remove from localStorage
    const local = getLocalTasks().filter((t) => t.id !== id);
    setLocalTasks(local);
    return res.json();
  } else {
    // Fallback: delete from local
    const local = getLocalTasks().filter((t) => t.id !== id);
    setLocalTasks(local);
    return { id };
  }
}

// Sync localStorage tasks to backend when online
export async function syncLocalTasksToBackend() {
  if (await isBackendAvailable()) {
    const local = getLocalTasks();
    for (const t of local) {
      if (t.id.startsWith("local-")) {
        // Only sync tasks created locally
        await fetch(`${API_BASE}/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: t.title, columnId: t.columnId }),
        });
      }
    }
    // After syncing, clear localStorage
    setLocalTasks([]);
  }
}
