'use client';

import { ResultModal } from '../../components/result-modal';
import React, { useState } from 'react';
import { Button, Typography } from '@mui/joy';
import { Directions, DirectionVectors } from './constants';
import { MathJax } from 'better-react-mathjax';
import VectorField, {
	HorizontalArrow,
	IntoPage,
	OutOfPage,
	VerticalArrow,
} from '../../components/vector-field';
import { crossProduct, vecEq } from '../../utils';
import Link from 'next/link';
import { css } from '../../../styled-system/css';
import { stack } from '../../../styled-system/patterns';

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

	function createCheckAnswer(direction: number) {
		const fieldVector = DirectionVectors[vfDirection];
		const velocity =
			DirectionVectors[elCharge ? Directions.Right : Directions.Left];

		const answer = crossProduct(velocity, fieldVector);

		const answerDirection = Object.entries(DirectionVectors).findIndex(
			([, vector]) => vecEq(answer, vector),
		);
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
		<div className={stack({ direction: 'column', alignItems: 'center' })}>
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
					}
				}}
			/>
			<Button component={Link} href="/">
				Back
			</Button>

			<svg width="400" height="200">
				<rect
					x={0}
					y={0}
					width={400}
					height={200}
					stroke="black"
					fill="white"
				/>
				<VectorField x={200} y={0} direction={vfDirection} />
				<circle cx={50} cy={100} stroke="black" fill="none" r={10} />
				<polyline points={'45, 100, 55, 100'} stroke="black" />

				{elCharge && <polyline points={'50, 95, 50, 105'} stroke="black" />}
				{/*<Arrow points={[75,100, 175, 100]} stroke="black"/>*/}
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
					x1="100"
					y1="100"
					x2="150"
					y2="100"
					stroke="black"
					markerEnd="url(#arrow)"
				/>
				<foreignObject x="120" y="100" width="50" height="50">
					<MathJax>{'\\(v\\)'}</MathJax>
				</foreignObject>
			</svg>

			<Typography level="body-md">
				What direction is the magnetic force?
			</Typography>
			<div className={stack({
				direction: 'row',
				gap: '2',
				flexWrap: 'wrap',
				justifyContent: 'center',
			})}>
				{Object.entries(ArrowDirections).map(([direction, component]) => {
					return (
						<Button
							variant="outlined"
							color="primary"
							size="lg"
							onClick={createCheckAnswer(Number(direction))}
						>
							{component}
						</Button>
					);
				})}
			</div>
		</div>
	);
}
