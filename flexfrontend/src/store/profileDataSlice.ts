import { createSlice } from "@reduxjs/toolkit";

const ProfileDataSlice = createSlice({
    name: 'profile',
    initialState: {
        profileData: {
            profile_photo: "",
        },
        profileCounter: 0
    },
    reducers: {
        setProfileData: (state, action) => {
            console.log(action.payload);
            state.profileData = action.payload;
        },
        updateProfileCounter: (state) => {
            state.profileCounter = state.profileCounter + 1
        }
    }
})

export const profileDataActions = ProfileDataSlice.actions;

export default ProfileDataSlice;