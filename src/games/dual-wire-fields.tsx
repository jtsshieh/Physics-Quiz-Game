import { css, cx } from '@styled-system/css';
import { MathJax, MathJaxBaseContext } from 'better-react-mathjax';
import { useContext, useEffect, useRef } from 'react';

import { ButtonArrows } from '@/components/button-arrows';
import { IntoPage, OutOfPage } from '@/components/vector-field';
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

				<BetterMathJax
					x={
						isYAxis(currentDirection1)
							? 135
							: isXAxis(currentDirection1)
								? 200
								: isXAxis(relCurrentDirection!)
									? 125
									: 220
					}
					y={
						isYAxis(currentDirection1)
							? 200
							: isXAxis(currentDirection1)
								? 140
								: isYAxis(relCurrentDirection!)
									? 65
									: 170
					}
					text={'I'}
				/>

				<BetterMathJax
					x={
						isYAxis(currentDirection1)
							? 285
							: isXAxis(currentDirection1)
								? 200
								: isXAxis(relCurrentDirection!)
									? 325
									: 220
					}
					y={
						isYAxis(currentDirection1)
							? 200
							: isXAxis(currentDirection1)
								? 290
								: isYAxis(relCurrentDirection!)
									? 265
									: 170
					}
					text="I"
				/>
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
			<BetterMathJax x={x + 5} y={y - 5} text={`${name}`} />
		</>
	);
}

function BetterMathJax({ text, x, y }: { text: string; x: number; y: number }) {
	const mjPromise = useContext(MathJaxBaseContext);
	const ref = useRef<SVGSVGElement>(null);

	useEffect(() => {
		if (mjPromise) {
			mjPromise.promise.then((mathJax) => {
				mathJax.startup.promise
					.then(() =>
						mathJax['tex2svgPromise'](text, {
							display: false,
						}),
					)
					.then((output) => {
						mathJax.startup.document.clear();
						mathJax.startup.document.updateDocument();
						// output.children[0].setAttribute('x', x);
						// output.children[0].setAttribute('y', y);
						if (ref.current)
							ref.current.outerHTML = output.children[0].outerHTML;
					});
			});
		}
	}, []);
	return (
		<svg x={x} y={y}>
			<svg ref={ref}></svg>
		</svg>
	);
}
