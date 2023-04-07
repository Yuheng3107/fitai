

type ExerciseCardProps = {
    className?: string;
    title: string;
}

function ExerciseCard({ className, title }: ExerciseCardProps) {
    return <div className={`${className} bg-zinc-200 rounded-md m-3 flex flex-col justify-between h-48 w-4`}>
        <p>Squats</p>
        <div className="flex flex-row justify-between">
            <div>
                <img></img>
                <span>42,069</span>
            </div>
            <button>Play</button>
        </div>
    </div>
}

export default ExerciseCard;