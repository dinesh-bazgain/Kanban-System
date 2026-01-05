import React, { useState } from "react";
import Tasks from "./Tasks";
import type { ColumnType } from "../App";

type Props = {
  column: ColumnType;
  addTask: (columnId: string, title: string) => void;
  editTask: (columnId: string, taskId: string, title: string) => void;
  deleteTask: (columnId: string, taskId: string) => void;
  moveTask: (
    fromColumnId: string,
    toColumnId: string,
    taskId: string,
    toIndex?: number
  ) => void;
};

const Column: React.FC<Props> = ({
  column,
  addTask,
  editTask,
  deleteTask,
  moveTask,
}) => {
  const [newTitle, setNewTitle] = useState("");

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      const { taskId, fromColumnId } = data;
      if (taskId && fromColumnId) moveTask(fromColumnId, column.id, taskId);
    } catch (err) {
      // ignore
    }
  };

  return (
    <div className="column-wrapper">
      <div className="column-header-box">
        <h3 className="column-header-title">{column.title.toUpperCase()}</h3>
        <span className="column-task-count">{column.tasks.length}</span>
      </div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="column"
      >
        <div className="column-content">
          {column.tasks.map((task) => (
            <Tasks
              key={task.id}
              task={task}
              columnId={column.id}
              editTask={editTask}
              deleteTask={deleteTask}
            />
          ))}
        </div>

        <div className="column-footer">
          <input
            placeholder="New task"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter" && newTitle.trim()) {
                addTask(column.id, newTitle.trim());
                setNewTitle("");
              }
            }}
          />
          <button
            className="add-btn"
            onClick={() => {
              if (!newTitle.trim()) return;
              addTask(column.id, newTitle.trim());
              setNewTitle("");
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Column;
