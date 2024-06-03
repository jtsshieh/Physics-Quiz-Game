'use client';

import { DownloadRounded } from '@mui/icons-material';
import {
	Divider,
	FormControl,
	FormLabel,
	IconButton,
	Radio,
	RadioGroup,
	Typography,
	radioClasses,
} from '@mui/joy';
import { css } from '@styled-system/css';
import { hstack, stack } from '@styled-system/patterns';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';

import {
	ButtonArrows,
	NegativeCharge,
	PositiveCharge,
} from '@/components/button-arrows';
import { ParticleLaunch } from '@/games/particle-launch';
import { Directions } from '@/lib/direction-constants';

const DownloadDialog = dynamic(
	() => import('@/components/popups/download-dialog'),
	{
		ssr: false,
	},
);

const particleLaunch = new ParticleLaunch();

export default function ParticleLaunchDiagramGenerator() {
	const [particleLaunchState, setParticleLaunchState] = useState({
		vectorFieldDirection: Directions.IntoPage,
		particleCharge: true,
		particleVelocity: Directions.Right,
	});
	const particleLaunchRef = useRef<SVGSVGElement>();
	const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);

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
					<FormLabel>Particle Charge</FormLabel>
					<RadioGroup
						orientation="horizontal"
						value={particleLaunchState.particleCharge ? '1' : '0'}
						onChange={(e) => {
							setParticleLaunchState({
								...particleLaunchState,
								particleCharge: e.target.value === '1',
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
							value={'1'}
							disableIcon
							label={
								<svg width="50" height="50">
									<PositiveCharge x={25} y={25} r={20} />
								</svg>
							}
							sx={{ margin: 0 }}
						/>
						<Radio
							value={'0'}
							disableIcon
							label={
								<svg width="50" height="50">
									<NegativeCharge x={25} y={25} r={20} />
								</svg>
							}
							sx={{ margin: 0 }}
						/>
					</RadioGroup>
				</FormControl>
				<FormControl>
					<FormLabel>Particle Velocity Direction</FormLabel>
					<RadioGroup
						orientation="horizontal"
						value={particleLaunchState.particleVelocity}
						onChange={(e) => {
							setParticleLaunchState({
								...particleLaunchState,
								particleVelocity: Number(e.target.value),
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
						{Object.values(Directions)
							.slice(2, 6)
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
				<FormControl>
					<FormLabel>Vector Field Direction</FormLabel>
					<RadioGroup
						orientation="horizontal"
						value={particleLaunchState.vectorFieldDirection}
						onChange={(e) => {
							setParticleLaunchState({
								...particleLaunchState,
								vectorFieldDirection: Number(e.target.value),
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
						{Object.values(Directions).map((direction) => (
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
					{particleLaunch.renderDiagram(particleLaunchState, particleLaunchRef)}
				</div>
			</div>
		</>
	);
}
