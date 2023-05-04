const video = document.querySelector("#video");

async function delay(ms) {
// return await for better async stack trace support in case of errors.
return await new Promise((resolve) => setTimeout(resolve, ms));
}

window.onload = async () => {
    const detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING};
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
    // get from backend
    let exercise = getExercise(8);

    // initialise form correction
    init(
        exercise.evalPoses,
        exercise.scoreThreshold,
        exercise.scoreDeviation,
        exercise.angleWeights,
        exercise.angleThresholds,
        exercise.minRepTime,
        exercise.glossary,
        exercise.minSwitchPoseCount,
    );
    video.play();
    while (video.paused == false) {
        let poses = await detector.estimatePoses(video);
        // 50ms per frame = 20 fps
        await delay(50);
        let newFeedback = run(poses);
    }
}
/* Right-> Left -> Avg
0: hip-shoulder-elbow
3: shoulder-elbow-wrist
6: shoulder-hip-knee
9: hip-knee-ankle
12: vertical-hip-shoulder
15: vertical-rightHip-rightAnkle
*/
function getExercise(x) {
    if (x === -1) return {
        evalPoses: [
            new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ]),
        ],
        scoreThreshold: 0.7,
        scoreDeviation: 0.002,
        angleWeights: new Float32Array([1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]),
        angleThresholds: [[
            new Float32Array([0.1,0.1]),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),
        ],],
        minRepTime: 1500,
        glossary: [
          [
            ["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],
        ]],
        minSwitchPoseCount: [8,8],
      };
    if (x === 1) return {
        // side squat
        evalPoses: [new Float32Array([0, 0, 0, 0, 0, 0, 1.378, 0, 0, 0, 0, 0, 0.639, 0, 0, 0])],
        scoreThreshold: 0.7,
        scoreDeviation: 0.02,
        angleWeights: new Float32Array([0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, 0]),
        angleThresholds: [[
            new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),
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
        ]],
        minSwitchPoseCount: [8,8],
      };
    if (x === 2) return {
        // front squat
        evalPoses: [new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 2.466, 0, 0, 2.430, 0, 0, 0, 0]),new Float32Array(2),new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 2.639, 0, 0, 0, 0, 0, 0, 0,])],
        scoreThreshold: 0.9,
        scoreDeviation: 0.02,
        angleWeights: new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0]),
        angleThresholds: [[
            new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),
            new Float32Array([0, 0]),
            new Float32Array(2),new Float32Array(2),
            new Float32Array([0.25, 0.25]),
            new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),
        ],[],[
            new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),
            new Float32Array([0, 0.1]),
            new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),
        ]],
        minRepTime: 2000,
        glossary: [[
            ["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],
            ["", ""],
            ["", ""],["", ""],
            ["Squat not low enough", "Squat too low"],
            ["", ""],["", ""],["", ""],["", ""],
        ],[],[
            ["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],
            ["", "Knees collapse inwards"],
            ["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],
        ]],
        minSwitchPoseCount: [8,8],
      };
    if (x === 3) return {
        // push up
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
            ["Not low enough", ""],
        ]],
        minSwitchPoseCount: [8,8],
      };
      if (x === 4) return {
        // push up
        evalPoses: [
            new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1.723, 0, 0, 1.780]),
        ],
        scoreThreshold: 0.6,
        scoreDeviation: 0.005,
        angleWeights: new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 10]),
        angleThresholds: [[
            new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),
            new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),
            new Float32Array([0, 0.1]),
            new Float32Array(2),new Float32Array(2),
            new Float32Array([0.07, 0]),
        ],],
        minRepTime: 1500,
        glossary: [
          [
            ["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],
            ["", "Hips sagging"],
            ["", ""],["", ""],
            ["Not low enough", ""],
        ]],
        minSwitchPoseCount: [8,8],
      };
    if (x === 5) return {
        // hamstring left leg
        evalPoses: [
            new Float32Array([0, 0, 0, 0, 0, 0, 1.929, 0, 0, 0, 0, 0, 0.659, 0, 0, 0, ]),
        ],
        scoreThreshold: 0.8,
        scoreDeviation: 0.03,
        angleWeights: new Float32Array([0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, 0]),
        angleThresholds: [[
            new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),
            new Float32Array([0.1, 0]),
            new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),
            new Float32Array([0.1, 0]),
            new Float32Array(2),new Float32Array(2),new Float32Array(2),
        ],],
        minRepTime: 2500,
        glossary: [
          [
            ["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],
            ["Leg bent too little",""],
            ["", ""],["", ""],["", ""],["", ""],["", ""],
            ["Rounded back", ""],
            ["", ""],["", ""],["", ""],
        ]],
        minSwitchPoseCount: [8,8],
      };
      if (x === 6) return {
        // hamstring right leg
        evalPoses: [
            new Float32Array([0, 0, 0, 0, 0, 0, 0, 1.929, 0, 0, 0, 0, 0, 0.659, 0, 0, ]),
        ],
        scoreThreshold: 0.8,
        scoreDeviation: 0.03,
        angleWeights: new Float32Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0]),
        angleThresholds: [[
            new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),
            new Float32Array([0.1, 0]),
            new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),
            new Float32Array([0.1, 0]),
            new Float32Array(2),new Float32Array(2),new Float32Array(2),
        ],],
        minRepTime: 2500,
        glossary: [
          [
            ["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],
            ["Leg bent too little",""],
            ["", ""],["", ""],["", ""],
            ["Rounded back", ""],
            ["", ""],["", ""],["", ""],
        ]],
        minSwitchPoseCount: [8,8],
      };
      if (x === 7) return {
        // arm circles
        evalPoses: [
            new Float32Array([1.344, 1.344, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ]),
        ],
        scoreThreshold: 0.54,
        scoreDeviation: 0.05,
        angleWeights: new Float32Array([1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
        angleThresholds: [[
            new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),
        ],],
        minRepTime: 700,
        glossary: [
          [
            ["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],
            ["Leg bent too little"],
            ["", ""],["", ""],["", ""],
            ["Rounded back", ""],
            ["", ""],["", ""],["", ""],
        ]],
        minSwitchPoseCount: [1,1],
      };
      if (x === 8) return {
        // jump rope
        evalPoses: [new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])],
        scoreThreshold: 0.9,
        scoreDeviation: 0.02,
        angleWeights: new Float32Array([
            0, 0, 0, 
            0, 0, 1, 
            0, 0, 1, 
            0, 0, 0, 
            0, 0, 0, 
            0]),
        angleThresholds: [[
            new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),new Float32Array(2),]],
        minRepTime: 1,
        glossary: [[
            ["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],["", ""],]],
        minSwitchPoseCount: [2,2],
      };
  }
