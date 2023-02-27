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
 * @type {Array(3,x)}
 * @param three 0: keypose, 1: start->mid, 2: mid->end
 */
let evalPoses;

/**
 * Text descriptions of each angle mistake
 * @type {Array(3,x,2)}
 * @param three 0: keypose, 1: start->mid, 2: mid->end
 * @param x key angles (11)
 * @param two too large (0) or too small (1)
 */
let glossary;

/**
 * Scores below this threshold will be selected
 * @type {Number}
 */
let scoreThreshold;

/**
 * Acceptable range of values for mid part of exercise to be within
 * @type {Number}
 */
let scoreDeviation;

/**
 * Weights that each angle should have in evaluation. 
 * Positive for angles that decrease as the exercise approaches the key pose, negative if vice versa.
 * @type {Float32Array(x)}
 */
let angleWeights;

/**
 * Differences in angle required for feedback to be given
 * @type {Float32Array(3,x,2)}
 * @param three 0: keypose, 1: start->mid, 2: mid->end
 * @param x key angles (11)
 * @param two too large (0) or too small (1)
 */
let angleThresholds;

/*--------------------
FEEDBACK VARIABLES
--------------------*/
/**
 * number of times angle was too small
 * @type {Array(3,x)} 
 * @param three 0: keypose, 1: start->mid, 2: mid->end
 * @param x key angles (11)
 */
let smallErrorCount;

/**
 * number of times angle was too large
 * @type {Array(3,x)}
 * @param three 0: keypose, 1: start->mid, 2: mid->end
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
 * @param {Array} poses Raw Array given by MoveNet
 * @returns {String} String that is feedback
 */
function run(poses) {
  // check for empty
  if (poses.length == 0) {
    return "";
  }

  processKeypoints(poses);
  let curPose = processData(keypoints);
  let score = poseScore(curPose);
  console.log(score);
  if (score == -1) {
    return "Position Self in Frame";
  }
  
  // check pose switching
  let repStatus = checkScore(score, curPose);
  if (repStatus == true) {
    finishRep();
    return repFeedback;
  }
  return "";
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
  minScore = 1;
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
 * @param {Number} scorethreshold Scores below this threshold will be selected
 * @param {Number} scoredeviation Acceptable range of values for mid part of exercise to be within
 * @param {Float32Array} angleweights Weights that each angle should have in evaluation
 * @param {Float32Array} anglethresholds Differences in angles required for feedback to be given 
 * @param {Array} glossaryy Text descriptions of each mistake
 */
function init (evalposes, scorethreshold, scoredeviation, angleweights, anglethresholds, glossaryy) {
  evalPoses = evalposes;
  scoreThreshold = scorethreshold;
  scoreDeviation = scoredeviation;
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
 * @returns {String} feedback
 */
function finishRep() {
  repCount += 1;
  if (frameArray.length == 0) return "No Frames Detected";
  let feedback = ""

  // keypose
  let midExerciseFrames = splitFrames(minFrame);
  console.log("exerciseFrames: ");
  console.log(midExerciseFrames);
  console.log("min frame: %d %d", minScore, frameArray[minFrame]);
  console.log("frameArray: ");
  console.log(frameArray);

  let angleDifferences = compareAngles(midExerciseFrames, evalPoses[0], angleThresholds[0]);
  feedback += giveFeedback(angleDifferences, 0);

  // start->mid
  if (midExerciseFrames[0]>0) {
    let startExerciseFrames = new Uint8Array([0, midExerciseFrames[0]-1]);
    angleDifferences = compareAngles(startExerciseFrames, evalPoses[1], angleThresholds[1]);
    feedback += giveFeedback(angleDifferences, 1);
  }

  // mid->end
  if (midExerciseFrames[1]<frameCount-1) {
    let endExerciseFrames = new Uint8Array([midExerciseFrames[1]+1, frameCount-1]);
    angleDifferences = compareAngles(endExerciseFrames, evalPoses[2], angleThresholds[2]);
    feedback += giveFeedback(angleDifferences, 2);    
  }

  if (feedback == "") {
    feedback += "Perfect!";
    perfectReps += 1;
  }
  let finalFeedback = "Rep " + repCount.toString() + ": " + feedback;
  // tell backend?
  console.log(finalFeedback);

  resetFrames();
  return finalFeedback;
}

/**
 * Selects frames close enough to the centre frame.
 * @param {Number} centre number of centre frame
 * @param {Number} scoreDeviation Acceptable rate of change for mid part of exercise to be within
 */
function splitFrames(centre) {
  // this is lazy af
  let i = centre+1;
  if (i >= frameCount) i = frameCount-1;
  for (;i<frameCount;i++) {
    if (Math.abs(frameScores[i] - frameScores[centre]) > scoreDeviation) break;
  }
  if (i >= frameCount) i = frameCount-1;

  let j = centre-1;
  if (j < 0) j = 0;
  for (;j>=0;j--) {
    if (Math.abs(frameScores[j] - frameScores[centre]) > scoreDeviation) break;
  }
  if (j < 0) j = 0;

  return new Uint8Array([j,i]);
}
/**
 * Used to process angle data leto text feedback to feed to front-end
 * Called: when rep is finished.
 * @param {Float32Array} angleDifferences angle differences, positive is too large, negative is too small, 0 is no significant difference
 * @param {Number} state 0: keypose, 1: start->mid, 2: mid->end
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
  for (let i=range[0];i<=range[1];i++) {
    for (let j=0;j<n;j++) {
      differences[j] += frameArray[i][j];
    }
  }
  console.log("frames selected: %d", range[1]-range[0]+1);
  console.log("differences:");
  for (let i=0;i<n;i++) {
    // skip if no angleThreshold
    if (angleThreshold[i][x] == 0) differences[i] = 0;
    // average frames
    differences[i] /= (range[1]-range[0]+1);
    // finding difference
    differences[i] -= evalPose[i];
    console.log(differences[i]);
    // 0 if +ve, 1 if -ve
    let x = 0;
    if (differences[i]<0) x = 1;
    
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
 * @param {Number} scoreThreshold Scores below this threshold will be selected
 * @param {Number} poseStatus 0: start->mid, 1: mid->end
 * @returns {Boolean} false: nothing, true: end of rep
 */
function checkScore (score, curPose) {
  if (score == -1) return false;
  if (score < minScore) {
    minScore = score;
    minFrame = frameCount;
  }

  if (score < scoreThreshold) {
    selectFrame(curPose, score);

    // Currently in rest pose
    if (poseStatus == 0) {
      switchPoseCount += 1;
      if (switchPoseCount >= 5) {
        // switch to key pose
        switchPoseCount = 0;
        poseStatus = 1;
      }
      return false;
    }

    // Currently in key pose
    if (poseStatus == 1) {
      switchPoseCount = 0;
      return false;
    }
  }

  if (score >= scoreThreshold) {
    // Currently in rest pose
    if (poseStatus == 0) {
      switchPoseCount = 0;
      return false;
    }

    // Currently in key pose
    if (poseStatus == 1) {
      switchPoseCount += 1;
      if (switchPoseCount >= 5) {
        // End of rep
        switchPoseCount = 0;
        poseStatus = 0;
        return true;
      }
      return false;
    }
  }
}

/**
 * Selects frames to put inside frameArray
 * @param {Float32Array} curPose current pose detected by MoveNet
 * @param {Number} score score of current pose
 * @returns {Boolean} true if successful.
 */
function selectFrame(curPose, score) {
  if (frameCount >= 1000) {
    console.log("Frames Maxed!");
    return false;
  }
  frameArray.push(curPose);
  frameScores[frameCount] = score;
  frameCount += 1;
  return true;
}

/**
 * Processes raw array given by MoveNet, checks poseThreshold.
 * @param {Array} poses Raw Array given by MoveNet
 * @returns {Array} processed keypoints, (-1,-1) if invalid
 */
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
    if (angleWeights[i] < 0) {
      score += (1-(curPose[i]/3.141592)) * (-angleWeights[i]/angleWeightSum);
      continue;
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
export {init, run, endExercise};

