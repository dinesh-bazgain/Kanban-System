import React, { useState } from "react";
import type { Task } from "../App";

type Props = {
  task: Task;
  columnId: string;
  editTask: (columnId: string, taskId: string, title: string) => void;
  deleteTask: (columnId: string, taskId: string) => void;
};

const Tasks: React.FC<Props> = ({ task, columnId, editTask, deleteTask }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.title);

  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({ taskId: task.id, fromColumnId: columnId })
    );
  };

  return (
    <div draggable onDragStart={onDragStart} className="task-card">
      {!editing ? (
        <div className="task-content">
          <div className="task-title">{task.title}</div>
          <span className="task-id">#{task.id.substring(0, 8)}</span>
        </div>
      ) : (
        <input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="task-input"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              editTask(columnId, task.id, value.trim() || task.title);
              setEditing(false);
            }
          }}
        />
      )}

      <div className="task-actions">
        {!editing ? (
          <>
            <button className="task-btn" onClick={() => setEditing(true)}>
              Edit
            </button>
            <button
              className="task-btn delete"
              onClick={() => deleteTask(columnId, task.id)}
            >
              Delete
            </button>
          </>
        ) : (
          <>
            <button
              className="task-btn save"
              onClick={() => {
                editTask(columnId, task.id, value.trim() || task.title);
                setEditing(false);
              }}
            >
              Save
            </button>
            <button
              className="task-btn"
              onClick={() => {
                setValue(task.title);
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Tasks;
