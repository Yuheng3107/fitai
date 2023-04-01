import { Area } from "react-easy-crop";

const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.src = url;
    });

// Credits to "https://codesandbox.io/s/react-easy-crop-demo-with-cropped-output-q8q1mnr01w?from-embed=&file=/src/cropImage.js:0-2289"


async function cropImage(imageSrc: string, pixelCrop: Area, actOnCroppedBlob: BlobCallback) {
    const image: HTMLImageElement = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx!.drawImage(
        image,
        safeArea / 2 - image.width * 0.5,
        safeArea / 2 - image.height * 0.5
    );
    const data = ctx!.getImageData(0, 0, safeArea, safeArea);

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx!.putImageData(
        data,
        Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
        Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
    );

    canvas.toBlob(actOnCroppedBlob)
}


// const cropImage = async (image: string, croppedAreaPixels: Area) => {
//     try {
//         const croppedImage = await getCroppedImg(image, croppedAreaPixels, );
//         return croppedImage;
//     } catch (err) {
//         console.log(err);
//     }
// };


export default cropImage;