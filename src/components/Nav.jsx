import { IoMdDownload, IoMdImage } from "react-icons/io";
import { ACTIONS } from "../utility/actions";
import { LuRectangleHorizontal } from "react-icons/lu";
import { MdOutlineAdsClick } from "react-icons/md";
import { FaRegCircle } from "react-icons/fa";
import { PiScribbleLoopBold } from "react-icons/pi";
import { LuArrowUpRight } from "react-icons/lu";
import { IoText } from "react-icons/io5";

// eslint-disable-next-line react/prop-types
export default function Nav({action,setAction,download,importImage}){

    return(
        <nav className="bg-[#961233] h-[85vh] flex justify-center">
            <div className="text-base">
                <button onClick={()=>setAction(ACTIONS.SELECT)} 
                className={`justify-center text-[#961233] m-5 flex items-center bg-[#FFBABF] w-[50px] h-[40px] rounded-md ${action === ACTIONS.SELECT && "shadow-lg"} shadow-red-400`}>
                    <MdOutlineAdsClick className="text-base"/> 
                </button>
                <button onClick={()=>setAction(ACTIONS.RECTANGLE)} 
                className={`justify-center text-[#961233] m-5 flex items-center bg-[#FFBABF] w-[50px] h-[40px] rounded-md ${action === ACTIONS.RECTANGLE && "shadow-lg"} shadow-red-400`}>
                    <LuRectangleHorizontal className="text-base"/> 
                </button>
                <button onClick={()=>setAction(ACTIONS.CIRCLE)} 
                className={`justify-center text-[#961233] m-5 flex items-center bg-[#FFBABF] w-[50px] h-[40px] rounded-md ${action === ACTIONS.CIRCLE && "shadow-lg"} shadow-red-400`}>
                    <FaRegCircle className="text-base"/> 
                </button>
                <button onClick={()=>setAction(ACTIONS.SCRIBBLE)} 
                className={`justify-center text-[#961233] m-5 flex items-center bg-[#FFBABF] w-[50px] h-[40px] rounded-md ${action === ACTIONS.SCRIBBLE && "shadow-lg"} shadow-red-400`}>
                    <PiScribbleLoopBold className="text-base"/> 
                </button>
                <button onClick={()=>setAction(ACTIONS.ARROW)} 
                className={`justify-center text-[#961233] m-5 flex items-center bg-[#FFBABF] w-[50px] h-[40px] rounded-md ${action === ACTIONS.ARROW && "shadow-lg"} shadow-red-400`}>
                    <LuArrowUpRight className="text-base"/> 
                </button>
                <button onClick={()=>setAction(ACTIONS.TEXT)} 
                className={`justify-center text-[#961233] m-5 flex items-center bg-[#FFBABF] w-[50px] h-[40px] rounded-md ${action === ACTIONS.ARROW && "shadow-lg"} shadow-red-400`}>
                    <IoText className="text-base"/> 
                </button>
                <button onClick={()=>setAction(ACTIONS.IMAGE)} 
                className={`justify-center text-[#961233] m-5 flex items-center bg-[#FFBABF] w-[50px] h-[40px] rounded-md ${action === ACTIONS.IMAGE && "shadow-lg"} shadow-red-400`}>
                    <IoMdImage className="text-base"/> 
                    <input className="text-sm hidden" placeholder="Image" type='file' onChange={(e)=>importImage(e)}/>
                </button>
                <button onClick={()=>download()} 
                className={`justify-center text-[#961233] m-5 flex items-center bg-orange-400 w-[50px] h-[40px] rounded-md shadow-sm shadow-red-400`}>
                    <IoMdDownload className="text-base"/> 
                </button>
            </div>
            <div>
                
            </div>
        </nav>
    )
}