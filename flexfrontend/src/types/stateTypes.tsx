export type ProfileData = {
  achievements: any[];
  username: string;
  email: string;
  profile_photo: string;
  bio?: string;
  followers?: any[];
  reps?: number;
  perfect_reps?: number;
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
}

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
