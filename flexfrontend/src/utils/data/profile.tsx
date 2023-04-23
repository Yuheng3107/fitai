import { backend } from "../../App";
import { getExerciseRegimeAsync } from "./getExerciseData";
import { invalidProfileData, emptyExerciseStats } from "../../types/stateTypes";

//async implementation of getProfileData
export const getProfileDataAsync = async function () {
  try {
    let res = await fetch(`${backend}/users/user`, {
      method: "GET",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": String(document.cookie?.match(/csrftoken=([\w-]+)/)?.[1] ),
      },
    })
    let data = await res.json();
    return data
  } catch (error) {
    console.log(error);
  }
}

//Get the profile Data of another user (requires that user's id)
export const getOtherProfileDataAsync = async function (pk:Number) {
  try {
    let res = await fetch(`${backend}/users/user/${pk}`, {
      method: "GET",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": String(document.cookie?.match(/csrftoken=([\w-]+)/)?.[1] ),
      },
    })
    let data = await res.json();
    return data
  } catch (error) {
    console.log(error);
  }
}

export const getManyOtherProfileDataAsync = async function (pks:Number[]) {
  try {
    let res = await fetch(`${backend}/users/user/list`, {
      method: "POST",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": String(document.cookie?.match(/csrftoken=([\w-]+)/)?.[1] ),
      },
      body: JSON.stringify({
        user_ids: pks
      }),
    })
    let data = await res.json();
    return data
  } catch (error) {
    console.log(error);
  }
}

// Get the user's own profile data
export const getProfileData =  (updateFunction:any) =>{
  fetch(`${backend}/users/user`, {
    method: "GET",
    credentials: "include", // include cookies in the request
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": String(document.cookie?.match(/csrftoken=([\w-]+)/)?.[1] ),
    },
  })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((data) => {
      updateFunction(data);
      console.log(data);
    })
    .catch((err) => console.log(err));
}

export const getFavoriteExerciseAsync = async function (pk:Number) {
  try {
    let res = await fetch(`${backend}/exercises/exercise/favorite`, {
      method: "POST",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": String(document.cookie?.match(/csrftoken=([\w-]+)/)?.[1] ),
      },
      body: JSON.stringify({
        user_id: pk,
      })
    })
    let data = await res.json();
    return data
  } catch (error) {
    console.log(error);
  }
}

export const getFavoriteExerciseRegimeAsync = async function (pk:Number) {
  try {
    let res = await fetch(`${backend}/exercises/exercise_regime/favorite`, {
      method: "POST",
      credentials: "include", // include cookies in the request
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": String(document.cookie?.match(/csrftoken=([\w-]+)/)?.[1] ),
      },
      body: JSON.stringify({
        user_id: pk,
      })
    })
    let data = await res.json();
    return data
  } catch (error) {
    console.log(error);
  }
}

//Gets the user's normal profile data plus favorite exercise and exercise regime
export const getAllProfileData = async function (pk:Number) {
  let data = await getOtherProfileDataAsync(pk);
  if (data === undefined) return ({
    profileData: invalidProfileData,
    exerciseStats: emptyExerciseStats,
  });
  
  data.favorite_exercise = await getFavoriteExerciseAsync(data.id);
  data.favorite_exercise_regime = await getFavoriteExerciseRegimeAsync(data.id);
  data.favorite_exercise_regime.name = null;
  if (data.favorite_exercise_regime.exercise_regime !== null) data.favorite_exercise_regime = await getExerciseRegimeAsync(data.favorite_exercise_regime.exercise_regime);

  return splitProfileData(data);
}

//Utility function, takes the "data" object and returns an object with "profileData" and "exerciseStats" properties
export const splitProfileData = function (data:any) {
  return ({
    profileData: {
      id: data.id,
      achievements: data.achievements,
      username: data.username,
      email: data.email,
      profile_photo: data.profile_photo,
      bio: data.bio,
      followers: data.followers,
      reps: data.reps,
      perfect_reps: data.perfect_reps,
      friend_requests: data.friend_requests,
      sent_friend_requests: data.sent_friend_requests,
      communities: data.communities,
    },
    exerciseStats: {
      exercise_regimes: data.exercise_regimes,
      exercises: data.exercises,
      calories_burnt: data.calories_burnt,
      streak: data.streak,
      favorite_exercise: data.favorite_exercise,
      favorite_exercise_regime: data.favorite_exercise_regime,
    },
  });
}
