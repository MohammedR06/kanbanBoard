import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";

export default function KanbanBoard() {
  const [completed, setCompleted] = useState([]);
  const [incomplete, setIncomplete] = useState([]);
  const [inprogress, setInprogress] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((response) => response.json())
      .then((json) => {
        setCompleted(json.filter((task) => task.completed));
        setIncomplete(json.filter((task) => !task.completed));
        setInprogress(json.filter((task) => task.inprogress));
      });
  }, []);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (source.droppableId == destination.droppableId) return;

    //REMOVE FROM SOURCE ARRAY

    if (source.droppableId == 2) {
      setCompleted(removeItemById(draggableId, completed));
    } else {
      setInprogress(removeItemById(draggableId, inprogress));
      setIncomplete(removeItemById(draggableId, incomplete));
    }

    // GET ITEM

    const task = findItemById(draggableId, [
      ...incomplete,
      ...completed,
      ...inprogress,
    ]);

    //ADD ITEM
    if (destination.droppableId == 2) {
      setCompleted([{ ...task, completed: !task.completed }, ...completed]);
    } else {
      setIncomplete([{ ...task, completed: !task.completed }, ...incomplete]);
    }
    setInprogress([{ ...task, inprogress: task.inprogress }, ...inprogress]);
  };

  function findItemById(id, array) {
    return array.find((item) => item.id == id);
  }

  function removeItemById(id, array) {
    return array.filter((item) => item.id != id);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <h2 style={{ textAlign: "center" }}>PROGRESS BOARD</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Column title={"TODO"} tasks={incomplete} id={"1"} />
        <Column title={"DONE"} tasks={completed} id={"2"} />
        <Column title={"BACKLOG"} tasks={inprogress} id={"3"} />
      </div>
    </DragDropContext>
  );
}
