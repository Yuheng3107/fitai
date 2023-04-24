import { createSlice } from "@reduxjs/toolkit";
import { emptyExerciseStats } from "../types/stateTypes";

const exerciseDataSlice = createSlice({
    name: 'exerciseData',
    initialState: emptyExerciseStats,
    reducers: {
        setExerciseData: (state, action) => {
            console.log(action.payload);
            state = action.payload;
        }
    }
})

export const sexerciseStatsActions = exerciseDataSlice.actions;

export default exerciseDataSlice;