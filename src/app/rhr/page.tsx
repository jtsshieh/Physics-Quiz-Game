'use client';

import { ResultModal } from '../../components/result-modal';
import React, { useState } from 'react';
import { Button, IconButton, Typography } from '@mui/joy';
import { Directions, DirectionVectors } from './constants';
import { MathJax } from 'better-react-mathjax';
import VectorField, {
	HorizontalArrow,
	IntoPage,
	OutOfPage,
	VerticalArrow,
} from '../../components/vector-field';
import { crossProduct, flip, vecEq } from '../../utils';
import Link from 'next/link';
import { css, cx } from '../../../styled-system/css';
import { stack } from '../../../styled-system/patterns';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Settings } from '@mui/icons-material';
import { erase } from 'sisteransi';
import lineEnd = erase.lineEnd;

const ArrowDirections = {
	[Directions.IntoPage]: (
		<svg width="50" height="50">
			<IntoPage x={25} y={25} />
		</svg>
	),

	[Directions.OutOfPage]: (
		<svg width="50" height="50">
			<OutOfPage x={25} y={25} />
		</svg>
	),

	[Directions.Left]: (
		<svg width="50" height="50">
			<HorizontalArrow x1={0} x2={45} y={25} />
		</svg>
	),

	[Directions.Right]: (
		<svg width="50" height="50">
			<HorizontalArrow x1={50} x2={5} y={25} />
		</svg>
	),

	[Directions.Up]: (
		<svg width="50" height="50">
			<VerticalArrow x={25} y1={50} y2={5} />
		</svg>
	),

	[Directions.Down]: (
		<svg width="50" height="50">
			<VerticalArrow x={25} y1={0} y2={45} />
		</svg>
	),

	[Directions.None]: (
		<svg width="50" height="50">
			<foreignObject x="0" y="0" width="50" height="50">
				<div
					className={css({
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '100%',
					})}
				>
					<MathJax>{'\\(\\text{None}\\)'}</MathJax>
				</div>
			</foreignObject>
		</svg>
	),
};

export default function RightHandRule() {
	const [modalOpen, setModalOpen] = useState(false);
	const [correctState, setCorrectState] = useState(false);
	const [vfDirection, setVFDirection] = useState(
		Object.values(Directions)[
			Math.floor(Math.random() * Object.keys(Directions).length)
		],
	);
	const [elCharge, setElCharge] = useState(Math.random() > 0.5);
	const [chargeDirection, setChargeDirection] = useState(
		Object.values(Directions)[Math.floor(Math.random() * 4) + 2],
	);
	const isVertical =
		chargeDirection == Directions.Up || chargeDirection == Directions.Down;

	const [circleX, circleY] = [
		isVertical ? 100 : chargeDirection === Directions.Left ? 150 : 50,
		!isVertical ? 100 : chargeDirection === Directions.Up ? 150 : 50,
	];
	const [lineEndX, lineEndY] = [
		isVertical ? 100 : chargeDirection == Directions.Right ? 150 : 50,
		!isVertical ? 100 : chargeDirection == Directions.Down ? 150 : 50,
	];

	function createCheckAnswer(direction: number) {
		const fieldVector = DirectionVectors[vfDirection];
		const velocity = elCharge
			? DirectionVectors[chargeDirection]
			: flip(DirectionVectors[chargeDirection]);

		const answer = crossProduct(velocity, fieldVector);

		const answerDirection = Object.entries(DirectionVectors).findIndex(
			([, vector]) => vecEq(answer, vector),
		);

		console.log(fieldVector, vfDirection);
		if (direction == answerDirection) {
			return () => {
				setCorrectState(true);
				setModalOpen(true);
			};
		} else {
			return () => {
				setCorrectState(false);
				setModalOpen(true);
			};
		}
	}

	return (
		<div
			className={stack({
				direction: 'row',
				justifyContent: 'center',
				w: '100vw',
				p: '4',
			})}
		>
			<div
				className={stack({
					direction: 'column',
					alignItems: 'center',
					maxWidth: '750px',
				})}
			>
				<ResultModal
					open={modalOpen}
					correct={correctState}
					setClose={() => {
						setModalOpen(false);
						if (correctState) {
							setVFDirection(
								Object.values(Directions)[
									Math.floor(Math.random() * Object.keys(Directions).length)
								],
							);
							setElCharge(Math.random() > 0.5);
							setChargeDirection(
								Object.values(Directions)[Math.floor(Math.random() * 4) + 2],
							);
						}
					}}
				/>
				<div
					className={stack({
						direction: 'row',
						justifyContent: 'center',
						width: '100%',
					})}
				>
					<IconButton component={Link} href="/" variant="soft">
						<ArrowBackIcon />
					</IconButton>
					<Typography
						level="h3"
						className={css({ flex: '1', textAlign: 'center' })}
					>
						Right Hand Rule
					</Typography>
					<IconButton component={Link} href="/" variant="soft">
						<Settings />
					</IconButton>
				</div>
				<div
					className={stack({
						direction: 'column',
						gap: '4',
						alignItems: 'center',
					})}
				>
					<Typography level="body-lg">
						<b>Directions</b>: A particle is being launched with velocity{' '}
						<MathJax inline={true}>{'\\(v\\)'}</MathJax> towards a magnetic
						field labeled{' '}
						<MathJax inline={true}>{'\\(\\mathbf{\\vec{B}}\\)'}</MathJax>.
						Select the direction of magnetic force the particle will experience
						when initially entering the magnetic field.
					</Typography>
					<svg
						className={cx(
							isVertical && css({ maxH: '400px' }),
							!isVertical && css({ maxW: '400px' }),
						)}
						viewBox={`0 0 ${isVertical ? 200 : 400} ${isVertical ? 400 : 200}`}
					>
						<VectorField
							x={isVertical || chargeDirection === Directions.Left ? 0 : 200}
							y={!isVertical || chargeDirection === Directions.Up ? 0 : 200}
							direction={vfDirection}
						/>

						<svg
							x={isVertical || chargeDirection === Directions.Right ? 0 : 200}
							y={!isVertical || chargeDirection === Directions.Down ? 0 : 200}
							width="200"
							height="200"
						>
							<circle
								cx={circleX}
								cy={circleY}
								stroke="black"
								fill="none"
								r={10}
							/>
							<polyline
								points={`${circleX - 5}, ${circleY}, ${circleX + 5}, ${circleY}`}
								stroke="black"
							/>

							{elCharge && (
								<polyline
									points={`${circleX}, ${circleY - 5}, ${circleX}, ${circleY + 5}`}
									stroke="black"
								/>
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
								x={chargeDirection === Directions.Left ? lineEndX : 100}
								y={chargeDirection === Directions.Up ? lineEndY : 100}
								width="50"
								height="50"
							>
								<div
									className={cx(
										css({
											display: 'flex',
											flexDirection: 'column',
											height: '100%',
											p: 2,
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
				</div>

				<div
					className={stack({
						direction: 'column',
					})}
				>
					<div
						className={stack({
							direction: 'row',
							gap: '2',
							flexWrap: 'wrap',
							justifyContent: 'center',
						})}
					>
						{Object.entries(ArrowDirections).map(([direction, component]) => {
							return (
								<Button
									variant="soft"
									size="lg"
									color="neutral"
									onClick={createCheckAnswer(Number(direction))}
								>
									{component}
								</Button>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
