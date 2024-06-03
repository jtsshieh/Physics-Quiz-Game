import { css, cx } from '@styled-system/css';
import { MathJax } from 'better-react-mathjax';

import { IntoPage, OutOfPage } from '@/components/vector-field';
import {
	DirectionVectors,
	Directions,
	normalDirections,
	xDirections,
	xyDirections,
	yDirections,
	zDirections,
} from '@/utils/direction-constants';
import { isXAxis, isYAxis, isZAxis } from '@/utils/direction-utils';
import {
	crossProduct,
	flip,
	vecAdd,
	vecEq,
	vecMulByScalar,
	vecUnitify,
} from '@/utils/vector-utils';

import { ButtonArrows } from './common';
import { RHRProblemType } from './interfaces';

export interface DualWireFieldsState {
	currentDirection1: number;
	currentDirection2: number;

	relCurrentDirection?: number;

	radiusDirection: number;

	px: number;
	py: number;
}

export class DualWireFields implements RHRProblemType<DualWireFieldsState> {
	id = 'dual-wire-fields';
	name = 'Dual Wire Fields';
	description =
		'Determine the direction of the magnetic field at various points around two current carrying wires.';
	directions =
		'Each wire or wire cross section below is carrying a current \\(I\\) in ' +
		'the specified direction. Select the direction of the magnetic field ' +
		'at Point \\(P\\). Pay close attention to the distances between the ' +
		'wires and the points as they may affect the magnitude of the magnetic ' +
		'field.';

	getMaxX(currentDirection: number) {
		return isYAxis(currentDirection) ? 400 : 400;
	}

	getMaxY(currentDirection: number) {
		return isXAxis(currentDirection) ? 400 : 400;
	}

	resetState() {
		const currentDirection1 =
			normalDirections[Math.floor(Math.random() * normalDirections.length)];

		const possibleSecondCurrent: number[] = [];
		const possibleRadiusDirections = [Directions.None];

		let relCurrentDirection;

		let px;
		let py;
		if (isZAxis(currentDirection1)) {
			possibleSecondCurrent.push(...zDirections);

			relCurrentDirection =
				xyDirections[Math.floor(Math.random() * xyDirections.length)];
			possibleRadiusDirections.push(
				...(isXAxis(relCurrentDirection) ? xDirections : yDirections),
			);
		} else if (isXAxis(currentDirection1)) {
			possibleSecondCurrent.push(...xDirections);
			possibleRadiusDirections.push(...yDirections);
		} else if (isYAxis(currentDirection1)) {
			possibleSecondCurrent.push(...yDirections);
			possibleRadiusDirections.push(...xDirections);
		}

		const currentDirection2 =
			possibleSecondCurrent[
				Math.floor(Math.random() * possibleSecondCurrent.length)
			];

		const radiusDirection =
			possibleRadiusDirections[
				Math.floor(Math.random() * possibleRadiusDirections.length)
			];

		const radiusVector = DirectionVectors[radiusDirection];

		if (isZAxis(currentDirection1)) {
			px = 200 + radiusVector[0] * 175;
			py = 200 + radiusVector[1] * -175;
		} else if (isXAxis(currentDirection1)) {
			px = Math.random() * 200 + 100;
			py = 200 + radiusVector[1] * -150;
		} else if (isYAxis(currentDirection1)) {
			px = 200 + radiusVector[0] * 150;
			py = Math.random() * 200 + 100;
		}

		return {
			currentDirection1,
			currentDirection2,

			relCurrentDirection,

			radiusDirection,
			px,
			py,
		};
	}

	renderDiagram(
		{
			currentDirection1,
			currentDirection2,
			relCurrentDirection,
			px,
			py,
		}: DualWireFieldsState,
		ref,
	) {
		return (
			<svg
				width="100%"
				height="100%"
				className={css({ maxH: '400px', maxW: '400px' })}
				ref={ref}
				viewBox={`0 0 ${this.getMaxX(currentDirection1)} ${this.getMaxY(currentDirection1)}`}
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
				{isXAxis(currentDirection1) && (
					<>
						<polyline
							points={`${currentDirection1 === Directions.Left ? 400 : 0}, 125, 200, 125 `}
							stroke="black"
							strokeWidth="2"
							markerEnd="url(#arrow)"
						/>
						<polyline
							points={`200, 125, ${currentDirection1 === Directions.Left ? 0 : 400}, 125`}
							stroke="black"
							strokeWidth="2"
						/>

						<polyline
							points={`${currentDirection2 === Directions.Left ? 400 : 0}, 275, 200, 275 `}
							stroke="black"
							strokeWidth="2"
							markerEnd="url(#arrow)"
						/>
						<polyline
							points={`200, 275, ${currentDirection2 === Directions.Left ? 0 : 400}, 275`}
							stroke="black"
							strokeWidth="2"
						/>
					</>
				)}
				{isYAxis(currentDirection1) && (
					<>
						<polyline
							points={`125, ${currentDirection1 === Directions.Up ? 400 : 0}, 125, 200`}
							stroke="black"
							strokeWidth="2"
							markerEnd="url(#arrow)"
						/>
						<polyline
							points={`125, 200, 125, ${currentDirection1 === Directions.Up ? 0 : 400}`}
							stroke="black"
							strokeWidth="2"
						/>

						<polyline
							points={`275, ${currentDirection2 === Directions.Up ? 400 : 0}, 275, 200`}
							stroke="black"
							strokeWidth="2"
							markerEnd="url(#arrow)"
						/>
						<polyline
							points={`275, 200, 275, ${currentDirection2 === Directions.Up ? 0 : 400}`}
							stroke="black"
							strokeWidth="2"
						/>
					</>
				)}

				{isZAxis(currentDirection1) && relCurrentDirection && (
					<>
						<circle
							cx={isXAxis(relCurrentDirection) ? 100 : 200}
							cy={isYAxis(relCurrentDirection) ? 100 : 200}
							r={25}
							stroke="black"
							fill="none"
						/>

						{currentDirection1 === Directions.IntoPage ? (
							<IntoPage
								x={isXAxis(relCurrentDirection) ? 100 : 200}
								y={isYAxis(relCurrentDirection) ? 100 : 200}
								r={15}
							/>
						) : (
							<OutOfPage
								x={isXAxis(relCurrentDirection) ? 100 : 200}
								y={isYAxis(relCurrentDirection) ? 100 : 200}
								r={15}
							/>
						)}

						<circle
							cx={isXAxis(relCurrentDirection) ? 300 : 200}
							cy={isYAxis(relCurrentDirection) ? 300 : 200}
							r={25}
							stroke="black"
							fill="none"
						/>
						{currentDirection2 === Directions.IntoPage ? (
							<IntoPage
								x={isXAxis(relCurrentDirection) ? 300 : 200}
								y={isYAxis(relCurrentDirection) ? 300 : 200}
								r={15}
							/>
						) : (
							<OutOfPage
								x={isXAxis(relCurrentDirection) ? 300 : 200}
								y={isYAxis(relCurrentDirection) ? 300 : 200}
								r={15}
							/>
						)}
					</>
				)}
				<Point x={px} y={py} name="P" />

				<foreignObject
					x={
						isYAxis(currentDirection1)
							? 125
							: isXAxis(currentDirection1)
								? 175
								: isXAxis(relCurrentDirection!)
									? 120
									: 220
					}
					y={
						isYAxis(currentDirection1)
							? 175
							: isXAxis(currentDirection1)
								? 125
								: isYAxis(relCurrentDirection!)
									? 45
									: 150
					}
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
				<foreignObject
					x={
						isYAxis(currentDirection1)
							? 275
							: isXAxis(currentDirection1)
								? 175
								: isXAxis(relCurrentDirection!)
									? 320
									: 220
					}
					y={
						isYAxis(currentDirection1)
							? 175
							: isXAxis(currentDirection1)
								? 275
								: isYAxis(relCurrentDirection!)
									? 250
									: 150
					}
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

	getAnswerChoices({
		currentDirection1,
		currentDirection2,

		relCurrentDirection,

		radiusDirection,
	}: DualWireFieldsState) {
		const currentVector1 = DirectionVectors[currentDirection1];
		const currentVector2 = DirectionVectors[currentDirection2];

		const radiusVector = DirectionVectors[radiusDirection];

		const headDirectionVector =
			DirectionVectors[
				isXAxis(currentDirection1)
					? Directions.Down
					: isYAxis(currentDirection1)
						? Directions.Right
						: isXAxis(relCurrentDirection!)
							? Directions.Right
							: Directions.Down
			];

		const currentVector1Radius =
			radiusDirection === Directions.Left || radiusDirection === Directions.Up
				? radiusVector
				: radiusDirection === Directions.None
					? headDirectionVector
					: vecMulByScalar(radiusVector, 1 / 3);

		const currentVector2Radius =
			radiusDirection === Directions.Right ||
			radiusDirection === Directions.Down
				? radiusVector
				: radiusDirection === Directions.None
					? flip(headDirectionVector)
					: vecMulByScalar(radiusVector, 1 / 3);

		const field1 = crossProduct(currentVector1, currentVector1Radius);
		const field2 = crossProduct(currentVector2, currentVector2Radius);

		const totalField = vecUnitify(vecAdd(field1, field2));

		const [answerDirection] = Object.entries(DirectionVectors).find(
			([, vector]) => vecEq(totalField, vector),
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
