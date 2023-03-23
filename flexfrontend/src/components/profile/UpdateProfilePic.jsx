
import { IonButton } from '@ionic/react';
import React, { useState, useRef } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import {useHistory} from 'react-router-dom';

import { backend } from '../../App';

import cropImage from '../../utils/crop';

const UpdateProfilePic = () => {
    const history = useHistory();

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [image, setImage] = useState();
    const [imageString, setImageString] = useState("");
    const [cropAreaBuffer, setCropAreaBuffer] = useState({});
    const [croppedImage, setCroppedImage] = useState();

    const imageInputRef = useRef(null);
    let profilePhotoFormData = new FormData();

    //When the image file is chosen, it's made into a string for the Cropper component
    function imageInputHandler() {
        console.log(typeof imageInputRef.current?.files?.[0]);
        if (imageInputRef.current?.files?.[0]) {
            setImageString(URL.createObjectURL(imageInputRef.current?.files?.[0]));
        }

    }

    //Whenever the crop changes, the new cropped image is appended to the formData
    function onCropComplete(croppedArea, croppedAreaPixels) {
        setCropAreaBuffer(croppedAreaPixels);
        console.log(croppedAreaPixels);
    }


    //When the save button is clicked, send POST req to backend
    function sendImageHandler() {
        //The last param of the cropImage function is actually a callback which acts on the cropped image (that is now a blob)
        cropImage(imageString, cropAreaBuffer, (croppedBlob) => {
            console.log("this is running properly");
            console.log(croppedBlob);
            setCroppedImage(croppedBlob);
            profilePhotoFormData.append("photo", croppedBlob);
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
        {croppedImage && <img src={croppedImage} alt="showing cropped image" />}
    </div>
}

export default UpdateProfilePic;