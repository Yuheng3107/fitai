export type ProfileData = {
  achievements: string[];
  email: string;
  profile_photo: string;
  username: string;
  bio: string;
};

export const emptyProfileData = {
  achievements: [],
  email: "",
  profile_photo: "",
  username: "",
  bio: "",
};

export type TrendData = {
  exercise_regimes: any[];
  exercises: any[];
  calories_burnt: number;
};

export const emptyTrendData = {
  exercise_regimes: [],
  exercises: [],
  calories_burnt: 0,
};
