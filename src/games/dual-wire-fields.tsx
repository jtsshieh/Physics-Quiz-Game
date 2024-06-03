import { css } from '@styled-system/css';

import { ButtonArrows } from '@/components/button-arrows';
import { XYCurrent, ZCurrent } from '@/components/current';
import { Point } from '@/components/point';
import {
	DirectionVectors,
	Directions,
	normalDirections,
	xDirections,
	xyDirections,
	yDirections,
	zDirections,
} from '@/lib/direction-constants';
import { isXAxis, isYAxis, isZAxis } from '@/lib/direction-utils';
import {
	crossProduct,
	flip,
	vecAdd,
	vecEq,
	vecMulByScalar,
	vecUnitify,
} from '@/lib/vector-utils';

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

	getPossibleCurrent2(currentDirection1: number) {
		if (isZAxis(currentDirection1)) {
			return [...zDirections];
		} else if (isYAxis(currentDirection1)) {
			return [...yDirections];
		} else if (isXAxis(currentDirection1)) {
			return [...xDirections];
		}
		return [];
	}

	resetState() {
		const currentDirection1 =
			normalDirections[Math.floor(Math.random() * normalDirections.length)];

		const possibleSecondCurrent = this.getPossibleCurrent2(currentDirection1);
		const possibleRadiusDirections = [Directions.None];

		let relCurrentDirection;

		let px;
		let py;
		if (isZAxis(currentDirection1)) {
			relCurrentDirection =
				xyDirections[Math.floor(Math.random() * xyDirections.length)];
			possibleRadiusDirections.push(
				...(isXAxis(relCurrentDirection) ? xDirections : yDirections),
			);
		} else if (isXAxis(currentDirection1)) {
			possibleRadiusDirections.push(...yDirections);
		} else if (isYAxis(currentDirection1)) {
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
			px = 200 + radiusVector[0] * 150;
			py = 200 + radiusVector[1] * -150;
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
				viewBox={`0 0 400 400`}
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
				{(isXAxis(currentDirection1) || isYAxis(currentDirection1)) && (
					<>
						<XYCurrent
							currentDirection={currentDirection1}
							otherCoordinate={125}
						/>
						<XYCurrent
							currentDirection={currentDirection2}
							otherCoordinate={275}
						/>
					</>
				)}

				{isZAxis(currentDirection1) && relCurrentDirection && (
					<>
						<ZCurrent
							currentDirection={currentDirection1}
							otherCoordinate={125}
							relCurrentDirection={relCurrentDirection}
						/>
						<ZCurrent
							currentDirection={currentDirection2}
							otherCoordinate={275}
							relCurrentDirection={relCurrentDirection}
						/>
					</>
				)}
				<Point x={px} y={py} name="P" />
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
