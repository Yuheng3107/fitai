const video = document.querySelector("#video");

async function delay(ms) {
// return await for better async stack trace support in case of errors.
return await new Promise((resolve) => setTimeout(resolve, ms));
}

window.onload = async () => {
    const detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING};
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
    // get from backend
    let exercise = getExercise(-1);

    // initialise form correction
    init(
        exercise.evalPoses,
        exercise.scoreThreshold,
        exercise.scoreDeviation,
        exercise.angleWeights,
        exercise.angleThresholds,
        exercise.minRepTime,
        exercise.glossary
    );
    video.play();
    while (video.paused == false) {
        let poses = await detector.estimatePoses(video);
        // 50ms per frame = 20 fps
        await delay(50);
        let newFeedback = run(poses);
    }
}

function getExercise(x) {
    if (x == -1) return {
        evalPoses: [
            new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ]),
        ],
        scoreThreshold: 0.6,
        scoreDeviation: 0.005,
        angleWeights: new Float32Array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]),
        angleThresholds: [[
            new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),
        ],],
        minRepTime: 1500,
        glossary: [
          [
            ["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],
        ]],
      };
    if (x == 0) return {
        evalPoses: [new Float32Array([0, 0, 0, 0, 0, 0, 1.378, 0, 0, 0, 0, 0, 0.639, 0, 0, 0])],
        scoreThreshold: 0.7,
        scoreDeviation: 0.02,
        angleWeights: new Float32Array([0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, 0]),
        angleThresholds: [[
            new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),Float32Array(2),new Float32Array(2),
            new Float32Array([0.15, 0.15]),
            new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),
            new Float32Array([0.15, 0]),
            new Float32Array(2),new Float32Array(2),new Float32Array(2),
        ]],
        minRepTime: 2000,
        glossary: [[
            ["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],
            ["Squat not low enough", "Squat too low"],
            ["", ""],["", ""],["", ""],["", ""],["", ""],
            ["Leaning forward too much", ""],
            ["", ""],["", ""],["", ""],
        ]]
      };
    if (x == 1) return {
        evalPoses: [new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 2.466, 0, 0, 2.430, 0, 0, 0, 0]),new Float32Array(2),new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 2.639, 0, 0, 0, 0, 0, 0, 0,])],
        scoreThreshold: 0.9,
        scoreDeviation: 0.02,
        angleWeights: new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0]),
        angleThresholds: [[
            new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),
            new Float32Array([0.2, 0]),
            new Float32Array(2),new Float32Array(2),
            new Float32Array([0.25, 0.25]),
            new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),
        ],[],[
            new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),
            new Float32Array([0, 0.1]),
            new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),
        ]
    ],
        minRepTime: 2000,
        glossary: [[
            ["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],
            ["Knees collapse inwards but its mid rep", ""],
            ["", ""],["", ""],
            ["Squat not low enough", "Squat too low"],
            ["", ""],["", ""],["", ""],["", ""],
        ],[],[
            ["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],
            ["", "Knees collapse inwards"],
            ["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],
        ]
    ],
      };
    if (x == 2) return {
        evalPoses: [
            new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.702, 0, 0, 1.650]),
        ],
        scoreThreshold: 0.6,
        scoreDeviation: 0.005,
        angleWeights: new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 10]),
        angleThresholds: [[
            new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),
            new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),
            new Float32Array([0, 0.1]),
            new Float32Array(2),new Float32Array(2),
            new Float32Array([0.1, 0]),
        ],],
        minRepTime: 1500,
        glossary: [
          [
            ["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],
            ["", "Sagging back"],
            ["", ""],["", ""],
            ["Not going low enough", ""],
        ]],
      };
  }
