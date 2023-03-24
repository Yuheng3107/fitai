

//dependencies
import React, { useState, useRef, useEffect } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { useHistory } from 'react-router-dom';

import { backend } from '../../App';

//ionic imports
import { IonButton, IonImg } from '@ionic/react';

//utils import
import cropImage from '../../utils/crop';
import getProfileData from '../../utils/getProfileData';

//types import
import { profileData, emptyProfileData } from '../../types/stateTypes';

//functional component
const UpdateProfilePic = () => {
    const history = useHistory();

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [image, setImage] = useState();
    const [imageString, setImageString] = useState("");
    const [cropAreaBuffer, setCropAreaBuffer] = useState<Area>({
        width: 0,
        height: 0,
        x: 0,
        y: 0,
    });
    const [croppedImage, setCroppedImage] = useState<Blob | null>();
    const [profileData, setProfileData] = useState<profileData>(emptyProfileData);

    //Using getProfileData to get the current profilePic
    useEffect(() => {
        getProfileData(setProfileData);
    }, [getProfileData])


    const imageInputRef = useRef<HTMLInputElement>(null);
    let profilePhotoFormData = new FormData();

    //When the image file is chosen, it's made into a string for the Cropper component
    function imageInputHandler() {
        // console.log(typeof imageInputRef.current?.files?.[0]);
        // if (imageInputRef.current?['files'][0] !== null) {
        //     setImageString(URL.createObjectURL(imageInputRef.current?['files']?.[0] ));
        // }
        if (imageInputRef.current !== null && imageInputRef.current.files !== null && imageInputRef.current.files[0] !== null) {
            setImageString(URL.createObjectURL(imageInputRef.current.files[0]));
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
            setCroppedImage(croppedBlob);
            if (croppedBlob !== null) {
                profilePhotoFormData.append("photo", croppedBlob);
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
            })
                .then((response) => {
                    // do something with response
                    history.push('/profile');
                    console.log(response);
                })
                .catch((err) => {
                    console.log(err);
                });
        });

    }

    return <div>
        <p>update profile pic</p>
        <input ref={imageInputRef} type="file" onChange={imageInputHandler} />
        <div className="relative h-1/2 aspect-square">
            <IonImg src={backend.concat(profileData.profile_photo)}></IonImg>
            <Cropper
                image={imageString}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                cropShape="round"
                showGrid={true}
                onCropComplete={onCropComplete}
            />
            <IonButton onClick={sendImageHandler}>Save</IonButton>
        </div>
    </div>
}

export default UpdateProfilePic;