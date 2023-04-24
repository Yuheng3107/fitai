import { backend } from "../../App";

export default function Achievements({ achievements }) {
  if (achievements !== undefined && achievements.length > 0) {
    // return jsx list of span of achievement imgs
    let achievement_urls = [];
    fetch(`${backend}/achievements/achievement/list`, {
      method: "POST",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": document.cookie?.match(/csrftoken=([\w-]+)/)?.[1],
      },
      body: JSON.stringify(achievements),
    })
      .then((res) => {
        console.log(res);
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
    const achievementImages = achievement_urls.map((url) => {
      <span>
        <img key={url} src={url} alt="" />
      </span>;
    });
    return <>{achievementImages}</>;
  } else {
    return (
      <span id="achievements" className="my-1">
        No Achievements Found
      </span>
    );
  }
}
