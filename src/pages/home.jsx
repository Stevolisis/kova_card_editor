import Editor from "../components/Editor";

export default function Home(){


    return(
        <>
            <section>
                <div className="bg-[#7D0E2A] flex px-5 py-7 bg">
                    <h1 className="text-[#FFBABF] text-3xl font-semibold">Card Editor</h1>
                </div>
                    <Editor/>
            </section>
        </>
    )
}