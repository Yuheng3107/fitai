import { backend } from "../../App";

export const getCommunityAsync = async function (pk) {
  try {
    let res = await fetch(`${backend}/community/community/${pk}`, {
      method: "GET",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": document.cookie?.match(/csrftoken=([\w-]+)/)?.[1],
      },
    })
    let data = await res.json();
    return data
  } catch (error) {
    console.log(error);
  }
}

export const getCommunitiesListAsync = async () => {
  try {
    let res = await fetch(`${backend}/community/community/list`, {
      method: "GET",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": document.cookie?.match(/csrftoken=([\w-]+)/)?.[1],
      },
    })
    let data = await res.json();
    return data
  } catch (error) {
    console.log(error);
  }
}
