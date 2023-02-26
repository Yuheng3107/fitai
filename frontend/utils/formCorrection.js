/**
 * Storage for frames
 * @type {Float32Array(n,x)}
 * @param n number of selected frames
 * @param x key angles (11)
 */
let selectedFrames;

/**
 * Scores of each stored frame
 * @type {Float32Array(n)}
 * @param n number of selected frames
 */
let selectedFrameScores;

/**
 * The correct pose
 * @type {Float32Array(x)}
 */
let evalPose;

/**
 * Text descriptions of each angle mistake
 * @type {Array(x,two)}
 * @param x key angles (11)
 * @param two too large (0) or too small (1)
 */
let glossary;

/**
 * Whether in keypose (depreciated)
 * @type {boolean}
 */
let inPose;

/**
 * Weights that each angle should have in evaluation
 * @type {Float32Array(x)}
 */
let angleWeights;

/**
 * Differences in angle required for feedback to be given
 * @type {Float32Array(x,two)}
 * @param x key angles (11)
 * @param two too large (0) or too small (1)
 */
let angleThresholds;

/**
 * number of times angle was too small
 * @type {let32Array(x)} 
 */
let smallErrorCount;

/**
 * number of times angle was too large
 * @type {let32Array(x)}
 */
let largeErrorCount;

/**
 * number of perfect reps
 * @type {let}
 */
let perfectReps;

/**
 * evaluates the similarity between the current pose (curPose)
    and the crucial pose (evalPose) to decide whether or not to select the frame.
    If it selects the frame, it will then compare the current pose to ideal pose, 
    then store the angleDifferences to be processed when the rep is completed.
    It also evaluates the emotions of the user to determine level of workout.
 * @param {Float32Array} keypoints keypoints detected by MoveNet
 * @param {int} height height of img
 * @param {int} width width of img
 * @returns {idek} something
 */
function run(keypoints, height, width) {
  let curPose = processData(keypoints,height,width);
  let score = poseScore(curPose);
  if (score == -1) {
    invalidFrameCount += 1;
    if (invalidFrameCount > 6) return ["Position Self in Frame"];
    return [];
  }
  let frameStatus = shouldSelectFrames(score);
  return [];
}

/**
 * Resets the stored angle data for that rep.
 * Called: when a rep is finished.
 */
function resetFrames () {
  selectedFrames = new Float32Array();
  selectedFrameScores = new Float32Array();
}

/**
 * Resets all exercise-related variables.
 * Called: when new exercise begins
*/
function resetAll () {
  resetFrames();
  smallErrorCount = initArray();
  largeErrorCount = initArray();
  perfectReps = 0;
  invalidFrameCount = 0;
  switchPoseCount = 0;
}
/**
 * Initialises a new array of size keyAngles
 * @returns {Float32Array} Array with size keyAngles
 */
function initArray() {
  return new Float32Array(0,0,0,0,0,0,0,0,0,0,0);
}

/*
EXERCISE METHODS
These methods are called once per exercise.
*/

/**
 * Initialises all necessary values for the exercise from the backend
 * @param {Float32Array} evalpose The correct pose
 * @param {Float32Array} angleweights Weights that each angle should have in evaluation
 * @param {Float32Array} anglethresholds Differences in angles required for feedback to be given 
 * @param {Array} glossaryy Text descriptions of each mistake
 */
function init (evalpose, angleweights, anglethresholds, glossaryy) {
  evalPose = evalpose;
  angleWeights = angleweights;
  angleThresholds = anglethresholds;
  glossary = glossaryy;
  resetAll();
}
/**
 * Used to convert the rep feedback leto a feedback summary for the user.
 * Called: when exercise is finished. 
 * @enum smallErrorCount
 * @enum largeErorrCount
 * @enum feedback
 * @returns {string} feedback for that rep
 */
function summariseFeedback() {
  let feedback =  "";
  feedback.push(repCount.toString() + " reps completed. ");
  let n = smallErrorCount.length;
  for (let i=0;i<n;i++) {
      if (smallErrorCount[i] != 0) {
          feedback += glossary[i][0] + " " + smallErrorCount[i].toString() + " times. ";
      }
      if (largeErrorCount[i] != 0) {
          feedback += glossary[i][1] + " " + largeErrorCount[i].toString() + " times. ";
      }
  }
  feedback += perfectReps.toString() + " perfect reps.";
  return feedback;
}

/*
REP methods
These methods are called once per rep.
*/
/**
 * Changes inPose to being in rest pose, gets the feedback for the rep, then deletes all frame data of the rep.
 * Called: when rep is finished.
 * @enum inPose
 */
function finishRep() {
  let angleDifferences = compareAngles();
  repFeedback.push(giveFeedback(angleDifferences));
  resetFrames();
  
  inPose = false;
    switchPoseCount = 0;
}

/**
 * Changes inPose to being in key pose
 * Called: when user enters the key pose (at the middle of the rep).
 * depreciated?
 */
function middleOfRep() {
  //depreciated
}

/**
 * Used to process angle data leto text feedback to feed to front-end
 * Called: when rep is finished.
 * @param {Float32Array(x)} angleDifferences angle differences, positive is too large, negative is too small, 0 is no significant difference
 * @returns {string} errors made in rep
 */
function giveFeedback(angleDifferences) {
  let feedback = "Rep " + repcount.toString() + ": ";
  let hasError = false;
  if (angleDifferences[0] == -99) {
    feedback += "No Frames Detected. ";
    return feedback;
  }
  let n = angleDifferences.length;
  for (let i=0;i<n;i++) {
    if (angleDifferences[i] == 0) continue;
    if (angleDifferences[i] > 0) {
      smallErrorCount[i] += 1;
      feedback += glossary[i][0] + ". ";
      hasError = true;
    }
    if (angleDifferences[i] < 0) {
      largeErrorCount[i] += 1;
      feedback += glossary[i][1] + ". ";
      hasError = true;
    }
  }
  if (!hasError) {
    perfectReps += 1;
    feedback += "Perfect! ";
  }
  return feedback;
}

/**
 * Calculates the difference between ideal and observed angles in user's pose
 * Called: when rep is finished.
 * @enum evalPose
 * @enum angleThresholds
 * @enum selectedFrames
 * @param {Float32Array(11)} curPose the current pose detected by the camera.
 * @returns 
 */
function compareAngles(curPose) {
  let n = evalPose.length;
  if (selectedFrames.length == 0) {
    return new Float32Array(-99);
  }
  
  let differences = new Float32Array();
  // sum frames
  for (let i=0;i<selectedFrames.length;i++) {
    for (let j=0;j<n;j++) {
      differences[j] += selectedFrames[i][j];
    }
  }
  for (let i=0;i<n;i++) {
    // average frames
    differences[i] /= selectedFrames.length;
    // finding difference
    differences[i] -= evalPose[i];
    // 0 if +ve, 1 if -ve
    let x = 0;
    if (differences[i]<0) x = 1;
    if (angleThresholds[i][x] == 0) continue;
    // check threshold
    if (Math.abs(differences[i]) < angleThresholds[i][x]) {
      differences[i] = 0;
    }
  }
  return differences;
}

/**
 * DEPRECIATED;
 * Evaluates if rep time is too short
 * Called: when rep is finished
 * @param {*} evalTime 
 * @param {*} repTime 
 * @returns {int} 1 or 0
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
 * DEPRECIATED;
 * Used to determine whether to select a frame to be used for evaluation of errors.
 * Called: every frame while rep detection is active.
 * @emun scoreThreshold
 * @param {float} score score returned by comparePoses, 0 being completely similar and 1 being completely different.
 * @returns 1 if selected, 0 if not selected, -1 if invalid
 */
function shouldSelectFrames (score) {
  if (score == -1) {
    return -1;
  }
  // REWRITE
  return 0;
}

/**
 * Used to change between user being in a key pose and rest pose. If user is in key pose, add valid frames to selectedFrames.
 * Called: every frame while rep detection is active.
 * @param {Float32Array(x)} curPose the current pose detected by the camera.
 */
function checkPose (curPose) {

  return {};

}

/**
 * Used to convert keypoint data into angle data
 * Called: every frame while rep detection is active.
 * @param {Array} keypoints keypoints detected by MoveNet
 * @param {int} height height of img
 * @param {int} width width of img
 * @returns {Float32Array} angle data of the pose
 */
function processData (keypoints, height, width) {
  if (keypoints.length != 17 || keypoints[0].length != 2) {
    return initArray();
  }
  let n = keypoints.length;
  for (let i=0;i<n;i++) {
    keypoints[i][0] *= (width-1);
    keypoints[i][1] *= (height-1);
  }
  let lines = new Array();
  // vertical
  lines[0] = new Float32Array(0,1);

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
  let curPose = new Float32Array();

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
 * Used to determine what state of the pose user is currently in.
 * Called: every frame while rep detection is active.
 * @enum angleWeights
 * @param {Float32Array} curPose 
 * @returns {float} a score between 0 and 1, 0 being completely similar and 1 being completely different. -1 if curPose is missing crucial angle data.
 */
function poseScore (curPose) {
  let angleWeightSum = 0;
  let n = curPose.length;
  let score = 0;
  for (let i=0;i<n;i++) {
      angleWeightSum += angleWeights[i];
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
 * @param {float} point1 
 * @param {float} point2 
 * @returns {Float32Array} line from point1 to point2, (0,0) if the points cannot be calculated due to missing keypoint
 */
function makeLine (point1, point2) {
  if((point1[0] == 0 && point1[1] == 0) || point2[0] == 0 && point2[1] == 0) {
      return new Float32Array(0,0);
  }
  let line = new Float32Array();
  for (let i=0;i<point1.length;i++) {
      line[i] = point2[i]-point1[i];
  }
  return line;
}

/**
 * Calculates angle between 2 lines
 * @param {Float32Array} line1 
 * @param {Float32Array} line2 
 * @returns {float} angle between line1 and line2, 0 if the angle cannot be calculated due to missing line
 */
function calcAngle (line1, line2) {
    if((line1[0] == 0 && line1[1] == 0) || line2[0] == 0 && line2[1] == 0) {
        return 0;
    }
    // dot product
    let dotproduct = 0;
    for (let i=0;i<2;i++) {
      dotproduct += line1[i]*line2[i];
    }
    angle /= normalise(line1)*normalise(line2);
    return Math.acos(angle);
}

/**
 * Finds length of a line
 * @param {Float32Array} line 
 * @returns {float} the length of a line
 */
function normalise (line) {
  if (line.length != 2) return -1; 
  return Math.sqrt((line[0]*line[0])+(line[1]*line[1]));
}

/**
 * Averages 2 angles
 * @param {*} angle1 
 * @param {*} angle2 
 * @returns {float} average of 2 angles, one of the angles if the other is missing, or 0 if both are missing
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
    for (let i=0;i<n;i++) {
        x[i] = -x[i];
    }
    return x;
}