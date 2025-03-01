import { useRef, useState, useCallback } from "react"
import { Arrow, Circle, Image, Layer, Line, Rect, Stage, Text, Transformer } from "react-konva";
import { ACTIONS } from "../utility/actions";
import Nav from "./Nav";
import Nav2 from "./Nav2";
import { v4 as uuidv4 } from "uuid";
import { jsPDF } from "jspdf";

export default function Editor(){
    const stageRef = useRef();
    const [shapes, setShapes] = useState({
        rectangles: [],
        circles: [],
        arrows: [],
        scribbles: [],
        texts: [],
        images: [],
    });
    const [action,setAction] = useState(ACTIONS.SELECT);
    const [currId,setCurrId] = useState(null);
    const [fillColor] = useState("#FFFFFF");
    const [strokeColor] = useState("#000000");
    let isPainting = useRef();
    let currentShapeId = useRef();
    let transformerRef = useRef();
    const isDraggable = action === ACTIONS.SELECT;

    
    function importImage(e) {
        if (e.target.files?.[0]) {
            const imageUrl = URL.createObjectURL(e.target.files?.[0]);
            const id = uuidv4().replace(/-/g,'');
            let image = new window.Image();
            image.src = imageUrl;
            image.alt = "{{image_alt}}";
            image.onload = () => {
                setShapes((prevShapes) => ({
                    ...prevShapes,
                    images: [
                      ...prevShapes.images,
                        {
                            id,
                            x: 0,
                            y: 0,
                            width: 250,
                            height: 250,
                            image: image,
                            alt: image.alt,
                        }
                    ],
                }));

            };
            image.src = imageUrl;
        }
    }
    
    function download(){
        const jsonLink = stageRef.current.toJSON();
        const uri = stageRef.current.toDataURL();
        var link  = document.createElement("a");
        var link2  = document.createElement("a");
        link.download = "card.png";
        link2.download = "card.json";
        link.href = uri;
        link2.href = jsonLink;
        document.body.appendChild(link);
        document.body.appendChild(link2);
        // link.click();
        // link2.click();
        document.body.removeChild(link);
        document.body.removeChild(link2);

        var pdf = new jsPDF('l', 'px', [stageRef.current.width(), stageRef.current.height()]);
        pdf.setTextColor('#000000');
        // first add texts
        stageRef.current.find('Text').forEach((text) => {
          const size = text.fontSize() / 0.75; // convert pixels to points
          pdf.setFontSize(size);
          pdf.text(text.text(), text.x(), text.y(), {
            baseline: 'top',
            angle: -text.getAbsoluteRotation(),
          });
        });

        // then put image on top of texts (so texts are not visible)
        pdf.addImage(
          stageRef.current.toDataURL({ pixelRatio: 2 }),
          0,
          0,
          stageRef.current.width(),
          stageRef.current.height()
        );

        pdf.save('canvas.pdf');
        console.log(jsonLink,stageRef.current);
    }


    const handlePointerDown = useCallback(()=>{
        if(action === ACTIONS.SELECT) return;
        const stage= stageRef.current;
        const { x, y } = stage.getPointerPosition();
        const id = uuidv4().replace(/-/g,'');

        currentShapeId.current = id;
        isPainting.current = true;

        switch(action){
            case ACTIONS.RECTANGLE:
                setShapes((prevShapes) => ({
                    ...prevShapes,
                    rectangles: [
                      ...prevShapes.rectangles,
                        {
                            id,
                            x: x,
                            y: y,
                            stroke: strokeColor,
                            strokeWidth: 5,
                            fill: fillColor,
                            width: 20,
                            height: 20,
                        }
                    ],
                }));
            break;
            case ACTIONS.CIRCLE:
                setShapes((prevShapes) => ({
                    ...prevShapes,
                    circles: [
                      ...prevShapes.circles,
                        {
                            id,
                            x: x,
                            y: y,
                            radius: 20,
                            stroke: strokeColor,
                            strokeWidth: 2,
                            fill: fillColor,
                        }
                    ],
                }));
            break;
            case ACTIONS.SCRIBBLE:
                setShapes((prevShapes) => ({
                    ...prevShapes,
                    scribbles: [
                      ...prevShapes.scribbles,
                        {
                            id,
                            points: [x,y],
                            linecap: "round",
                            linejoin: "round",
                            stroke: strokeColor,
                            strokeWidth: 2,
                            fill: fillColor,
                        }
                    ],
                }));
            break;
            case ACTIONS.ARROW:
                setShapes((prevShapes) => ({
                    ...prevShapes,
                    arrows: [
                      ...prevShapes.arrows,
                        {
                            id,
                            points:[x,y,x+20,y+20],
                            stroke: strokeColor,
                            strokeWidth: 2,
                            fill: fillColor,
                        }
                    ],
                }));
            break;
            case ACTIONS.TEXT:
                setShapes((prevShapes) => ({
                    ...prevShapes,
                    texts: [
                      ...prevShapes.texts,
                        {
                            id,
                            x:x,
                            y:y,
                            text: "Hello World",
                            fontSize: 30,
                            fontFamily: "Calibri",
                            fill: "green"
                        }
                    ],
                }));
            break;
        }
    },[action, fillColor, strokeColor])

    const handlePointerMove= useCallback(()=>{
        if(action === ACTIONS.SELECT || !isPainting.current) return;
        const stage = stageRef.current;
        const { x, y } = stage.getPointerPosition();

        switch(action){
            case ACTIONS.RECTANGLE:

                setShapes((prevShapes) => {
                    const rectangles = prevShapes.rectangles.map((rectangle) => {
                      if (rectangle.id === currentShapeId.current) {
                        rectangle.width= x - rectangle.x;
                        rectangle.height= y - rectangle.y;
                      }

                      return rectangle;
                    });
            
                    return { ...prevShapes, rectangles };
                });
            break;
            case ACTIONS.TEXT:

                setShapes((prevShapes) => {
                    const texts = prevShapes.texts.map((text) => {
                      if (text.id === currentShapeId.current) {
                        text.x= x;
                        text.y= y;
                      }

                      return text;
                    });
            
                    return { ...prevShapes, texts };
                });
            break;
            case ACTIONS.CIRCLE:
                setShapes((prevShapes) => {
                    const circles = prevShapes.circles.map((circle) => {
                      if (circle.id === currentShapeId.current) {
                        return {
                            ...circle,
                            radius:((y - circle.y) ** 2 + (x - circle.x) ** 2 ) ** 0.5,
                        }
                      }
                      return circle;
                    });
            
                    return { ...prevShapes, circles };
                });
            break;
            case ACTIONS.SCRIBBLE:
                setShapes((prevShapes) => {
                    const scribbles = prevShapes.scribbles.map((scribble) => {
                      if (scribble.id === currentShapeId.current) {
                        scribble.points= [...scribble.points,x,y];
                      }
                      return scribble;
                    });
            
                    return { ...prevShapes, scribbles };
                });
            break;
            case ACTIONS.ARROW:
                setShapes((prevShapes) => {
                    const arrows = prevShapes.arrows.map((arrow) => {
                      if (arrow.id === currentShapeId.current) {
                        arrow.points= [arrow.points[0],arrow.points[1],x,y];
                      }
                      return arrow;
                    });
            
                    return { ...prevShapes, arrows };
                });
            break;
        }
    },[action])

    
    const handlePointerUp = useCallback(() => {
        isPainting.current = false;
    }, []);

    function handleOnClick(e){
        if(action !== ACTIONS.SELECT) return;
        const target = e.currentTarget;
        setCurrId(target.attrs.id);
        transformerRef.current.nodes([target]);
    }
        console.log('rrr',currentShapeId)


    return(
        <div className="flex">
            <Nav download={download} action={action} setAction={setAction} importImage={importImage}/>
            <div className=" bg-gray-100 w-full flex justify-center items-center">
                <Stage 
                    ref={stageRef}
                    width={600}
                    height={360}
                    onPointerUp={handlePointerUp}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                >
                    <Layer>
                        <Rect
                            x={0}
                            y={0}
                            height={360}
                            width={600}
                            fill={fillColor}
                            id="bg"
                            onClick={()=>transformerRef.current.nodes([])}
                        />

                        {
                            shapes.rectangles.map((rectangle)=>(
                                <Rect
                                    key={ rectangle.id }
                                    { ... rectangle }
                                    draggable={isDraggable}
                                    onClick={(e)=>handleOnClick(e)}
                                />
                            ))
                        }
                        
                        {
                            shapes.circles.map((circle)=>(
                                <Circle
                                    key={circle.id}
                                    { ...circle }
                                    draggable={isDraggable}
                                    onClick={(e)=>handleOnClick(e)}
                                />
                            ))
                        }

                        {
                            shapes.arrows.map((arrow)=>(
                                <Arrow
                                    key={arrow.id}
                                    { ...arrow }
                                    draggable={isDraggable}
                                    onClick={(e)=>handleOnClick(e)}
                                />
                            ))
                        }

                        {
                            shapes.scribbles.map((scribble)=>(
                                <Line
                                    key={scribble.id}
                                    { ...scribble }
                                    draggable={isDraggable}
                                    onClick={(e)=>handleOnClick(e)}
                                />
                            ))
                        }

                        {
                            shapes.images.map((image)=>(
                                <Image
                                    key={image.id}
                                    { ...image }
                                    draggable={isDraggable}
                                    onClick={(e)=>handleOnClick(e)}
                                />
                            ))
                        }

                        {
                            shapes.texts.map((text,i)=>(
                                <Text
                                    key={i}
                                    x= {text.x}
                                    y= {text.y}
                                    text= {text.text}
                                    fontSize= {text.fontSize}
                                    fontFamily= {text.fontFamily}
                                    fill= {text.fill}
                                    draggable={isDraggable}
                                    onClick={(e)=>handleOnClick(e)}
                                    align="center"
                                />
                            ))
                        }


                        <Transformer ref={transformerRef} />
                    </Layer>
                </Stage>
            </div>
            <Nav2 shapes={shapes} id={currId} setShapes={setShapes} />
        </div>

    )
}