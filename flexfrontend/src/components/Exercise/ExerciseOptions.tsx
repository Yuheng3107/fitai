import { useState } from "react";

import { IonButton } from "@ionic/react";
import Button from "../ui/Button";


type Props = {
    startExerciseHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

function ExerciseOptions({ startExerciseHandler }: Props) {
    const [repCountInput, setRepCountInput] = useState(1);

    const repIncrementHandler = (event: React.MouseEvent<HTMLButtonElement>) => {

    }

    const repDecrementHandler = (event: React.MouseEvent<HTMLButtonElement>) => {

    }

    return <div className="h-full flex flex-col justify-between">
        <span>These are the exercise options</span>
        <div id="rep-select-container" className="flex justify-center">
            <div id="rep-ring" className="bg-zinc-300">
                <span>{repCountInput}</span>
            </div>
            <div className="flex flex-col">
                <button>up</button>
                <button>down</button>
            </div>
        </div>
        <div className="mb-12 flex justify-center text-xl">
            <Button className="px-6 py-4 bg-blue-400 hover:bg-blue-600 text-white" onClick={startExerciseHandler} >Start</Button>
        </div>
    </div>
}

export default ExerciseOptions;