import { useRef, useState } from "react"
import { Arrow, Circle, Image, Layer, Line, Rect, Stage, Text, Transformer } from "react-konva";
import { ACTIONS } from "../utility/actions";
import Nav from "./Nav";
import { v4 as uuidv4 } from "uuid";
import { reucard } from "../../card";
import { useEffect } from "react";
import { jsPDF } from "jspdf";

export default function Editor(){
    const stageRef = useRef();
    const [action,setAction] = useState(ACTIONS.SELECT);
    const [fillColor] = useState("#FFFFFF");
    const [strokeColor] = useState("#000000");
    const [rectangles,setRectangles] = useState([]);
    const [circles,setCircles] = useState([]);
    const [arrows,setArrows] = useState([]);
    const [scribbles,setScribbles] = useState([]);
    const [texts,setTexts] = useState([]);
    const [images,setImages] = useState([]);
    let isPainting = useRef();
    let currentShapeId = useRef();
    let transformerRef = useRef();
    let actionText = useRef();
    const isDraggable = action === ACTIONS.SELECT;
    // console.log(action,isPainting.current);
    console.log("reucard",texts);

    function loadFromJSON() {
        const stage = stageRef.current;
        const newRectangles = [];
        const newCircles = [];
        const newArrows = [];
        const newScribbles = [];

        reucard && reucard.children.forEach(layer => {
            layer.children.forEach(shape => {
                switch (shape.className) {
                    case "Rect":
                        newRectangles.push({
                            id: shape.attrs.id,
                            x: shape.attrs.x,
                            y: shape.attrs.y,
                            width: shape.attrs.width,
                            height: shape.attrs.height,
                            fillColor: shape.attrs.fill
                        });
                        break;
                    case "Circle":
                        newCircles.push({
                            id: shape.attrs.id,
                            x: shape.attrs.x,
                            y: shape.attrs.y,
                            radius: shape.attrs.radius,
                            fillColor: shape.attrs.fill
                        });
                        break;
                    case "Arrow":
                        newArrows.push({
                            id: shape.attrs.id,
                            points: shape.attrs.points,
                            fillColor: shape.attrs.fill
                        });
                        break;
                    case "Line":
                        newScribbles.push({
                            id: shape.attrs.id,
                            points: shape.attrs.points,
                            fillColor: shape.attrs.fill
                        });
                        break;
                    default:
                        break;
                }
            });
        });

        setRectangles(newRectangles);
        setCircles(newCircles);
        setArrows(newArrows);
        setScribbles(newScribbles);
    }
    
    useEffect(()=>{
        loadFromJSON();
    },[]);

    function importImage(e) {
        if (e.target.files?.[0]) {
            const imageUrl = URL.createObjectURL(e.target.files?.[0]);
            console.log("reucardtyt",imageUrl);
            let image = new window.Image();
            image.src = imageUrl;
            image.alt = "{{image_alt}}";
            image.onload = () => {
                setImages(images => [
                    ...images,
                    {
                        id: uuidv4(),
                        image: image,
                        x: 0, // Set initial x position
                        y: 0, // Set initial y position
                        width: 250,
                        height: 250,
                        alt: image.alt
                    }
                ]);
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


    function putText(){
        setAction(ACTIONS.TEXTS)
        actionText.current = ACTIONS.TEXTS;
        if(actionText.current === ACTIONS.TEXTS){
            const id = uuidv4();
            
            setTexts((texts)=>[...texts,{
                id,
                x:0,
                y:0,
                text: "Hello World1",
                fontSize: 30,
                fontFamily: "Calibri",
                fill: "green"
            }]);
        } 
        return;

    }

    function handlePointerDown(){
        if(action === ACTIONS.SELECT) return;
        const stage= stageRef.current;
        const { x, y } = stage.getPointerPosition();
        const id = uuidv4();
        currentShapeId.current = id;
        isPainting.current = true;

        switch(action){
            case ACTIONS.RECTANGLE:
                setRectangles((rectangles)=>[...rectangles,{
                    id,
                    x,
                    y,
                    height:20,
                    width:20,
                    fillColor
                }]);
            break;
            case ACTIONS.CIRCLE:
                setCircles((circles)=>[...circles,{
                    id,
                    x,
                    y,
                    radius:20,
                    fillColor
                }]);
            break;
            case ACTIONS.SCRIBBLE:
                setScribbles((scribbles)=>[...scribbles,{
                    id,
                    points:[x,y],
                    fillColor
                }]);
            break;
            case ACTIONS.ARROW:
                setArrows((arrows)=>[...arrows,{
                    id,
                    points:[x,y,x+20,y+20],
                    fillColor
                }]);
            break;
            // case ACTIONS.TEXTS:
            //     console.log("opo");
            //     setTexts((texts)=>[...texts,{
            //         id,
            //         x,
            //         y,
            //         text: "Hello World1",
            //         fontSize: 30,
            //         fontFamily: "Calibri",
            //         fill: "green"
            //     }]);
            //     console.log("oport");
            // break;
        }
    }

    function handlePointerMove(){
        if(action === ACTIONS.SELECT || !isPainting.current) return;
        const stage = stageRef.current;
        const { x, y } = stage.getPointerPosition();

        switch(action){
            case ACTIONS.RECTANGLE:
                setRectangles((rectangles)=> rectangles.map(rectangle=>{
                    if(rectangle.id === currentShapeId.current){
                        return {
                            ...rectangle,
                            width: x - rectangle.x,
                            height: y - rectangle.y 
                        }
                    }
                    return rectangle;
                }));
            break;
            // case ACTIONS.TEXTS:
            //     setTexts((texts)=> texts.map(text=>{
            //         if(text.id === currentShapeId.current){
            //             return {
            //                 ...text,
            //                 width: x - text.x,
            //                 height: y - text.y 
            //             }
            //         }
            //         return text;
            //     }));
            // break;
            case ACTIONS.CIRCLE:
                setCircles((circles)=> circles.map(circle=>{
                    if(circle.id === currentShapeId.current){
                        return {
                            ...circle,
                            radius:((y - circle.y) ** 2 + (x - circle.x) ** 2 ) ** 0.5,
                        }
                    }
                    return circle;
                }));
            break;
            case ACTIONS.SCRIBBLE:
                setScribbles((scribbles)=> scribbles.map(scribble=>{
                    if(scribble.id === currentShapeId.current){
                        return {
                            ...scribble,
                            points:[...scribble.points,x,y],
                        }
                    }
                    return scribble;
                }));
            break;
            case ACTIONS.ARROW:
                setArrows((arrows)=> arrows.map(arrow=>{
                    if(arrow.id === currentShapeId.current){
                        return {
                            ...arrow,
                            points:[arrow.points[0],arrow.points[1],x,y],
                        }
                    }
                    return arrow;
                }));
            break;
        }
    }

    
    function handlePointerUp(){
        isPainting.current = false;
    }

    function handleOnClick(e){
        if(action !== ACTIONS.SELECT) return;
        const target = e.currentTarget;
        transformerRef.current.nodes([target]);
    }


    return(
        <div className="flex">
            <Nav download={download} putText={putText} action={action} setAction={setAction} importImage={importImage}/>
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
                            rectangles.map((rectangle,i)=>(
                                <Rect
                                    key={i}
                                    x={rectangle.x}
                                    y={rectangle.y}
                                    stroke={strokeColor}
                                    strokeWidth={5}
                                    fill='dodgerblue'
                                    width={rectangle.width}
                                    height={rectangle.height}
                                    draggable={isDraggable}
                                    onClick={(e)=>handleOnClick(e)}
                                />
                            ))
                        }
                        
                        {
                            circles.map((circle,i)=>(
                                <Circle
                                    key={i}
                                    x={circle.x}
                                    y={circle.y}
                                    radius={circle.radius}
                                    stroke={strokeColor}
                                    strokeWidth={2}
                                    fill={circle.fillColor}
                                    draggable={isDraggable}
                                    onClick={(e)=>handleOnClick(e)}
                                />
                            ))
                        }

                        {
                            arrows.map((arrow,i)=>(
                                <Arrow
                                    key={i}
                                    points={arrow.points}
                                    stroke={strokeColor}
                                    strokeWidth={2}
                                    fill={arrow.fillColor}
                                    draggable={isDraggable}
                                    onClick={(e)=>handleOnClick(e)}
                                />
                            ))
                        }

                        {
                            scribbles.map((scribble,i)=>(
                                <Line
                                    key={i}
                                    points={scribble.points}
                                    linecap="round"
                                    linejoin="round"
                                    stroke={strokeColor}
                                    strokeWidth={2}
                                    fill={scribble.fillColor}
                                    draggable={isDraggable}
                                    onClick={(e)=>handleOnClick(e)}
                                />
                            ))
                        }

                        {
                            images.map((image,i)=>(
                                <Image
                                    key={i}
                                    x={image.x}
                                    y={image.y}
                                    image={image.image}
                                    draggable={isDraggable}
                                    width={image.width}
                                    height={image.height}
                                    onClick={(e)=>handleOnClick(e)}
                                />
                            ))
                        }

                        {
                            texts.map((text,i)=>(
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
                                />
                            ))
                        }


                        <Transformer ref={transformerRef} />
                    </Layer>
                </Stage>
            </div>
        </div>

    )
}