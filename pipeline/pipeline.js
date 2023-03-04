const video = document.querySelector("#video");

async function delay(ms) {
// return await for better async stack trace support in case of errors.
return await new Promise((resolve) => setTimeout(resolve, ms));
}

window.onload = async () => {
    const detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING};
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
    // get from backend
    let exercise = getExercise(0);

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
    if (x == 0) return {
        evalPoses: [new Float32Array([0, 0, 0, 0, 1.05, 0, 0, 0, 0.7, 0, 0])],
        scoreThreshold: 0.7,
        scoreDeviation: 0.02,
        angleWeights: new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, -1, 0, 0]),
        angleThresholds: [[
            new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),
            new Float32Array([0.14, 0.13]),
            new Float32Array(2),new Float32Array(2),new Float32Array(2),
            new Float32Array([0.15, 0]),
            new Float32Array(2),new Float32Array(2),
        ]],
        minRepTime: 2000,
        glossary: [[
            ["", ""],["", ""],["", ""],["", ""],
            ["Squat not low enough", "Squat too low"],
            ["", ""],["", ""],["", ""],
            ["Leaning forward too much", ""],
            ["", ""],["", ""],
        ]]
      };
    if (x == 1) return {
        evalPoses: [new Float32Array([0, 0, 0, 0, 0, 2.375, 0, 2.25, 0, 0, 0])],
        scoreThreshold: 0.7,
        scoreDeviation: 0.02,
        angleWeights: new Float32Array([0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0]),
        angleThresholds: [[
            new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),
            new Float32Array([0.26, 0]),
            new Float32Array(2),
            new Float32Array([0.3, 0.2]),
            new Float32Array(2),new Float32Array(2),new Float32Array(2),
        ]],
        minRepTime: 2000,
        glossary: [[
            ["", ""],["", ""],["", ""],["", ""],["", ""],
            ["Knees collapse inwards", ""],
            ["", ""],
            ["Squat not low enough", "Squat too low"],
            ["", ""],["", ""],["", ""],
        ]],
      };
    if (x == 2) return {
        evalPoses: [
            new Float32Array([0, 0, 0, 0, 2.825, 0, 2.832, 0, 1.583, 0, 1.7]),
        ],
        scoreThreshold: 0.7,
        scoreDeviation: 0.02,
        angleWeights: new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 10]),
        angleThresholds: [[
            new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),
            new Float32Array([0, 0.23]),
            new Float32Array(2),
            new Float32Array([0.3, 0]),
        ],],
        minRepTime: 1500,
        glossary: [
          [
            ["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],
            ["", "Sagging back"],
            ["", ""],
            ["Not going low enough", ""],
        ]],
      };
  }
