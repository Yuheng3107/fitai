export default function KeyStats() {
  return (
    <div
      id="user-stats"
      className="flex flex-row items-center justify-evenly w-full"
    >
      <div id="reps" className="flex flex-col items-center justify-evenly">
        <span className="text-xl font-semibold m-0">12.4k</span>
        <span className="text-l m-0">Repetitions</span>
      </div>
      <div id="perfect" className="flex flex-col items-center justify-evenly">
        <span className="text-xl font-semibold">94%</span>
        <span className="text-l">Perfect</span>
      </div>
      <div id="followers" className="flex flex-col items-center justify-evenly">
        <span className="text-xl font-semibold">69</span>
        <span className="text-l">Followers</span>
      </div>
    </div>
  );
}
