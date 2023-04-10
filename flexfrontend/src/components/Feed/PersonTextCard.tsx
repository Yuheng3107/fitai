

import filledCircle from "../../assets/svg/circle_FILL1_wght400_GRAD0_opsz48.svg"

function PersonTextCard() {
    return <div id="card-container">
        <div id="top-bar" className="flex flex-row justify-between">
            <div className="flex flex-row">
                <img alt="profile-picture" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/10-04-2010_in_Warsaw.jpg/1280px-10-04-2010_in_Warsaw.jpg"
                    className="h-12 w-12 rounded-full object-cover" />
                <div>
                    <span id="username">JemZhangz</span>
                    <p id="subtitle" className="flex flex-row items-center">
                        <span id="post-place">Swimming</span>
                        <img src={filledCircle} alt="" className="w-2 h-2 "/>
                        <span id="time-stamp">14h</span>
                    </p>
                </div>
            </div>
            <button id="menu-button"></button>
        </div>
        <div id="content">
            <p id="title"></p>
            <p id="main-content"></p>
        </div>
        <div id="action-bar"></div>
    </div>
}

export default PersonTextCard;