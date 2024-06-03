import { css, cx } from '@styled-system/css';
import { MathJax } from 'better-react-mathjax';

import { ButtonArrows } from '@/components/button-arrows';
import { XYCurrent, ZCurrent } from '@/components/current';
import { Point } from '@/components/point';
import { IntoPage, OutOfPage } from '@/components/vector-field';
import { DirectionVectors, Directions } from '@/lib/direction-constants';
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
		if (
			currentDirection === Directions.OutOfPage ||
			currentDirection === Directions.IntoPage
		) {
			return Object.values(Directions).slice(2, 6);
		} else if (
			currentDirection === Directions.Left ||
			currentDirection === Directions.Right
		) {
			return Object.values(Directions).slice(4, 6);
		} else if (
			currentDirection === Directions.Up ||
			currentDirection === Directions.Down
		) {
			return Object.values(Directions).slice(2, 4);
		} else {
			return Object.values(Directions);
		}
	}

	getMaxX(currentDirection: number) {
		return currentDirection === Directions.Left ||
			currentDirection === Directions.Right
			? 400
			: 200;
	}

	getMaxY(currentDirection: number) {
		return currentDirection === Directions.Up ||
			currentDirection === Directions.Down
			? 400
			: 200;
	}

	resetState() {
		const currentDirection =
			Object.values(Directions)[
				Math.floor(Math.random() * (Object.keys(Directions).length - 1))
			];

		const radiiDirections = this.getRadiiDirections(currentDirection);
		const radiusDirection =
			radiiDirections[Math.floor(Math.random() * radiiDirections.length)];
		const radiusVector = DirectionVectors[radiusDirection];

		let px;
		let py;
		if (
			currentDirection === Directions.OutOfPage ||
			currentDirection === Directions.IntoPage
		) {
			px = 100 + radiusVector[0] * 60;
			py = 100 + radiusVector[1] * -60;
		} else if (
			currentDirection === Directions.Left ||
			currentDirection === Directions.Right
		) {
			px = Math.random() * 200 + 100;
			py = 100 + radiusVector[1] * -50;
		} else if (
			currentDirection === Directions.Up ||
			currentDirection === Directions.Down
		) {
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
		const isVertical =
			currentDirection === Directions.Up ||
			currentDirection === Directions.Down;
		const isHorizontal =
			currentDirection === Directions.Left ||
			currentDirection === Directions.Right;

		return (
			<svg
				width="100%"
				height="100%"
				className={cx(
					isVertical && css({ maxH: '400px' }),
					isHorizontal && css({ maxW: '400px' }),
					!isHorizontal && !isVertical && css({ maxH: '200px', maxW: '200px' }),
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
				{(isVertical || isHorizontal) && (
					<XYCurrent
						currentDirection={currentDirection}
						otherCoordinate={100}
					/>
				)}

				{!isVertical && !isHorizontal && (
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
