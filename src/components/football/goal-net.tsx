/** Decorative goal at the end of the ball journey. BallJourney sets data-goal="scored" on arrival. */
export function GoalNet() {
  const verticals = [30, 50, 70, 90, 110, 130, 150, 170, 190];
  const horizontals = [30, 50, 70, 90];
  return (
    <div data-ball-goal aria-hidden="true" className="goal-net relative isolate mx-auto mt-20 w-[220px]">
      <svg viewBox="0 0 220 120" className="w-full overflow-visible">
        <g className="goal-mesh stroke-muted" strokeWidth="1.5">
          {verticals.map((x) => (
            <line key={`v${x}`} x1={x} y1="12" x2={x} y2="118" />
          ))}
          {horizontals.map((y) => (
            <line key={`h${y}`} x1="12" y1={y} x2="208" y2={y} />
          ))}
        </g>
        <path d="M10 119V10h200v109" className="fill-none stroke-ink" strokeWidth="6" strokeLinejoin="round" />
        <line x1="0" y1="119" x2="220" y2="119" className="stroke-ink" strokeWidth="3" />
      </svg>
      <div className="goal-lines speed-lines-accent pointer-events-none absolute -inset-[45%] -z-10" />
      <span className="goal-label impact absolute -top-10 left-1/2 -ml-24 w-48 text-center text-3xl [-webkit-text-stroke-width:5px]">GOAL!!</span>
    </div>
  );
}
