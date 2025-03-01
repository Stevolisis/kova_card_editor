import { useEffect, useState } from "react"

export default function Nav2({shapes, id, setShapes}){
    const [rectProperty, setRectProperty] = useState({
        x: 0,
        y: 0,
        stroke: "",
        strokeWidth: 0,
        fill: "",
        width: 0,
        height: 0,
    })

    useEffect(()=>{
        if(shapes && id){
            console.log("id ",id)

            shapes.rectangles.map(rect=>{
                if(rect.id === id){
                    setRectProperty(rect);
                }
            });
        }
    },[shapes,id]);
    console.log(rectProperty);

    useEffect(()=>{
        if(shapes && id){
            console.log("id ",id)

            setShapes((prevShapes) => {
                const rectangles = prevShapes.rectangles.map((rectangle) => {
                  if (rectangle.id === id) {
                    rectangle= rectProperty;
                  }

                  return rectangle;
                });
        
                return { ...prevShapes, rectangles };
            });
        }
    },[rectProperty]);

    return (
        <nav className="p-3 bg-[#961233] h-[85vh]">
            <div className="mb-5">
                <h2 className="text-white text-lg font-bold">Object- 3456</h2>
            </div>
            <div>
                <div className="flex justify-center items-center gap-2 my-4">
                    <div className="flex items-center">
                        <h3 className="ml-2 text-base font-semibold text-black absolute">X</h3>
                        <input className="pl-6 rounded-lg border border-gray-300 w-[80px]" value={rectProperty.x} onChange={(e)=>setRectProperty({ ...rectProperty, x:e.target.value})} type="number" name="X" />
                    </div>
                    <div className="flex items-center">
                        <h3 className="ml-2 text-base font-semibold text-black absolute">Y</h3>
                        <input className="pl-6 rounded-lg border border-gray-300 w-[80px]" value={rectProperty.y} onChange={(e)=>setRectProperty({ ...rectProperty, y:e.target.value})}  type="number" name="X" />
                    </div>
                </div>

                <div className="flex justify-center items-center gap-2 my-4">
                    <div className="flex items-center">
                        <h3 className="ml-2 text-base font-semibold text-black absolute">W</h3>
                        <input className="pl-6 rounded-lg border border-gray-300 w-[80px]" value={rectProperty.width} onChange={(e)=>setRectProperty({ ...rectProperty, width:e.target.value})} type="number" name="X" />
                    </div>
                    <div className="flex items-center">
                        <h3 className="ml-2 text-base font-semibold text-black absolute">H</h3>
                        <input className="pl-6 rounded-lg border border-gray-300 w-[80px]" value={rectProperty.height} onChange={(e)=>setRectProperty({ ...rectProperty, height:e.target.value})}  type="number" name="X" />
                    </div>
                </div>
                
            </div>
        </nav>
    )
}
