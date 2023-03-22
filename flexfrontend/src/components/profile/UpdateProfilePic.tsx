
import React, { useState, useRef } from 'react';
import Cropper from 'react-easy-crop';

const UpdateProfilePic = () => {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [image, setImage] = useState<string | undefined>();

    const imageInputRef = useRef<HTMLInputElement>(null);

    function imageHandler() {
        console.log(typeof imageInputRef.current?.files?.[0]);
        if (imageInputRef.current?.files?.[0]) {
            setImage(URL.createObjectURL(imageInputRef.current?.files?.[0]));
        }

    }

    return <div>
        <p>update profile pic</p>
        <input ref={imageInputRef} type="file" onChange={imageHandler} />
        <div className="relative h-1/2 aspect-square">
            <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                cropShape="round"
                showGrid={true}
            />
        </div>
    </div>
}

export default UpdateProfilePic;