import { IonButton } from "@ionic/react";
import Button from "../ui/Button";

type Props = {
    startExerciseHandler:(event: React.MouseEvent<HTMLButtonElement>) => void;
}

function ExerciseOptions ({startExerciseHandler}:Props) {
    return <div>
        <span>These are the exercise options</span>
        <Button onClick={startExerciseHandler} >Start Exercising</Button>
    </div>
}

export default ExerciseOptions;