import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

interface LetterDragDropProps {
  letters: string[];
  onDragStart: () => void;
  onDragEnd: (result: DropResult) => void;
}

const LetterDragDrop: React.FC<LetterDragDropProps> = ({
  letters,
  onDragStart,
  onDragEnd,
}) => (
  <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
    <Droppable droppableId="letters" direction="horizontal">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="flex justify-center flex-wrap gap-3 mb-6 px-4"
        >
          {letters.map((letter, index) => (
            <Draggable
              key={`${letter}-${index}`}
              draggableId={`${letter}-${index}`}
              index={index}
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={{
                    ...provided.draggableProps.style,
                    userSelect: "none",
                    width: "clamp(30px, 8vw, 60px)",
                    height: "clamp(30px, 8vw, 60px)",
                  }}
                  className={`flex items-center justify-center rounded-md cursor-grab font-bold text-center
                    transition duration-300
                    ${
                      snapshot.isDragging
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-blue-100 text-gray-900 shadow-sm"
                    }`}
                  aria-label={`Letter ${letter}`}
                  role="button"
                  tabIndex={0}
                >
                  <span className="select-none text-[clamp(14px,3vw,24px)] px-[clamp(6px,1.5vw,15px)] py-[clamp(4px,1vw,10px)]">
                    {letter}
                  </span>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>
);

export default LetterDragDrop;
