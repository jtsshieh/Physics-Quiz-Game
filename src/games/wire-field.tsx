import { css, cx } from '@styled-system/css';

import { ButtonArrows } from '@/components/button-arrows';
import { XYCurrent, ZCurrent } from '@/components/current';
import { Point } from '@/components/point';
import {
	DirectionVectors,
	Directions,
	allDirections,
	normalDirections,
	xDirections,
	xyDirections,
	yDirections,
} from '@/lib/direction-constants';
import { isXAxis, isYAxis, isZAxis } from '@/lib/direction-utils';
import { crossProduct, vecEq } from '@/lib/vector-utils';

import { RHRProblemType } from './interfaces';

export interface WireFieldState {
	currentDirection: number;
	radiusDirection: number;

	px: number;
	py: number;
}

export class WireField implements RHRProblemType<WireFieldState> {
	id = 'wire-field';
	name = 'Wire Field';
	description =
		'Determine the direction of the magnetic field at various points around a current carrying wire.';
	directions =
		'The wire or wire cross section below is carrying a current \\(I\\) in ' +
		'the specified direction. Select the direction of the magnetic field ' +
		'at Point \\(P\\).';

	getRadiiDirections(currentDirection: number) {
		if (isZAxis(currentDirection)) {
			return xyDirections;
		} else if (isXAxis(currentDirection)) {
			return yDirections;
		} else if (isYAxis(currentDirection)) {
			return xDirections;
		} else {
			return allDirections;
		}
	}

	getMaxX(currentDirection: number) {
		return isXAxis(currentDirection) ? 400 : 200;
	}

	getMaxY(currentDirection: number) {
		return isYAxis(currentDirection) ? 400 : 200;
	}

	resetState() {
		const currentDirection =
			normalDirections[Math.floor(Math.random() * normalDirections.length)];

		const radiiDirections = this.getRadiiDirections(currentDirection);
		const radiusDirection =
			radiiDirections[Math.floor(Math.random() * radiiDirections.length)];
		const radiusVector = DirectionVectors[radiusDirection];

		let px;
		let py;
		if (isZAxis(currentDirection)) {
			px = 100 + radiusVector[0] * 60;
			py = 100 + radiusVector[1] * -60;
		} else if (isXAxis(currentDirection)) {
			px = Math.random() * 200 + 100;
			py = 100 + radiusVector[1] * -50;
		} else if (isYAxis(currentDirection)) {
			px = 100 + radiusVector[0] * 50;
			py = Math.random() * 200 + 100;
		}
		return {
			currentDirection,
			radiusDirection,
			px,
			py,
		};
	}

	renderDiagram({ currentDirection, px, py }, ref) {
		return (
			<svg
				width="100%"
				height="100%"
				className={cx(
					isYAxis(currentDirection) && css({ maxH: '400px' }),
					isXAxis(currentDirection) && css({ maxW: '400px' }),
					isZAxis(currentDirection) && css({ maxH: '200px', maxW: '200px' }),
				)}
				ref={ref}
				viewBox={`0 0 ${this.getMaxX(currentDirection)} ${this.getMaxY(currentDirection)}`}
			>
				<defs>
					<marker
						id="arrow"
						viewBox="0 0 10 10"
						refX="5"
						refY="5"
						markerWidth="6"
						markerHeight="6"
						orient="auto-start-reverse"
					>
						<path d="M 0 0 L 10 5 L 0 10 z" />
					</marker>
				</defs>
				{(isXAxis(currentDirection) || isYAxis(currentDirection)) && (
					<XYCurrent
						currentDirection={currentDirection}
						otherCoordinate={100}
					/>
				)}

				{isZAxis(currentDirection) && (
					<ZCurrent currentDirection={currentDirection} otherCoordinate={100} />
				)}
				<Point x={px} y={py} name="P" />
			</svg>
		);
	}

	getAnswerChoices({ currentDirection, radiusDirection }) {
		const currentVector = DirectionVectors[currentDirection];
		const radiusVector = DirectionVectors[radiusDirection];

		const answer = crossProduct(currentVector, radiusVector);

		const [answerDirection] = Object.entries(DirectionVectors).find(
			([, vector]) => vecEq(answer, vector),
		) ?? [Directions.None.toString(), [0, 0, 0]];

		return Object.entries(ButtonArrows).map(([direction, component]) => ({
			element: component,
			correct: Number(answerDirection) === Number(direction),
			key: direction,
		}));
	}
}
