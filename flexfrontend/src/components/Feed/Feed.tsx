import PersonTextCard from "./PersonTextCard";

//Redux imports
import { useAppSelector, useAppDispatch } from '../../store/hooks';

import { backend } from "../../App";
import { Link } from "react-router-dom";
import { emptyUserPostData } from "../../types/stateTypes";

function Feed() {
    const profileDataRedux = useAppSelector((state) => state.profile.profileData);

    function createPostHandler(event: React.MouseEvent<HTMLButtonElement>) {
        fetch(`${backend}/feed/user_post/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": String(
                    document.cookie?.match(/csrftoken=([\w-]+)/)?.[1]
                ),
            },
            credentials: "include",
            body: JSON.stringify({
                text: "what's up baby"
            }),
        }).then((response) => {
            // do something with response
            console.log(response);
        });
    }
    return <main className="w-full">
        <PersonTextCard userPostData={emptyUserPostData} profileData={profileDataRedux}/>
        <Link to="/post/create" className="w-12 h-12 bg-sky-500 block" >Add Post</Link>
    </main>
}

export default Feed;