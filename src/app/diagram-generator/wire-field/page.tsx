'use client';

import { DownloadRounded } from '@mui/icons-material';
import {
	Divider,
	FormControl,
	FormLabel,
	IconButton,
	Input,
	Radio,
	RadioGroup,
	Slider,
	Typography,
	radioClasses,
} from '@mui/joy';
import { css } from '@styled-system/css';
import { hstack, stack } from '@styled-system/patterns';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';

import { Directions } from '@/utils/direction-constants';

import { ButtonArrows } from '../../rhr/common';
import { WireField } from '../../rhr/wire-field';

const DownloadDialog = dynamic(() => import('@/components/download-dialog'), {
	ssr: false,
});

const wireField = new WireField();

export default function WireFieldDiagramGenerator() {
	const [wireFieldState, setWireFieldState] = useState({
		currentDirection: Directions.IntoPage,
		radiusDirection: Directions.Right,
		px: 160,
		py: 100,
	});
	const wireFieldRef = useRef<SVGSVGElement>();

	const [tempX, setTempX] = useState('160');
	const [tempY, setTempY] = useState('100');

	const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);

	const xBound = wireField.getMaxX(wireFieldState.currentDirection);
	const yBound = wireField.getMaxY(wireFieldState.currentDirection);

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

	const handleDownload = () => {
		setDownloadDialogOpen(true);
	};

	return (
		<>
			<DownloadDialog
				open={downloadDialogOpen}
				onClose={() => setDownloadDialogOpen(false)}
			/>
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
					<FormLabel>Current Direction</FormLabel>
					<RadioGroup
						orientation="horizontal"
						value={wireFieldState.currentDirection}
						onChange={(e) => {
							const newCurrentDirection = Number(e.target.value);

							const sanitizedX = sanitizeInput(
								tempX,
								wireField.getMaxX(newCurrentDirection),
							);
							const sanitizedY = sanitizeInput(
								tempY,
								wireField.getMaxY(newCurrentDirection),
							);

							setWireFieldState({
								...wireFieldState,
								currentDirection: Number(e.target.value),
								px: sanitizedX,
								py: sanitizedY,
							});
							setTempX(sanitizedX.toString());
							setTempY(sanitizedY.toString());
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
						{Object.values(Directions)
							.slice(0, 6)
							.map((direction) => (
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
				<FormControl className={css({ width: '100%' })}>
					<FormLabel>Point x-coordinate</FormLabel>
					<div className={hstack({ gap: 8 })}>
						<div className={css({ flex: 'auto' })}>
							<Slider
								color="neutral"
								variant="solid"
								value={wireFieldState.px}
								onChange={(e, val) => {
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
								onChange={(e, val) => {
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
					<IconButton variant="outlined" onClick={handleDownload}>
						<DownloadRounded />
					</IconButton>
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
					{wireField.renderDiagram(wireFieldState, wireFieldRef)}
				</div>
			</div>
		</>
	);
}
