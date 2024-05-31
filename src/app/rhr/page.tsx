'use client';
import { ResultModal } from '../../components/result-modal';
import React, { useState } from 'react';
import {
	Button,
	DialogTitle,
	IconButton,
	Typography,
	List,
	ListItem,
	Checkbox,
	checkboxClasses,
	DialogContent,
	Divider,
	DialogActions,
	ModalClose,
	Snackbar,
} from '@mui/joy';
import { MathJax } from 'better-react-mathjax';
import Link from 'next/link';
import { css } from '../../../styled-system/css';
import { stack } from '../../../styled-system/patterns';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ParticleLaunch } from './particle-launch';
import HelpIcon from '@mui/icons-material/Help';
import SettingsIcon from '@mui/icons-material/Settings';
import { TransitionDialog } from '../../components/transition-dialog';
import { RHRProblemType } from './interfaces';

const problemTypes = [new ParticleLaunch()];

export default function RightHandRule<T>() {
	const [checkerOpen, setCheckerOpen] = useState(false);
	const [correctState, setCorrectState] = useState(false);

	const [settingsOpen, setSettingsOpen] = useState(false);
	const [helpOpen, setHelpOpen] = useState(false);
	const [problemPool, setProblemPool] = useState(
		problemTypes.map(({ id }) => id),
	);

	const [problemType, setProblemType] = useState(
		problemTypes[Math.floor(Math.random() * problemPool.length)],
	);
	const [gameState, setGameState] = useState(problemType.resetState());

	const [mustSelectProblem, setMustSelectProblem] = useState(false);

	function createCheckAnswer(correct: boolean) {
		if (correct) {
			return () => {
				setCorrectState(true);
				setCheckerOpen(true);
			};
		} else {
			return () => {
				setCorrectState(false);
				setCheckerOpen(true);
			};
		}
	}

	function genNewProblem() {
		setProblemType(
			problemTypes[Math.floor(Math.random() * problemPool.length)],
		);
		setGameState(problemType.resetState());
	}

	return (
		<div
			className={stack({
				direction: 'row',
				justifyContent: 'center',
				w: '100vw',
				h: '100vh',
				p: '4',
			})}
		>
			<div
				className={stack({
					direction: 'column',
					alignItems: 'center',
					maxWidth: '750px',
					flex: 'auto',
				})}
			>
				<Snackbar
					autoHideDuration={5000}
					anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
					open={mustSelectProblem}
					onClose={() => setMustSelectProblem(false)}
					variant="soft"
				>
					At least one problem type must be selected.
				</Snackbar>
				<TransitionDialog open={helpOpen} setOpen={setHelpOpen}>
					<ModalClose />
					<DialogTitle>
						<HelpIcon /> Problem Information
					</DialogTitle>
					<Divider />
					<DialogContent>
						<Typography level="body-md">
							<b>Name</b>: {problemType.name}
						</Typography>
						<Typography level="body-md">
							<b>ID</b>: {problemType.id}
						</Typography>
						<Typography level="body-md">
							<b>Description</b>: {problemType.description}
						</Typography>
					</DialogContent>
				</TransitionDialog>
				<TransitionDialog open={settingsOpen} setOpen={setSettingsOpen}>
					<ModalClose />
					<DialogTitle>
						<SettingsIcon />
						Right Hand Rule Settings
					</DialogTitle>
					<Divider />
					<form
						onSubmit={(e) => {
							e.preventDefault();
							genNewProblem();
							setSettingsOpen(false);
						}}
					>
						<List
							size="sm"
							sx={{
								[`& .${checkboxClasses.root}`]: {
									alignItems: 'center',
								},
							}}
						>
							{problemTypes.map(({ id, name, description }) => (
								<ListItem>
									<Checkbox
										overlay
										variant="soft"
										checked={problemPool.includes(id)}
										onChange={(e) => {
											if (e.target.checked) {
												setProblemPool((val) => [...val, id]);
											} else if (problemPool.length === 1) {
												setMustSelectProblem(true);
											} else {
												setProblemPool((val) => val.filter((a) => a !== id));
											}
										}}
										label={
											<>
												<Typography level="body-md">
													{name}{' '}
													<Typography sx={{ color: 'grey' }}>({id})</Typography>
												</Typography>
												<Typography level="body-xs" sx={{ display: 'block' }}>
													{description}
												</Typography>
											</>
										}
									/>
								</ListItem>
							))}
						</List>
						<DialogActions>
							<Button type="submit" variant="soft">
								Done
							</Button>
						</DialogActions>
					</form>
				</TransitionDialog>
				<ResultModal
					open={checkerOpen}
					correct={correctState}
					setClose={() => {
						setCheckerOpen(false);
						if (correctState) genNewProblem();
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
					<div className={stack({ direction: 'row', gap: '2' })}>
						<IconButton onClick={() => setSettingsOpen(true)} variant="soft">
							<SettingsIcon />
						</IconButton>
						<IconButton onClick={() => setHelpOpen(true)} variant="soft">
							<HelpIcon />
						</IconButton>
					</div>
				</div>
				<div
					className={stack({
						direction: 'column',
						gap: '4',
						alignItems: 'center',
						flex: 'auto',
						minHeight: 0,
					})}
				>
					<Typography level="body-lg">
						<MathJax inline={true}>
							<b>Directions</b>:{problemType.directions}
						</MathJax>
					</Typography>
					{problemType.renderDiagram(gameState)}
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
						{problemType
							.getAnswerChoices(gameState)
							.map(({ element, correct }) => (
								<Button
									variant="soft"
									size="lg"
									color="neutral"
									onClick={createCheckAnswer(correct)}
								>
									{element}
								</Button>
							))}
					</div>
				</div>
			</div>
		</div>
	);
}
