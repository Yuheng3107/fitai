/*--------------------
FRAME VARIABLES
--------------------*/
const poseThreshold = 0.4;
/**
 * Storage for frames
 * @type {Float32Array(n,x)}
 * @param n number of selected frames
 * @param x key angles (11)
 */
let frameArray;

/**
 * Number of frames
 * @type {Number}
 */
let frameCount;

/**
 * Scores of each stored frame
 * @type {Float32Array(n)}
 * @param n number of selected frames
 */
let frameScores;

/**
 * Frame countdown to switch poses
 * @type {Number}
 */
let switchPoseCount;

/**
 * 0: start->mid, 1: mid->end
 * @type {Number}
 */
let poseStatus;

/**
 * Minimum score detected
 * @type {Number}
 */
let minScore;

/**
 * Frame that minimum score was detected
 * @type {Number}
 */
let minFrame;

/**
 * Maximum score detected
 * @type {Number}
 */
let maxScore;

/**
 * Frame that maximum score was detected
 * @type {Number}
 */
let maxFrame;

/*--------------------
Pose Variables
--------------------*/
/**
 * processed keypoints
 * @type {Array(17,2)}
 */
let keypoints;

/**
 * The correct poses. 
 * @type {Array(4,x)}
 * @param four 0: start->mid, 1: keypose, 2: mid->end, 3: end
 */
let evalPoses;

/**
 * Text descriptions of each angle mistake
 * @type {Array(4,x,2)}
 * @param four 0: start->mid, 1: keypose, 2: mid->end, 3: end
 * @param x key angles (11)
 * @param two too large (0) or too small (1)
 */
let glossary;

/**
 * Acceptable rate of change for mid part of exercise to be within
 * @type {Number}
 */
let scoreThreshold;

/**
 * Weights that each angle should have in evaluation. 
 * Positive for angles that decrease as the exercise approaches the key pose, negative if vice versa.
 * @type {Float32Array(x)}
 */
let angleWeights;

/**
 * Differences in angle required for feedback to be given
 * @type {Float32Array(4,x,2)}
 * @param four 0: start->mid, 1: keypose, 2: mid->end, 3: end
 * @param x key angles (11)
 * @param two too large (0) or too small (1)
 */
let angleThresholds;

/*--------------------
FEEDBACK VARIABLES
--------------------*/
/**
 * number of times angle was too small
 * @type {Array(4,x)} 
 * @param four 0: start->mid, 1: keypose, 2: mid->end, 3: end
 * @param x key angles (11)
 */
let smallErrorCount;

/**
 * number of times angle was too large
 * @type {Array(4,x)}
 * @param four 0: start->mid, 1: keypose, 2: mid->end, 3: end
 * @param x key angles (11)
 */
let largeErrorCount;

/**
 * number of perfect reps
 * @type {Number}
 */
let perfectReps;

/**
 * Array of feedback for each rep
 * @type {Array(string)}
 */
 let repFeedback;

 /**
 * Number of completed reps
 * @type {Number}
 */
 let repCount;

/**
 * Converts keypoints into keyposes
 * Called: every frame
 * @param {Array} keypoints keypoints detected by MoveNet
 * @param {Number} height height of img
 * @param {Number} width width of img
 * @returns {Array} String that is feedback
 */
function run(poses) {
  // check for empty
  if (poses.length == 0) {
    return;
  }

  processKeypoints(poses);
  let curPose = processData(keypoints);
  console.log(curPose);
  let score = poseScore(curPose);
  console.log(score);
  if (score == -1) {
    return ["Position Self in Frame"];
  }
  // necessary to prevent frames from stacking at the start?
  frameCount += 1;
  frameArray.push(curPose);
  frameScores[frameCount] = score;

  // rate of change cannot be found with 1 item
  if (frameCount == 1) return [];
  
  // check pose switching
  let repStatus = checkRep(score);
  if (repStatus == 1) {
    finishRep();
    return repFeedback;
  }
  return [];
}

/**
 * Resets the stored angle data for that rep.
 * Called: when a rep is finished.
 */
function resetFrames () {
  frameArray = new Array();
  frameCount = 0;
  frameScores = new Float32Array(1000);
  minFrame = 0;
  maxFrame = 0;
  minScore = 1;
  maxScore = 0;
  switchPoseCount = 0;
  poseStatus = 0;
}

/**
 * Resets all exercise-related variables.
 * Called: when new exercise begins
*/
function resetAll () {
  resetFrames();
  repCount = 0;
  smallErrorCount = initBigArray();
  largeErrorCount = initBigArray();
  perfectReps = 0;
  keypoints = new Array();
  for (let i=0;i<17;i++) {
    keypoints.push(new Float32Array(2));
  }
}

/**
 * Initialises a new array of size keyAngles
 * @returns {Float32Array} Array with size keyAngles
 */
function initArray() {
  return new Float32Array(11);
}

/**
 * Initialises a new array of size keyAngles
 * @returns {Int8Array} Array with size keyAngles
 */
function initIntArray() {
  return new Uint8Array(11);
}

/**
 * Initialises a new array of 4, keyAngles
 * @returns {Array} Array with size 4, keyAngles of datatype Uint8
 */
function initBigArray() {
  let x = new Array();
  for (let i=0;i<4;i++) {
    x.push(initIntArray());
  }
  return x;
}

/*--------------------
EXERCISE METHODS
These methods are called once per exercise.
--------------------*/

/**
 * Initialises all necessary values for the exercise from the backend
 * @param {Array} evalposes The correct poses
 * @param {Number} scorethreshold Acceptable rate of change for mid part of exercise to be within
 * @param {Float32Array} angleweights Weights that each angle should have in evaluation
 * @param {Float32Array} anglethresholds Differences in angles required for feedback to be given 
 * @param {Array} glossaryy Text descriptions of each mistake
 */
function init (evalposes, scorethreshold, angleweights, anglethresholds, glossaryy) {
  evalPoses = evalposes;
  scoreThreshold = scorethreshold;
  angleWeights = angleweights;
  angleThresholds = anglethresholds;
  glossary = glossaryy;
  resetAll();
}

/**
 * Called when exercise ends.
 * @returns feedback summary.
 */
function endExercise() {
  if (repCount == 0) {
    return "No Reps Detected. "
  }
  return summariseFeedback();
}

/**
 * Used to convert the rep feedback into a feedback summary for the user.
 * Called: when exercise is finished. 
 * @param smallErrorCount
 * @param largeErorrCount
 * @param feedback
 * @returns {string} feedback for that rep
 */
function summariseFeedback() {
  let feedback =  "";
  feedback += repCount.toString() + " reps completed. ";
  let n = smallErrorCount.length;
  for (let j=0;j<smallErrorCount.length;j++) {
    for (let i=0;i<n;i++) {
      if (smallErrorCount[j][i] != 0) {
          feedback += glossary[j][i][0] + " " + smallErrorCount[j][i].toString() + " times. ";
      }
      if (largeErrorCount[j][i] != 0) {
          feedback += glossary[j][i][1] + " " + largeErrorCount[j][i].toString() + " times. ";
      }
    }
  }
  feedback += perfectReps.toString() + " perfect reps.";
  return feedback;
}

/*--------------------
REP METHODS
These methods are called once per rep.
--------------------*/
/**
 * Gets the feedback for the rep, then deletes all frame data of the rep.
 * Called: when rep is finished.
 */
function finishRep() {
  repCount += 1;
  if (frameArray.length == 0) return "No Frames Detected";
  // keypose
  let midExerciseFrames = splitFrames(minFrame);
  // end
  let endExerciseFrames = splitFrames(maxFrame);
  // start->mid
  let startExerciseFrames = new Uint8Array([0, midExerciseFrames[0]-1]);
  // mid->end
  let midEndExerciseFrames = new Uint8Array([midExerciseFrames[1]+1,endExerciseFrames[0]-1]);
  let feedback = ""
  // start->mid
  let angleDifferences = compareAngles(startExerciseFrames, evalPoses[0], angleThresholds[0]);
  feedback += giveFeedback(angleDifferences, 0);
  // keypose
  angleDifferences = compareAngles(midExerciseFrames, evalPoses[1], angleThresholds[1]);
  feedback += giveFeedback(angleDifferences, 1);
  // mid->end
  angleDifferences = compareAngles(midEndExerciseFrames, evalPoses[2], angleThresholds[2]);
  feedback += giveFeedback(angleDifferences, 2);
  // end
  angleDifferences = compareAngles(endExerciseFrames, evalPoses[3], angleThresholds[3]);
  feedback += giveFeedback(angleDifferences, 3);
  if (feedback == "") {
    feedback += "Perfect!";
    perfectReps += 1;
  }
  let finalFeedback = "Rep " + repCount.toString() + ": " + feedback;
  // tell backend?
  console.log(finalFeedback);
  return finalFeedback;
}

/**
 * Selects frames close enough to the centre frame.
 * @param {Number} centre number of centre frame
 * @param {Number} scoreThreshold Acceptable rate of change for mid part of exercise to be within
 */
function splitFrames(centre) {
  let i = centre+1;
  if (i >= frameCount) i = frameCount;
  for (;i<frameCount;i++) {
    if (Math.abs(frameCount[i] - frameCount[centre]) > scoreThreshold) break;
  }
  let j = centre-1;
  if (j < 0) j = 0;
  for (;j>=0;j--) {
    if (Math.abs(frameCount[j] - frameCount[centre]) > scoreThreshold) break;
  }
  return new Uint8Array([j,i]);
}
/**
 * Used to process angle data leto text feedback to feed to front-end
 * Called: when rep is finished.
 * @param {Float32Array} angleDifferences angle differences, positive is too large, negative is too small, 0 is no significant difference
 * @param {Number} state 0: start->mid, 1: keypose, 2: mid->end, 3: end
 * @returns {string} errors made in rep
 */
function giveFeedback(angleDifferences, state) {
  let feedback = "";
  if (angleDifferences[0] == -98 || angleDifferences[0] == -97) {
    return feedback;
  }

  if (angleDifferences[0] == -99) {
    return "No Frames!";
  }
  let n = angleDifferences.length;
  for (let i=0;i<n;i++) {
    if (angleDifferences[i] == 0) continue;
    if (angleDifferences[i] > 0) {
      smallErrorCount[state][i] += 1;
      feedback += glossary[state][i][0] + ". ";
    }
    if (angleDifferences[i] < 0) {
      largeErrorCount[state][i] += 1;
      feedback += glossary[state][i][1] + ". ";
    }
  }
  return feedback;
}

/**
 * Calculates the difference between ideal and observed angles in user's pose
 * Called: when rep is finished.
 * @param {Uint8Array} range
 * @param {Float32Array} evalPose
 * @param {Float32Array} angleThreshold
 * @param {Array} frameArray
 * @returns {Float32Array} differences large enough to count as errors
 */
function compareAngles (range, evalPose, angleThreshold) {
  if (angleThreshold === undefined || evalPose === undefined) {
    return new Float32Array([-97]);
  }
  let n = evalPose.length;
  if (n < 10) {
    return new Float32Array([-98]);
  }
  if (frameArray.length == 0) {
    return new Float32Array([-99]);
  }

  let differences = initArray();
  // sum frames
  for (let i=range[0];i<range[1];i++) {
    for (let j=0;j<n;j++) {
      differences[j] += frameArray[i][j];
    }
  }
  for (let i=0;i<n;i++) {
    // average frames
    differences[i] /= frameArray.length;
    // finding difference
    differences[i] -= evalPose[i];
    // 0 if +ve, 1 if -ve
    let x = 0;
    if (differences[i]<0) x = 1;
    if (angleThreshold[i][x] == 0) continue;
    // check threshold
    if (Math.abs(differences[i]) < angleThreshold[i][x]) {
      differences[i] = 0;
    }
  }
  return differences;
}

/**
 * @deprecated
 * Evaluates if rep time is too short
 * Called: when rep is finished
 * @param {*} evalTime 
 * @param {*} repTime 
 * @returns {Number} 1 or 0
 */
function compareTime (evalTime, repTime) {
  if (repTime < evalTime) return 1;
  return 0;
}


/*
FRAME METHODS
These methods are called once per frame.
*/

/**
 * Used to determine when the current rep should end. Also logs the max and min frame detected.
 * Called: every frame while rep detection is active.
 * @param {Number} score score returned by comparePoses
 * @param {Number} poseStatus 0: start->mid, 1: mid->end
 * @returns 0: nothing, 1: end of rep
 */
function checkRep (score) {
  if (score == -1) return false;
  if (score < minScore) {
    minScore = score;
    minFrame = frameCount;
  }
  // Rep detection: look for increasing score
  if (poseStatus == 0) {
    if (score > frameScores[frameCount-2]) {
      switchPoseCount += 1;
      if (switchPoseCount >= 5) {
        switchPoseCount = 0;
        poseStatus = 1;
      }
      return 0;
    }
    switchPoseCount = 0;
    return 0;
  }
  // Rep detection: look for decreasing score
  if (poseStatus == 1) {
    // check for max scores only after bottom point is reached
    if (score > maxScore) {
      maxScore = score;
      maxFrame = frameCount;
    }
    if (score < frameScores[frameCount-2]) {
      switchPoseCount += 1;
      if (switchPoseCount >= 5) {
        switchPoseCount = 0;
        poseStatus = 0;
        return 1;
      }
      return 0;
    }
    switchPoseCount = 0;
  }
}

function processKeypoints (poses) {
  if (poses.length == 0) {
    return;
  }
  for (let i=0;i<17;i++) {
    if (poses[0].keypoints[i].score < poseThreshold) {
      keypoints[i][0] = -1;
      keypoints[i][1] = -1;
      continue;
    }
    keypoints[i][0] = poses[0].keypoints[i].x;
    keypoints[i][1] = poses[0].keypoints[i].y;
  }
}
/**
 * Used to convert keypoint data into angle data
 * Called: every frame while rep detection is active.
 * @param {Array} keypoints keypoints detected by MoveNet
 * @returns {Float32Array} angle data of the pose
 */
function processData (keypoints) {
  if (keypoints.length != 17 || keypoints[0].length != 2) {
    return initArray();
  }

  let lines = new Array();
  // vertical
  lines[0] = new Float32Array([0,1]);

  // leftShoulder-leftElbow
  lines[1] = makeLine(keypoints[5],keypoints[7]);
  // rightShoulder-rightElbow
  lines[2] = makeLine(keypoints[6],keypoints[8]);
  // leftElbow-leftWrist
  lines[3] = makeLine(keypoints[7],keypoints[9]);
  // rightElbow-rightWrist
  lines[4] = makeLine(keypoints[8],keypoints[10]);

  // leftShoulder-leftHip
  lines[5] = makeLine(keypoints[5],keypoints[11]);
  // rightShoulder-rightHip
  lines[6] = makeLine(keypoints[6],keypoints[12]);

  // leftHip-leftKnee
  lines[7] = makeLine(keypoints[11],keypoints[13]);
  // rightHip-rightKnee
  lines[8] = makeLine(keypoints[12],keypoints[14]);
  // leftKnee-leftAnkle
  lines[9] = makeLine(keypoints[13],keypoints[15]);
  // rightKnee-rightAnkle
  lines[10] = makeLine(keypoints[14],keypoints[16]);
  // rightHip-rightAnkle
  lines[11] = makeLine(keypoints[12],keypoints[16]);
  
  
  // curPose, 0 is invalid data
  let curPose = initArray();

  // rightHip-rightShoulder-rightElbow
  curPose[0] = calcAngle(negative(lines[6]),lines[2]);
  // Avg(hip-shoulder-elbow)
  curPose[1] = calcAvg(curPose[0],calcAngle(negative(lines[5]),lines[1]));
  // rightShoulder-rightElbow-rightWrist
  curPose[2] = calcAngle(lines[2],lines[4]);
  // Avg(shoulder-elbow-wrist)
  curPose[3] = calcAvg(curPose[2],calcAngle(lines[1],lines[3]));

  // rightShoulder-rightHip-rightKnee
  curPose[4] = calcAngle(lines[6],lines[8]);
  // Avg(shoulder-hip-knee)
  curPose[5] = calcAvg(curPose[4],calcAngle(lines[5],lines[7]));
  // rightHip-rightKnee-rightAnkle
  curPose[6] = calcAngle(lines[8],lines[10]);
  // Avg(hip-knee-ankle)
  curPose[7] = calcAvg(curPose[6],calcAngle(lines[7],lines[9]));
  // vertical-rightHip-rightShoulder
  curPose[8] = calcAngle(lines[0],negative(lines[6]));
  // Avg(vertical-hip-shoulder)
  curPose[9] = calcAvg(curPose[8],calcAngle(lines[0],negative(lines[5])));
  // vertical-rightHip-rightAnkle
  curPose[10] = calcAngle(lines[0],lines[11]);
  
  return curPose;
}

/**
 * Pose Score decreases as the exercise approaches the key pose.
 * Called: every frame while rep detection is active.
 * @param angleWeights weight of each angle. 
 * @param {Float32Array} curPose 
 * @returns {Number} a score between 0 and 1, 0 being completely similar and 1 being completely different. -1 if curPose is missing crucial angle data.
 */
function poseScore (curPose) {
  let angleWeightSum = 0;
  let n = curPose.length;
  let score = 0;
  for (let i=0;i<n;i++) {
      angleWeightSum += Math.abs(angleWeights[i]);
  }
  if (angleWeightSum == 0) return -1;
  for (let i=0;i<n;i++) {
    if (angleWeights[i] == 0) continue;
    if (curPose[i] == 0) {
      // check if movenet missed out any useful keypoints, i.e. no value but have weight
      return -1;
    }
    score += (curPose[i]/3.141592) * (angleWeights[i]/angleWeightSum);
  }
  return score;
}

/**
 * Makes a line from 2 points
 * @param {Float32Array} point1 
 * @param {Float32Array} point2 
 * @returns {Float32Array} line from point1 to point2, (0,0) if the points cannot be calculated due to missing keypoint
 */
function makeLine (point1, point2) {
  if((point1[0] == 0 && point1[1] == 0) || point2[0] == 0 && point2[1] == 0) {
    return new Float32Array([0,0]);
  }
  let line = new Float32Array(2);
  for (let i=0;i<point1.length;i++) {
    line[i] = point2[i]-point1[i];
  }
  return line;
}

/**
 * Calculates angle between 2 lines
 * @param {Float32Array} line1 
 * @param {Float32Array} line2 
 * @returns {Number} angle between line1 and line2, 0 if the angle cannot be calculated due to missing line
 */
function calcAngle (line1, line2) {
    if((line1[0] == 0 && line1[1] == 0) || line2[0] == 0 && line2[1] == 0) {
        return 0;
    }
    // dot product
    let dotproduct = 0;
    for (let i=0;i<2;i++) {
      dotproduct += (-line1[i])*line2[i];
    }
    dotproduct /= normalise(line1)*normalise(line2);
    return Math.acos(dotproduct);
}

/**
 * Finds length of a line
 * @param {Float32Array} line 
 * @returns {Number} the length of a line
 */
function normalise (line) {
  if (line.length != 2) return -1; 
  return Math.sqrt((line[0]*line[0])+(line[1]*line[1]));
}

/**
 * Averages 2 angles
 * @param {Number} angle1 
 * @param {Number} angle2 
 * @returns {Number} average of 2 angles, one of the angles if the other is missing, or 0 if both are missing
 */
function calcAvg (angle1, angle2) {
    if (angle1 == 0) return angle2;
    if (angle2 == 0) return angle1;
    return (angle1+angle2)/2;
}

/**
 * Makes an arary negative
 * @param {Float32Array} x 
 * @returns {Float32Array} negative of the array
 */
function negative (x) {
  
  let n = x.length;
  let negArray = new Float32Array(n);
  for (let i=0;i<n;i++) {
    negArray[i] = -x[i];
  }
  return negArray;
}
// export {init, run, endExercise};


// TESTING
let poses = [
  {
    "keypoints": [
      {
        "y": 69.52367729127081,
        "x": 186.63367477308066,
        "score": 0.5444978475570679,
        "name": "nose"
      },
      {
        "y": 61.597360221973084,
        "x": 195.08695337372617,
        "score": 0.7064685225486755,
        "name": "left_eye"
      },
      {
        "y": 55.88409232753509,
        "x": 174.56805324018404,
        "score": 0.5697191953659058,
        "name": "right_eye"
      },
      {
        "y": 72.06205544463427,
        "x": 194.1997784122649,
        "score": 0.5603072643280029,
        "name": "left_ear"
      },
      {
        "y": 60.056053038314296,
        "x": 150.17739609139915,
        "score": 0.6972492933273315,
        "name": "right_ear"
      },
      {
        "y": 119.79348995538001,
        "x": 160.47749885969284,
        "score": 0.5561296939849854,
        "name": "left_shoulder"
      },
      {
        "y": 88.58037539977893,
        "x": 133.78118433572587,
        "score": 0.5602940320968628,
        "name": "right_shoulder"
      },
      {
        "y": 168.3826542449981,
        "x": 191.04759743762787,
        "score": 0.18914520740509033,
        "name": "left_elbow"
      },
      {
        "y": 133.0797189844008,
        "x": 157.56018510711408,
        "score": 0.4030657708644867,
        "name": "right_elbow"
      },
      {
        "y": 168.38144950492557,
        "x": 228.86717100467996,
        "score": 0.34634605050086975,
        "name": "left_wrist"
      },
      {
        "y": 166.0473228968742,
        "x": 219.4003420009317,
        "score": 0.28474849462509155,
        "name": "right_wrist"
      },
      {
        "y": 281.50184205376723,
        "x": 123.35098075835191,
        "score": 0.6203541159629822,
        "name": "left_hip"
      },
      {
        "y": 278.9049140145112,
        "x": 99.04878086515322,
        "score": 0.6430879831314087,
        "name": "right_hip"
      },
      {
        "y": 411.895289559206,
        "x": 134.02784881066515,
        "score": 0.6348431706428528,
        "name": "left_knee"
      },
      {
        "y": 416.5406029509747,
        "x": 128.27450339208062,
        "score": 0.6644710302352905,
        "name": "right_knee"
      },
      {
        "y": 488.2684469438569,
        "x": 118.14191007124955,
        "score": 0.1279437243938446,
        "name": "left_ankle"
      },
      {
        "y": 492.0787064394832,
        "x": 116.95150838489812,
        "score": 0.11944782733917236,
        "name": "right_ankle"
      }
    ],
    "score": 0.5565416046551296
  }
]

let poses2 = [
  {
    "keypoints": [
      {
        "y": 231.93804630871415,
        "x": 250.00208346268795,
        "score": 0.7300844788551331,
        "name": "nose"
      },
      {
        "y": 224.13925454486645,
        "x": 253.93464257224645,
        "score": 0.5041996240615845,
        "name": "left_eye"
      },
      {
        "y": 218.14129747462354,
        "x": 242.7401603783862,
        "score": 0.6808050274848938,
        "name": "right_eye"
      },
      {
        "y": 222.78104534039352,
        "x": 240.18712151053765,
        "score": 0.5812466144561768,
        "name": "left_ear"
      },
      {
        "y": 212.74273453845632,
        "x": 212.02470476653411,
        "score": 0.6882237792015076,
        "name": "right_ear"
      },
      {
        "y": 261.3818374678354,
        "x": 207.0616858531593,
        "score": 0.6083614826202393,
        "name": "left_shoulder"
      },
      {
        "y": 243.6715916628891,
        "x": 174.8425442871891,
        "score": 0.8638876080513,
        "name": "right_shoulder"
      },
      {
        "y": 282.90372271102774,
        "x": 254.13778456628617,
        "score": 0.44626322388648987,
        "name": "left_elbow"
      },
      {
        "y": 274.806314115478,
        "x": 242.65778343049558,
        "score": 0.5391309261322021,
        "name": "right_elbow"
      },
      {
        "y": 299.54262839368624,
        "x": 297.22921765570226,
        "score": 0.36011239886283875,
        "name": "left_wrist"
      },
      {
        "y": 295.9758377910364,
        "x": 296.2114137567055,
        "score": 0.4045466482639313,
        "name": "right_wrist"
      },
      {
        "y": 364.17733796632604,
        "x": 70.76850103998642,
        "score": 0.5397629141807556,
        "name": "left_hip"
      },
      {
        "y": 357.99254267802905,
        "x": 31.633269920595882,
        "score": 0.7953506708145142,
        "name": "right_hip"
      },
      {
        "y": 425.2229511475014,
        "x": 174.5737407996001,
        "score": 0.7538387775421143,
        "name": "left_knee"
      },
      {
        "y": 431.52585565456917,
        "x": 167.83198499054913,
        "score": 0.8070242404937744,
        "name": "right_knee"
      },
      {
        "y": 465.2266982759639,
        "x": 150.23799767473443,
        "score": 0.24152395129203796,
        "name": "left_ankle"
      },
      {
        "y": 467.4047998503088,
        "x": 156.6404746512352,
        "score": 0.28033655881881714,
        "name": "right_ankle"
      }
    ],
    "score": 0.5779234661775476
  }
]

resetAll();
processKeypoints(poses);
console.log(keypoints);
let pose = processData(keypoints);
let evalposes = new Array();
evalposes[1] = new Float32Array([0.,0.,0.,0.,1.65,0.,0.,0.,0.44,0.,0.]);
let angleweights = new Float32Array([0.,0.,0.,0.,1.,0.,0.,0.,-1.,0.,0.]);
let anglethresholds = new Array();
anglethresholds[1] = new Array(new Float32Array(2), new Float32Array(2), new Float32Array(2), new Float32Array(2), new Float32Array([0.14,0.13]), new Float32Array(2), new Float32Array(2), new Float32Array(2), new Float32Array([0.15,0]),new Float32Array(2), new Float32Array(2))
let glossaryy = new Array();
glossaryy[1] = [['',''],['',''],['',''],['',''],
['Squat not low enough','Squat too low'],
['',''],['',''],['',''],
['Leaning forward too much',''],
['',''],['','']];

init(evalposes,0.1,angleweights,anglethresholds,glossaryy);

console.log(run(poses));
console.log(run(poses2));
/*
let point1 = new Float32Array([2.0,2.0]);
console.log(point1);
let point2 = negative(point1);
console.log(point1);
console.log(point2);
let point3 = new Float32Array([4,3]);
let line1 = makeLine(point1,point3);
console.log(line1);
let line2 = ([5,4]);
let angle = calcAngle(line1,line2);
console.log(angle);
*/

