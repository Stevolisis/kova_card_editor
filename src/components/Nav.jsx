import { IoIosCheckboxOutline, IoIosHappy, IoIosText, IoMdAdd, IoMdArrowUp, IoMdDownload, IoMdImage, IoMdImages } from "react-icons/io";
import { ACTIONS } from "../utility/actions";

export default function Nav({action,setAction,download,importImage,putText}){

    return(
        <nav className="bg-[#961233] h-[85vh] w-[29vw] flex justify-center overflow-y-auto">
            <div className="">
                <button onClick={()=>setAction(ACTIONS.SELECT)} 
                className={`justify-center text-[#961233] m-5 flex items-center bg-[#FFBABF] w-[130px] h-[60px] p-5 rounded-md ${action === ACTIONS.SELECT && "shadow-lg"} shadow-red-400`}>
                    <IoMdAdd className=""/> 
                    <p className="text-sm ">SELECT</p>
                </button>
                <button onClick={()=>setAction(ACTIONS.RECTANGLE)} 
                className={`justify-center text-[#961233] m-5 flex items-center bg-[#FFBABF] w-[130px] h-[60px] p-5 rounded-md ${action === ACTIONS.RECTANGLE && "shadow-lg"} shadow-red-400`}>
                    <IoMdImages className=""/> 
                    <p className="text-sm ">RECTANGLE</p>
                </button>
                <button onClick={()=>setAction(ACTIONS.CIRCLE)} 
                className={`justify-center text-[#961233] m-5 flex items-center bg-[#FFBABF] w-[130px] h-[60px] p-5 rounded-md ${action === ACTIONS.CIRCLE && "shadow-lg"} shadow-red-400`}>
                    <IoIosHappy className=""/> 
                    <p className="text-sm ">CIRCLE</p>
                </button>
                <button onClick={()=>setAction(ACTIONS.SCRIBBLE)} 
                className={`justify-center text-[#961233] m-5 flex items-center bg-[#FFBABF] w-[130px] h-[60px] p-5 rounded-md ${action === ACTIONS.SCRIBBLE && "shadow-lg"} shadow-red-400`}>
                    <IoIosCheckboxOutline className=""/> 
                    <p className="text-sm ">SCRIBBLE</p>
                </button>
                <button onClick={()=>setAction(ACTIONS.ARROW)} 
                className={`justify-center text-[#961233] m-5 flex items-center bg-[#FFBABF] w-[130px] h-[60px] p-5 rounded-md ${action === ACTIONS.ARROW && "shadow-lg"} shadow-red-400`}>
                    <IoMdArrowUp className=""/> 
                    <p className="text-sm ">ARROW</p>
                </button>
                <button onClick={()=>setAction(ACTIONS.IMAGE)} 
                className={`justify-center text-[#961233] m-5 flex items-center bg-[#FFBABF] w-[130px] h-[60px] p-5 rounded-md ${action === ACTIONS.IMAGE && "shadow-lg"} shadow-red-400`}>
                    <IoMdImage className=""/> 
                    <input className="text-sm " placeholder="Image" type='file' onChange={(e)=>importImage(e)}/>
                </button>
                <button onClick={()=>putText()} 
                className={`justify-center text-[#961233] m-5 flex items-center bg-[#FFBABF] w-[130px] h-[60px] p-5 rounded-md ${action === ACTIONS.ARROW && "shadow-lg"} shadow-red-400`}>
                    <IoIosText className=""/> 
                    <p className="text-sm ">TEXT</p>
                </button>
                <button onClick={()=>download()} 
                className={`justify-center text-[#961233] m-5 flex items-center bg-orange-400 w-[130px] h-[60px] p-5 rounded-md shadow-sm shadow-red-400`}>
                    <IoMdDownload className=""/> 
                    <p className="text-sm ">DOWNLOAD</p>
                </button>
            </div>
            <div>
                
            </div>
        </nav>
    )
}