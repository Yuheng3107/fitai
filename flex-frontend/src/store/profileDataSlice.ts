import { createSlice } from "@reduxjs/toolkit";
import { emptyProfileData } from "../types/stateTypes";

const ProfileDataSlice = createSlice({
    name: 'profile',
    initialState: {
        profileData: emptyProfileData,
        profileCounter: 0
    },
    reducers: {
        setProfileData: (state, action) => {
            console.log(action.payload);
            state.profileData = action.payload;
        },
        updateProfileCounter: (state) => {
            console.log("updateProfileCounter is now running");
            state.profileCounter = state.profileCounter + 1
        }
    }
})

export const profileDataActions = ProfileDataSlice.actions;

export default ProfileDataSlice;