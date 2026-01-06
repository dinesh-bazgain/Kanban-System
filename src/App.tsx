import "./App.css";
import KanbanBoard from "./components/KanbanBoard";

import { useState, useEffect } from "react";
import {
  fetchTasks,
  createTaskApi,
  updateTaskApi,
  deleteTaskApi,
  isBackendAvailable,
  syncLocalTasksToBackend,
} from "./api";

export type Task = {
  id: string;
  title: string;
};

export type ColumnType = {
  id: string;
  title: string;
  tasks: Task[];
};

function App() {
  const [columns, setColumns] = useState<Record<string, ColumnType>>({
    todo: { id: "todo", title: "To Do", tasks: [] },
    inprogress: { id: "inprogress", title: "In Progress", tasks: [] },
    done: { id: "done", title: "Done", tasks: [] },
  });

  useEffect(() => {
    let mounted = true;
    async function loadAndSync() {
      // Try to sync local tasks if backend is available
      if (await isBackendAvailable()) {
        await syncLocalTasksToBackend();
      }
      fetchTasks()
        .then((tasks) => {
          if (!mounted) return;
          const next: Record<string, ColumnType> = {
            todo: { id: "todo", title: "To Do", tasks: [] },
            inprogress: { id: "inprogress", title: "In Progress", tasks: [] },
            done: { id: "done", title: "Done", tasks: [] },
          };
          tasks.forEach((t) => {
            const task: Task = { id: t.id, title: t.title };
            if (!next[t.columnId])
              next[t.columnId] = {
                id: t.columnId,
                title: t.columnId,
                tasks: [],
              };
            next[t.columnId].tasks.push(task);
          });
          setColumns(next);
        })
        .catch((err) =>
          console.error("Failed to load tasks from backend/localStorage", err)
        );
    }
    loadAndSync();
    // Optionally, listen for backend reconnects and sync again
    const interval = setInterval(loadAndSync, 10000); // every 10s
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const addTask = async (columnId: string, title: string) => {
    try {
      const created = await createTaskApi(title, columnId);
      const t: Task = { id: created.id, title: created.title };
      setColumns((prev) => ({
        ...prev,
        [columnId]: { ...prev[columnId], tasks: [...prev[columnId].tasks, t] },
      }));
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  const editTask = async (columnId: string, taskId: string, title: string) => {
    try {
      await updateTaskApi(taskId, { title });
      setColumns((prev) => ({
        ...prev,
        [columnId]: {
          ...prev[columnId],
          tasks: prev[columnId].tasks.map((t) =>
            t.id === taskId ? { ...t, title } : t
          ),
        },
      }));
    } catch (err) {
      console.error("Edit failed", err);
    }
  };

  const deleteTask = async (columnId: string, taskId: string) => {
    try {
      await deleteTaskApi(taskId);
      setColumns((prev) => ({
        ...prev,
        [columnId]: {
          ...prev[columnId],
          tasks: prev[columnId].tasks.filter((t) => t.id !== taskId),
        },
      }));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const moveTask = (
    fromColumnId: string,
    toColumnId: string,
    taskId: string,
    toIndex?: number
  ) => {
    // update backend then update local state
    updateTaskApi(taskId, { columnId: toColumnId })
      .then(() => {
        setColumns((prev) => {
          const from = prev[fromColumnId];
          const to = prev[toColumnId];
          const task = from.tasks.find((t) => t.id === taskId);
          if (!task) return prev;

          const newFromTasks = from.tasks.filter((t) => t.id !== taskId);
          const newToTasks = [...to.tasks];
          if (typeof toIndex === "number") newToTasks.splice(toIndex, 0, task);
          else newToTasks.push(task);

          return {
            ...prev,
            [fromColumnId]: { ...from, tasks: newFromTasks },
            [toColumnId]: { ...to, tasks: newToTasks },
          };
        });
      })
      .catch((err) => console.error("Move failed", err));
  };

  return (
    <div className="kanban-container">
      <div className="kanban-board">
        <KanbanBoard
          columns={columns}
          addTask={addTask}
          editTask={editTask}
          deleteTask={deleteTask}
          moveTask={moveTask}
        />
      </div>
    </div>
  );
}
export default App;
