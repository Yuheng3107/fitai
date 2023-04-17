export type ProfileData = {
  id: number;
  achievements: any[];
  username: string;
  email: string;
  profile_photo: string;
  bio?: string;
  followers?: any[];
  reps?: number;
  perfect_reps?: number;
};

export const emptyProfileData = {
  id: 0,
  achievements: [],
  email: "",
  profile_photo: "",
  username: "",
  bio: "",
  followers: [],
  reps: 0,
  perfect_reps: 0,
};

export const invalidProfileData = {
  id: -1,
  achievements: [],
  email: "",
  profile_photo: "",
  username: "",
  bio: "",
  followers: [],
  reps: 0,
  perfect_reps: 0,
};

export type UserPostData = {
  poster: number;
  posted_at: string;
  likes: number;
  text: string;
  title: string;
};

export const emptyUserPostData = {
  poster: 0,
  posted_at: "",
  likes: 0,
  text: "Lorem Ipsum",
  title: "Ipsum Lorem",
};

export type ExerciseStats = {
  exercise_regimes: any[];
  exercises: any[];
  calories_burnt: number;
  streak: number;
  favorite_exercise: {
    exercise: number;
    perfect_reps: number;
    total_reps: number;
  };
  favorite_exercise_regime: {
    name: number;
    times_completed: number;
  };
};

export const emptyExerciseStats = {
  exercise_regimes: [],
  exercises: [],
  calories_burnt: 0,
  streak: 0,
  favorite_exercise: {
    exercise: 1,
    perfect_reps: 0,
    total_reps: 0,
  },
  favorite_exercise_regime: {
    name: 1,
    times_completed: 0,
  }
};
