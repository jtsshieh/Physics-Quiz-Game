'use client';

import {
	Divider,
	FormControl,
	FormLabel,
	Input,
	Radio,
	RadioGroup,
	Slider,
	Typography,
	radioClasses,
} from '@mui/joy';
import { css } from '@styled-system/css';
import { hstack, stack } from '@styled-system/patterns';
import { useRef, useState } from 'react';

import { ButtonArrows } from '@/components/button-arrows';
import { DownloadButton } from '@/components/download-button';
import { DualWireFields } from '@/games/dual-wire-fields';
import {
	Directions,
	normalDirections,
	xDirections,
	yDirections,
	zDirections,
} from '@/lib/direction-constants';
import { isXAxis, isYAxis, isZAxis } from '@/lib/direction-utils';

const dualWireFields = new DualWireFields();

export default function DualWireFieldsGenerator() {
	const [wireFieldState, setWireFieldState] = useState({
		currentDirection1: Directions.IntoPage,
		currentDirection2: Directions.OutOfPage,

		relCurrentDirection: Directions.Left,

		radiusDirection: Directions.None,

		px: 200,
		py: 200,
	});
	const wireFieldRef = useRef<SVGSVGElement>(null);

	const [tempX, setTempX] = useState('200');
	const [tempY, setTempY] = useState('200');

	const xBound = 400;
	const yBound = 400;

	const sanitizeInput = (temp: string, bound: number) => {
		let toSet = Number(temp);
		if (toSet > bound) toSet = bound;
		if (toSet < 0) toSet = 0;
		return toSet;
	};

	const handleXInput = () => {
		const sanitized = sanitizeInput(tempX, xBound);
		setWireFieldState({ ...wireFieldState, px: sanitized });
		setTempX(sanitized.toString());
	};
	const handleYInput = () => {
		const sanitized = sanitizeInput(tempY, yBound);
		setWireFieldState({ ...wireFieldState, py: sanitized });
		setTempY(sanitized.toString());
	};

	return (
		<>
			<div
				className={stack({
					direction: 'column',
					align: 'start',
					flex: '1',
					p: 8,
					height: '100%',
					overflowY: 'auto',
					overflowX: 'visible',
					minHeight: 0,
				})}
			>
				<Typography level="h3" sx={{ mb: 2 }}>
					Settings
				</Typography>
				<FormControl>
					<FormLabel>Current 1 Direction</FormLabel>
					<RadioGroup
						orientation="horizontal"
						value={wireFieldState.currentDirection1}
						onChange={(e) => {
							const newCurrent1 = Number(e.target.value);
							let newCurrent2 = wireFieldState.currentDirection2;
							const possibleCurrent2Directions =
								dualWireFields.getPossibleCurrent2(newCurrent1);
							if (
								!possibleCurrent2Directions.includes(
									wireFieldState.currentDirection2,
								)
							) {
								newCurrent2 = possibleCurrent2Directions[0];
							}
							setWireFieldState({
								...wireFieldState,
								currentDirection1: newCurrent1,
								currentDirection2: newCurrent2,
							});
						}}
						sx={{
							flexWrap: 'wrap',
							rowGap: 1,
							gap: 1.75,
							[`& .${radioClasses.checked}`]: {
								'--variant-borderWidth': '2px',
								borderColor: 'text.tertiary',
							},
						}}
					>
						{normalDirections.map((direction) => (
							<Radio
								key={direction}
								value={direction}
								disableIcon
								label={ButtonArrows[direction]}
								sx={{ margin: 0 }}
							/>
						))}
					</RadioGroup>
				</FormControl>
				<FormControl>
					<FormLabel>Current 2 Direction</FormLabel>
					<RadioGroup
						orientation="horizontal"
						value={wireFieldState.currentDirection2}
						onChange={(e) => {
							setWireFieldState({
								...wireFieldState,
								currentDirection2: Number(e.target.value),
							});
						}}
						sx={{
							flexWrap: 'wrap',
							rowGap: 1,
							gap: 1.75,
							[`& .${radioClasses.checked}`]: {
								'--variant-borderWidth': '2px',
								borderColor: 'text.tertiary',
							},
						}}
					>
						{(isXAxis(wireFieldState.currentDirection1)
							? xDirections
							: isYAxis(wireFieldState.currentDirection1)
								? yDirections
								: zDirections
						).map((direction) => (
							<Radio
								key={direction}
								value={direction}
								disableIcon
								label={ButtonArrows[direction]}
								sx={{ margin: 0 }}
							/>
						))}
					</RadioGroup>
				</FormControl>
				{isZAxis(wireFieldState.currentDirection1) && (
					<FormControl>
						<FormLabel>Relative Current Position</FormLabel>
						<RadioGroup
							orientation="horizontal"
							value={wireFieldState.relCurrentDirection}
							onChange={(e) => {
								setWireFieldState({
									...wireFieldState,
									relCurrentDirection: Number(e.target.value),
								});
							}}
							sx={{
								flexWrap: 'wrap',
								rowGap: 1,
								gap: 1.75,
								[`& .${radioClasses.checked}`]: {
									'--variant-borderWidth': '2px',
									borderColor: 'text.tertiary',
								},
							}}
						>
							<Radio
								value={Directions.Left}
								disableIcon
								label={
									<svg width="50" height="50">
										<line
											x1={5}
											y1={25}
											x2={45}
											y2={25}
											stroke="black"
											strokeWidth={2}
											markerEnd="url(#arrow)"
											markerStart="url(#arrow)"
										/>
									</svg>
								}
								sx={{ margin: 0 }}
							/>
							<Radio
								value={Directions.Up}
								disableIcon
								label={
									<svg width="50" height="50">
										<line
											x1={25}
											y1={5}
											x2={25}
											y2={45}
											stroke="black"
											strokeWidth={2}
											markerEnd="url(#arrow)"
											markerStart="url(#arrow)"
										/>
									</svg>
								}
								sx={{ margin: 0 }}
							/>
						</RadioGroup>
					</FormControl>
				)}
				<FormControl className={css({ width: '100%' })}>
					<FormLabel>Point x-coordinate</FormLabel>
					<div className={hstack({ gap: 8 })}>
						<div className={css({ flex: 'auto' })}>
							<Slider
								color="neutral"
								variant="solid"
								value={wireFieldState.px}
								onChange={(_, val) => {
									setWireFieldState({ ...wireFieldState, px: val as number });
									setTempX(val.toString());
								}}
								marks={[
									{ label: 0, value: 0 },
									{ label: xBound, value: xBound },
								]}
								max={xBound}
							/>
						</div>
						<Input
							value={tempX}
							onChange={(e) => setTempX(e.target.value)}
							onBlur={handleXInput}
							onKeyDown={(e) => {
								if (e.key === 'Enter') handleXInput();
							}}
							className={css({ width: 16 })}
						/>
					</div>
				</FormControl>
				<FormControl className={css({ width: '100%' })}>
					<FormLabel>Point y-coordinate</FormLabel>
					<div className={hstack({ gap: 8 })}>
						<div className={css({ flex: 'auto' })}>
							<Slider
								color="neutral"
								variant="solid"
								value={wireFieldState.py}
								onChange={(_, val) => {
									setWireFieldState({ ...wireFieldState, py: val as number });
									setTempY(val.toString());
								}}
								marks={[
									{ label: 0, value: 0 },
									{ label: yBound, value: yBound },
								]}
								max={yBound}
							/>
						</div>
						<Input
							value={tempY}
							onChange={(e) => setTempY(e.target.value)}
							onBlur={handleYInput}
							onKeyDown={(e) => {
								if (e.key === 'Enter') handleYInput();
							}}
							className={css({ width: 16 })}
						/>
					</div>
				</FormControl>
			</div>
			<Divider orientation="vertical" />
			<div
				className={stack({
					direction: 'column',
					align: 'flex-start',
					flex: '3',
					height: '100%',
					width: '100%',
					p: 8,
					minHeight: 0,
				})}
			>
				<div className={hstack({ justify: 'center', w: '100%' })}>
					<Typography level="h3" className={css({ flex: 1 })}>
						Generated Diagram
					</Typography>
					<DownloadButton svgRef={wireFieldRef} />
				</div>
				<div
					className={stack({
						flex: 1,
						align: 'center',
						justify: 'center',
						height: '100%',
						width: '100%',
						minHeight: 0,
					})}
				>
					{dualWireFields.renderDiagram(wireFieldState, wireFieldRef)}
				</div>
			</div>
		</>
	);
}
