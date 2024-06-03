import { css, cx } from '@styled-system/css';
import { MathJax } from 'better-react-mathjax';

import {
	ButtonArrows,
	NegativeCharge,
	PositiveCharge,
} from '@/components/button-arrows';
import VectorField from '@/components/vector-field';
import { DirectionVectors, Directions } from '@/lib/direction-constants';
import { crossProduct, flip, vecEq } from '@/lib/vector-utils';

import { RHRProblemType } from './interfaces';

interface ParticleLaunchState {
	vectorFieldDirection: number;
	particleCharge: boolean;
	particleVelocity: number;
}
export class ParticleLaunch implements RHRProblemType<ParticleLaunchState> {
	id = 'particle-launch';
	name = 'Particle Launch';
	description =
		'Determine the direction of magnetic force of a particle launched into a magnetic field.';
	directions =
		'A particle is being launched with velocity \\(v\\) towards a ' +
		'magnetic field labeled \\(\\mathbf{\\vec{B}}\\). Select the ' +
		'direction of magnetic force the particle will experience when ' +
		'initially entering the magnetic field.';

	resetState() {
		return {
			vectorFieldDirection:
				Object.values(Directions)[
					Math.floor(Math.random() * Object.keys(Directions).length)
				],
			particleCharge: Math.random() > 0.5,
			particleVelocity:
				Object.values(Directions)[Math.floor(Math.random() * 4) + 2],
		};
	}

	renderDiagram(
		{ vectorFieldDirection, particleCharge, particleVelocity },
		ref,
	) {
		const isVertical =
			particleVelocity == Directions.Up || particleVelocity == Directions.Down;

		const [circleX, circleY] = [
			isVertical ? 100 : particleVelocity === Directions.Left ? 150 : 50,
			!isVertical ? 100 : particleVelocity === Directions.Up ? 150 : 50,
		];
		const [lineEndX, lineEndY] = [
			isVertical ? 100 : particleVelocity == Directions.Right ? 150 : 50,
			!isVertical ? 100 : particleVelocity == Directions.Down ? 150 : 50,
		];

		return (
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="100%"
				height="100%"
				className={cx(
					isVertical && css({ maxH: '400px' }),
					!isVertical && css({ maxW: '400px' }),
				)}
				viewBox={`0 0 ${isVertical ? 200 : 400} ${isVertical ? 400 : 200}`}
				ref={ref}
			>
				<VectorField
					x={isVertical || particleVelocity === Directions.Left ? 0 : 200}
					y={!isVertical || particleVelocity === Directions.Up ? 0 : 200}
					direction={vectorFieldDirection}
				/>

				<svg
					x={isVertical || particleVelocity === Directions.Right ? 0 : 200}
					y={!isVertical || particleVelocity === Directions.Down ? 0 : 200}
					width="200"
					height="200"
				>
					<circle cx={circleX} cy={circleY} stroke="black" fill="none" r={10} />

					{particleCharge ? (
						<PositiveCharge x={circleX} y={circleY} />
					) : (
						<NegativeCharge x={circleX} y={circleY} />
					)}

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

					<line
						x1={100}
						y1={100}
						x2={lineEndX}
						y2={lineEndY}
						stroke="black"
						markerEnd="url(#arrow)"
					/>
					<foreignObject
						x={particleVelocity === Directions.Left ? lineEndX : 100}
						y={particleVelocity === Directions.Up ? lineEndY : 100}
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
								}),
								isVertical &&
									css({
										justifyContent: 'center',
									}),
								!isVertical &&
									css({
										alignItems: 'center',
									}),
							)}
						>
							<MathJax inline={true}>{'\\(v\\)'}</MathJax>
						</div>
					</foreignObject>
				</svg>
			</svg>
		);
	}

	getAnswerChoices({ vectorFieldDirection, particleCharge, particleVelocity }) {
		const fieldVector = DirectionVectors[vectorFieldDirection];
		const velocity = particleCharge
			? DirectionVectors[particleVelocity]
			: flip(DirectionVectors[particleVelocity]);

		const answer = crossProduct(velocity, fieldVector);

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
