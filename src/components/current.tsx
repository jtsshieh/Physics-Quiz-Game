import { Directions } from '@/lib/direction-constants';
import { isXAxis, isYAxis } from '@/lib/direction-utils';

import { BetterMathJax } from './better-math-jax';
import { IntoPage, OutOfPage } from './vector-field';

export function XYCurrent({
	currentDirection,
	otherCoordinate,
}: {
	currentDirection: number;
	otherCoordinate: number;
}) {
	if (isYAxis(currentDirection)) {
		return (
			<>
				<polyline
					points={`${otherCoordinate}, ${currentDirection === Directions.Up ? 400 : 0}, ${otherCoordinate}, 200`}
					stroke="black"
					strokeWidth="2"
					markerEnd="url(#arrow)"
				/>
				<polyline
					points={`${otherCoordinate}, 200, ${otherCoordinate}, ${currentDirection === Directions.Up ? 0 : 400}`}
					stroke="black"
					strokeWidth="2"
				/>
				<BetterMathJax x={otherCoordinate + 10} y={200} text="I" />
			</>
		);
	} else if (isXAxis(currentDirection)) {
		return (
			<>
				<polyline
					points={`${currentDirection === Directions.Left ? 400 : 0}, ${otherCoordinate}, 200, ${otherCoordinate} `}
					stroke="black"
					strokeWidth="2"
					markerEnd="url(#arrow)"
				/>
				<polyline
					points={`200, ${otherCoordinate}, ${currentDirection === Directions.Left ? 0 : 400}, ${otherCoordinate}`}
					stroke="black"
					strokeWidth="2"
				/>
				<BetterMathJax x={200} y={otherCoordinate + 15} text="I" />
			</>
		);
	} else {
		throw new Error('Current direction must be vertical or horizontal');
	}
}

export function ZCurrent({
	currentDirection,
	otherCoordinate,
	relCurrentDirection,
}: {
	currentDirection: number;
	otherCoordinate: number;
	relCurrentDirection?: number;
}) {
	const x = relCurrentDirection
		? isXAxis(relCurrentDirection)
			? otherCoordinate
			: 200
		: 100;
	const y = relCurrentDirection
		? isYAxis(relCurrentDirection)
			? otherCoordinate
			: 200
		: 100;
	return (
		<>
			<circle cx={x} cy={y} r={25} stroke="black" fill="none" />

			{currentDirection === Directions.IntoPage ? (
				<IntoPage x={x} y={y} r={15} />
			) : (
				<OutOfPage x={x} y={y} r={15} />
			)}
			<BetterMathJax x={x + 30} y={y - 30} text="I" />
		</>
	);
}
