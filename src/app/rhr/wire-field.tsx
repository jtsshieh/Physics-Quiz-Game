import { RHRProblemType } from './interfaces';
import { css, cx } from '../../../styled-system/css';
import React from 'react';
import { ButtonArrows } from './common';
import { Directions, DirectionVectors } from '../../constants';
import { MathJax } from 'better-react-mathjax';
import { crossProduct, flip, vecEq } from '../../utils';
import { IntoPage, OutOfPage } from '../../components/vector-field';

interface WireFieldState {
	currentDirection: number;
	radiusDirection: number;

	px: number;
	py: number;
}

export class WireField implements RHRProblemType<WireFieldState> {
	id = 'wire-field';
	name = 'Wire Field';
	description =
		'Find the magnetic field at various points around a charged wire.';
	directions =
		'The wire or wire cross section below is carrying a current \\(I\\) in ' +
		'the specified direction. Select the direction of the magnetic field ' +
		'at Point \\(P\\).';

	resetState() {
		const currentDirection =
			Object.values(Directions)[
				Math.floor(Math.random() * (Object.keys(Directions).length - 1))
			];

		let radiusDirection;
		let px;
		let py;
		if (
			currentDirection === Directions.OutOfPage ||
			currentDirection === Directions.IntoPage
		) {
			radiusDirection =
				Object.values(Directions)[Math.floor(Math.random() * 4) + 2];
			const radiusVector = DirectionVectors[radiusDirection];
			px = 100 + radiusVector[0] * 60;
			py = 100 + radiusVector[1] * -60;
		} else if (
			currentDirection === Directions.Left ||
			currentDirection === Directions.Right
		) {
			radiusDirection =
				Object.values(Directions)[Math.floor(Math.random() * 2) + 4];
			const radiusVector = DirectionVectors[radiusDirection];
			px = Math.random() * 200 + 100;
			py = 100 + radiusVector[1] * -50;
		} else if (
			currentDirection === Directions.Up ||
			currentDirection === Directions.Down
		) {
			radiusDirection =
				Object.values(Directions)[Math.floor(Math.random() * 2) + 2];
			const radiusVector = DirectionVectors[radiusDirection];

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

	renderDiagram({ currentDirection, radiusDirection, px, py }) {
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
				viewBox={`0 0 ${isHorizontal ? 400 : 200} ${isVertical ? 400 : 200}`}
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
				{isVertical && (
					<>
						<polyline
							points={`100, ${currentDirection === Directions.Up ? 400 : 0}, 100, 200`}
							stroke="black"
							strokeWidth="2"
							markerEnd="url(#arrow)"
						/>
						<polyline
							points={`100, 200, 100, ${currentDirection === Directions.Up ? 0 : 400}`}
							stroke="black"
							strokeWidth="2"
						/>
					</>
				)}
				{isHorizontal && (
					<>
						<polyline
							points={`${currentDirection === Directions.Left ? 400 : 0}, 100, 200, 100 `}
							stroke="black"
							strokeWidth="2"
							markerEnd="url(#arrow)"
						/>
						<polyline
							points={`200, 100, ${currentDirection === Directions.Left ? 0 : 400}, 100`}
							stroke="black"
							strokeWidth="2"
						/>
					</>
				)}

				{!isVertical && !isHorizontal && (
					<>
						<circle cx={100} cy={100} r={25} stroke="black" fill="none" />
						{currentDirection === Directions.IntoPage ? (
							<IntoPage x={100} y={100} r={15} />
						) : (
							<OutOfPage x={100} y={100} r={15} />
						)}
					</>
				)}
				<Point x={px} y={py} name="P" />

				<foreignObject
					x={isVertical ? 100 : isHorizontal ? 175 : 120}
					y={isVertical ? 175 : isHorizontal ? 100 : 50}
					width="50"
					height="50"
				>
					<div
						className={cx(
							css({
								display: 'flex',
								flexDirection: 'column',
								width: '100%',
								height: '100%',
								p: 2,
								position: 'fixed',
								justifyContent: 'flex-end',
								alignItems: 'flex-start',
							}),
						)}
					>
						<MathJax inline={true}>{'\\(I\\)'}</MathJax>
					</div>
				</foreignObject>
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

function Point({ x, y, name }: { x: number; y: number; name: string }) {
	return (
		<>
			<circle cx={x} cy={y} r={5} />
			<foreignObject x={x} y={y - 25} width="50" height="50">
				<div
					className={cx(
						css({
							display: 'flex',
							flexDirection: 'column',
							width: '100%',
							height: '100%',
							p: 2,
							position: 'fixed',
							justifyContent: 'center',
						}),
					)}
				>
					<MathJax inline={true}>{`\\(${name}\\)`}</MathJax>
				</div>
			</foreignObject>
		</>
	);
}
