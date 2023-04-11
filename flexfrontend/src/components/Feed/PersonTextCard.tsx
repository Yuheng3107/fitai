


import filledCircle from "../../assets/svg/circle_FILL1_wght400_GRAD0_opsz48.svg"
import FilledCircle from "../../assets/svgComponents/FilledCircle";

function PersonTextCard() {
    return <div id="card-container" className="border border-zinc-500 mt-12 p-2">
        <div id="top-bar" className=" flex flex-row justify-between mb-2">
            <div className="flex flex-row">
                <img alt="profile-picture" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/10-04-2010_in_Warsaw.jpg/1280px-10-04-2010_in_Warsaw.jpg"
                    className="h-12 w-12 rounded-full object-cover" />
                <div className="ml-3">
                    <span id="username" className="font-semibold">JemZhangz</span>
                    <p id="subtitle" className="flex flex-row items-center text-sm text-gray-700">
                        <span id="post-place">Swimming</span>
                        <FilledCircle className="mx-1 h-1.5 w-1.5 aspect-square fill-slate-500" />
                        <span id="time-stamp">14h</span>
                    </p>
                </div>
            </div>
            <button id="menu-button"></button>
        </div>
        <div id="content" className="mb-2">
            <p id="title" className="font-semibold text-xl mb-2">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem, in. Asperiores neque, expedita unde nemo eum odit ex</p>
            <p id="main-content" className="text-sm">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolorum suscipit tenetur nulla adipisci esse culpa qui nihil placeat quidem, veritatis, saepe obcaecati vitae recusandae, ab corporis beatae laboriosam cumque expedita?</p>
        </div>
        <div id="action-bar">
            <input type="text" className="bg-slate-300 rounded-full py-1" placeholder="comment"/>
            <button>
                
            </button>
            <button></button>
            <button></button>
        </div>
    </div>
}

export default PersonTextCard;