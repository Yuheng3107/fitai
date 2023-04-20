
type RepCountProps = {
    repCountInput: number;
    repCount: number
}

function RepCountCircle({ repCountInput, repCount }: RepCountProps) {
    return <div id="rep-count-container" className="relative">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 200 200">

            <circle
                id="base-circle"
                className="stroke-current text-gray-200 z-0"
                stroke="#4A5568"
                strokeWidth="14"
                fill="transparent"
                r="80"
                cx="50%"
                cy="50%"
            />
            <circle
                id="rep-circle"
                className="stroke-current text-blue-500 z-10"
                stroke="#4A5568"
                strokeWidth="14"
                fill="transparent"
                r="80"
                cx="50%"
                cy="50%"
                style={{
                    //The formula is 2*Pi*r, r is defined earlier
                    strokeDasharray: `${2 * Math.PI * 80}`,
                    //This line tells us how much of the ring should be blank
                    strokeDashoffset:
                        ((repCountInput - repCount) / repCountInput) * 2 * Math.PI * 80,
                    transition: "stroke-dashoffset 1000ms linear",
                    strokeLinecap: "round",
                }}
            />
        </svg>
        <span className="text-6xl p-0 m-0 flex justify-center items-center absolute left-0 top-0 w-32 h-32">
            {repCount}
        </span>
    </div>

}

export default RepCountCircle;