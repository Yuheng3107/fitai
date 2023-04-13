export type ProfileData = {
  achievements: any[];
  username: string;
  email: string;
  profile_photo: string;
  bio: string;
  followers: any[];
  reps: number;
  perfect_reps: number;
}

export const emptyProfileData = {
  achievements: [],
  email: "",
  profile_photo: "",
  username: "",
  bio: "",
  followers: [],
  reps: 0,
  perfect_reps: 0,
};

export type TrendData = {
  exercise_regimes: any[];
  exercises: any[];
  calories_burnt: number;
}

export const emptyTrendData = {
  exercise_regimes: [],
  exercises: [],
  calories_burnt: 0,
};
