

//dependencies
import React, { useState, useRef, useEffect } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { useHistory } from 'react-router-dom';

import { backend } from '../../App';

//redux imports
import { profileDataActions } from '../../store/profileDataSlice';
import { useAppDispatch } from '../../store/hooks';

//utils import
import cropImage from '../../utils/crop';
import { getProfileData } from '../../utils/data/profile';

//types import
import { ProfileData, emptyProfileData } from '../../types/stateTypes';

//assets
import EditSquareIcon from '../../assets/svgComponents/editSquareIcon';

//component imports
import Button from '../ui/Button';

type UpdateProfilePicProps = {
    setUpdateProfileState: (newState: number) => void;
    updateProfileState: number;
}

//functional component
const UpdateProfilePic = ({ setUpdateProfileState, updateProfileState }: UpdateProfilePicProps) => {
    const history = useHistory();
    const dispatch = useAppDispatch();

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [imageString, setImageString] = useState("");
    const [cropAreaBuffer, setCropAreaBuffer] = useState<Area>({
        width: 0,
        height: 0,
        x: 0,
        y: 0,
    });
    const [profileData, setProfileData] = useState<ProfileData>(emptyProfileData);
    const [edittingNewImage, setEdittingNewImage] = useState(false);
    const [imageFileName, setImageFileName] = useState("")


    const imageInputRef = useRef<HTMLInputElement>(null);

    let profilePhotoFormData = new FormData();

    //Using getProfileData to get the current profilePic
    useEffect(() => {
        getProfileData(setProfileData);
        dispatch(profileDataActions.updateProfileCounter);
    }, [getProfileData])


    //When the image file is chosen, it's made into a string for the Cropper component
    function imageInputHandler() {

        if (imageInputRef.current !== null &&
            imageInputRef.current.files !== null &&
            imageInputRef.current.files.length !== 0 &&
            imageInputRef.current.files[0] !== null) {
            console.log(imageInputRef.current.files)
            setImageString(URL.createObjectURL(imageInputRef.current.files[0]));
            setEdittingNewImage(true);
            let fileName = imageInputRef.current.files[0].name
            setImageFileName(fileName.substr(0, fileName.lastIndexOf('.')) || fileName);
        }
    }
    //Whenever the crop changes, the new cropped image is appended to the formData
    function onCropComplete(croppedArea: Area, croppedAreaPixels: Area) {
        setCropAreaBuffer(croppedAreaPixels);
        console.log(croppedAreaPixels);
    }


    //When the save button is clicked, send POST req to backend
    function sendImageHandler() {
        //The last param of the cropImage function is actually a callback which acts on the cropped image (that is now a blob)
        cropImage(imageString, cropAreaBuffer, (croppedBlob) => {
            console.log("this is running properly");
            console.log(croppedBlob);
            if (croppedBlob !== null) {
                profilePhotoFormData.append("photo", croppedBlob, imageFileName);
                for (const value of profilePhotoFormData.values()) {
                    console.log(value);
                }
            }
            fetch(`${backend}/users/user/update/profile_photo`, {
                method: "POST",
                headers: {
                    "X-CSRFToken": String(
                        document.cookie?.match(/csrftoken=([\w-]+)/)?.[1]
                    ),
                },
                credentials: "include",
                body: profilePhotoFormData,
            }).then((response) => {
                // do something with response
                setUpdateProfileState(updateProfileState + 1);
                history.push('/profile');
            }).catch((err) => {
                console.log(err);
            });
        });

    }

    return <div>
        <div className="relative aspect-square">
            {/* This displays the current profile photo, which will be hidden away once the new profile pic is chosen */}
            {edittingNewImage ?
                <Cropper
                    objectFit='auto-cover'
                    image={imageString}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    cropShape='round'
                    showGrid={true}
                    onCropComplete={onCropComplete}
                />
                :
                <img className={`rounded-full border-4 border-sky-300 p-2 w-full h-full`} src={backend.concat(profileData.profile_photo)} />
            }

            <input id="selectImageFile" className="hidden" ref={imageInputRef} type="file" onChange={imageInputHandler}
                accept=".png, .jpeg, .jpg, .webp" />
            <button role="button"
                className={`${edittingNewImage && "hidden"} z-40 absolute right-3 bottom-3 aspect-square rounded-full bg-zinc-300 h-12 w-12`}
                onClick={() => {
                    if (imageInputRef.current !== null) {
                        imageInputRef.current.click();
                    }
                }}>
                {/* <img className="fill-slate-50 h-10" src={editIcon}></img> */}
                <EditSquareIcon className="h-8 w-8 absolute top-1 left-2" />
            </button>
            {/* Cropper is positioned absolutely */}

        </div>
        <div className={`${edittingNewImage ? "" : "hidden"} flex flex-row justify-between mt-3`}>
            <Button role="button"
                className={`w-5/12 border border-zinc-300 border-solid`}
                onClick={() => {
                    if (imageInputRef.current !== null) {
                        imageInputRef.current.click();
                    }
                }}>
                Change Image
            </Button>
            <Button className={`w-5/12 bg-blue-500 text-white`} onClick={sendImageHandler}>Update Image</Button>
        </div>

    </div>
}

export default UpdateProfilePic;