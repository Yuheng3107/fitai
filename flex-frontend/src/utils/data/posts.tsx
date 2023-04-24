import { backend } from "../../App";

export const getUserPostsAsync = async function (user_id:number, set_no:number) {
  try {
    let res = await fetch(`${backend}/feed/user_post/latest`, {
      method: "POST",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": String(document.cookie?.match(/csrftoken=([\w-]+)/)?.[1]),
      },
      body: JSON.stringify({
        user_id: user_id,
        set_no: set_no,
      })
    })
    let data = await res.json();
    return data
  } catch (error) {
    console.log(error);
  }
}

export const getCommunityPostsAsync = async function (community_id:number, set_no:number) {
  try {
    let res = await fetch(`${backend}/feed/community_post/latest`, {
      method: "POST",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": String(document.cookie?.match(/csrftoken=([\w-]+)/)?.[1]),
      },
      body: JSON.stringify({
        community_id: community_id,
        set_no: set_no,
      })
    })
    let data = await res.json();
    return data
  } catch (error) {
    console.log(error);
  }
}

export const getUserFeedAsync = async function (set_no: number) {
  try {
    let res = await fetch(`${backend}/feed/feed`, {
      method: "POST",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": String(document.cookie?.match(/csrftoken=([\w-]+)/)?.[1] ),
      },
      body: JSON.stringify({
        set_no: set_no,
      })
    })
    let data = await res.json();
    data.sort( function(a:any,b:any) {
      return new Date(b.posted_at) > new Date(a.posted_at);
    });
    return data
  } catch (error) {
    console.log(error);
  }
}

export const createUserPostAsync = async function (postTitleInput:string, postTextInput:string) {
  try {
    let res = await fetch(`${backend}/feed/user_post/create`, {
      method: "POST",
      headers: {
        "X-CSRFToken": String(document.cookie?.match(/csrftoken=([\w-]+)/)?.[1]),
        "Content-type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        title: postTitleInput,
        text: postTextInput,
      }),
    })
    return res;
  } catch (error) {
    console.log(error);
  }
}

export const createCommunityPostAsync = async function (community:number, postTitleInput:string, postTextInput:string) {
  try {
    let res = await fetch(`${backend}/feed/community_post/create`, {
      method: "POST",
      headers: {
          "X-CSRFToken": String(document.cookie?.match(/csrftoken=([\w-]+)/)?.[1]),
          "Content-type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
          community_id: community,
          title: postTitleInput,
          text: postTextInput,
      }),
    })
    return res;
  } catch (error) {
    console.log(error);
  }
}