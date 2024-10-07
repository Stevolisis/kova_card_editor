import { useState, useRef, useCallback } from "react";
import { Stage, Layer, Rect, Circle, Arrow, Line } from "react-konva";
import Konva from "konva"; 
import Nav from "./Nav"; 

function Editor() {
  const stageRef = useRef(null);
  const [shapes, setShapes] = useState({
    rectangles: [],
    circles: [],
    arrows: [],
    scribbles: [],
    texts: [],
    images: [],
  });

  const [action, setAction] = useState(""); // Current action
  const [isPainting, setIsPainting] = useState(false);
  const [currentShapeId, setCurrentShapeId] = useState(null);

  const createShape = (type, attrs) => ({
    id: Konva.Util.getRandomColor(), // Random color as ID, replace if needed
    type,
    ...attrs,
  });

  // Handle pointer down to create new shapes or start scribbling
  const handlePointerDown = useCallback(
    (e) => {
      const stage = e.target.getStage();
      const { x, y } = stage.getPointerPosition();

      if (action === "scribble") {
        setIsPainting(true);
        setShapes((prevShapes) => ({
          ...prevShapes,
          scribbles: [
            ...prevShapes.scribbles,
            { id: Konva.Util.getRandomColor(), points: [x, y] },
          ],
        }));
      } else {
        setCurrentShapeId(Konva.Util.getRandomColor());

        const newShape = createShape(action, { x, y, width: 50, height: 50 });
        setShapes((prevShapes) => ({
          ...prevShapes,
          [action]: [...prevShapes[action], newShape],
        }));
      }
    },
    [action]
  );

  // Handle pointer move when drawing scribbles
  const handlePointerMove = useCallback(
    (e) => {
      if (!isPainting) return;

      const stage = stageRef.current.getStage();
      const { x, y } = stage.getPointerPosition();

      setShapes((prevShapes) => {
        const scribbles = prevShapes.scribbles.map((scribble) => {
          if (scribble.id === currentShapeId) {
            scribble.points = scribble.points.concat([x, y]);
          }
          return scribble;
        });

        return { ...prevShapes, scribbles };
      });
    },
    [isPainting, currentShapeId]
  );

  // Handle pointer up to stop drawing scribbles
  const handlePointerUp = useCallback(() => {
    setIsPainting(false);
  }, []);

  // Update shape position on drag
  const handleDragMove = (id, e) => {
    const { x, y } = e.target.position();

    setShapes((prevShapes) => {
      const updatedShapes = { ...prevShapes };
      Object.keys(updatedShapes).forEach((key) => {
        updatedShapes[key] = updatedShapes[key].map((shape) =>
          shape.id === id ? { ...shape, x, y } : shape
        );
      });

      return updatedShapes;
    });
  };

  return (
    <div>
      <Nav 
        onSave={() => {/* Implement save logic */}} 
        onLoad={() => {/* Implement load logic */}} 
        onDownload={() => {/* Implement download logic */}} 
        onActionChange={setAction} 
        onImportImage={() => {/* Implement image import logic */}} 
      />
      <Stage
        width={window.innerWidth}
        height={window.innerHeight}
        ref={stageRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <Layer>
          {/* Render rectangles */}
          {shapes.rectangles.map((rect) => (
            <Rect
              key={rect.id}
              {...rect}
              draggable
              onDragMove={(e) => handleDragMove(rect.id, e)}
            />
          ))}

          {/* Render circles */}
          {shapes.circles.map((circle) => (
            <Circle
              key={circle.id}
              {...circle}
              draggable
              onDragMove={(e) => handleDragMove(circle.id, e)}
            />
          ))}

          {/* Render arrows */}
          {shapes.arrows.map((arrow) => (
            <Arrow
              key={arrow.id}
              {...arrow}
              draggable
              onDragMove={(e) => handleDragMove(arrow.id, e)}
            />
          ))}

          {/* Render scribbles */}
          {shapes.scribbles.map((line) => (
            <Line key={line.id} points={line.points} stroke="black" strokeWidth={3} />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

export default Editor;
