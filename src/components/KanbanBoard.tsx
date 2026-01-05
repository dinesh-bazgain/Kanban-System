import React from "react";
import Column from "./Column";
import type { ColumnType } from "../App";

type Props = {
  columns: Record<string, ColumnType>;
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

const KanbanBoard: React.FC<Props> = ({
  columns,
  addTask,
  editTask,
  deleteTask,
  moveTask,
}) => {
  return (
    <>
      {Object.values(columns).map((col) => (
        <Column
          key={col.id}
          column={col}
          addTask={addTask}
          editTask={editTask}
          deleteTask={deleteTask}
          moveTask={moveTask}
        />
      ))}
    </>
  );
};

export default KanbanBoard;
