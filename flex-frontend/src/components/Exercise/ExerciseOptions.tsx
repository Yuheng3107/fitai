import { useState } from "react";

import { IonButton } from "@ionic/react";
import Button from "../ui/Button";
import UpDownButton from "./UpDownButton";


type Props = {
    startExerciseHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
    repDecrementHandler: (event: React.MouseEvent<HTMLButtonElement>)=> void;
    repIncrementHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
    repCountInput: number;
}

function ExerciseOptions({ startExerciseHandler, repIncrementHandler, repDecrementHandler, repCountInput }: Props) {

    return <div className="h-full flex flex-col justify-between">
        <span>These are the exercise options</span>
        <div id="rep-select-container" className="flex justify-center">
            <div id="rep-count-container" className="relative">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 200 200">
                    <circle
                        className="stroke-current text-blue-500"
                        stroke="#4A5568"
                        strokeWidth="14"
                        fill="transparent"
                        r="80"
                        cx="50%"
                        cy="50%"
                        style={{
                            strokeDasharray: `${2 * Math.PI * 80}`,
                            transition: 'stroke-dashoffset 1000ms linear',
                            strokeLinecap: "round"
                        }}
                    />
                </svg>
                <span className="text-6xl p-0 m-0 flex justify-center items-center absolute left-0 top-0 w-32 h-32">{repCountInput}</span>
            </div>
            <div className="flex flex-col justify-evenly">
                <UpDownButton onClick={repIncrementHandler}>Up</UpDownButton>
                <UpDownButton onClick={repDecrementHandler}>down</UpDownButton>
            </div>
        </div>
        <div className="mb-12 flex justify-center text-xl">
            <Button className="px-6 py-4 bg-blue-400 hover:bg-blue-600 text-white" onClick={startExerciseHandler} >Start</Button>
        </div>
    </div>
}

export default ExerciseOptions;