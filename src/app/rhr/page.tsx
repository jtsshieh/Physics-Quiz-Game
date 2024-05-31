'use client';
import { ResultModal } from '../../components/result-modal';
import React, { useCallback, useEffect, useState } from 'react';
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
import { WireField } from './wire-field';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

const problemTypes = [new ParticleLaunch(), new WireField()];

export default function RightHandRule() {
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

	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	const search = searchParams.get('s');

	useEffect(() => {
		const fullPool = problemTypes.map(({ id }) => id);

		if (!search) {
			router.push(pathname + '?' + createQueryString('s', fullPool.join(',')));
			return;
		}

		const providedTypes = search.split(',');
		const filteredTypes = providedTypes.filter((a) => fullPool.includes(a));

		// no results left -> populate default pool
		if (filteredTypes.length === 0) {
			router.push(pathname + '?' + createQueryString('s', fullPool.join(',')));
			return;
		}

		// filtered results -> update query string with filtered results
		if (providedTypes.length !== filteredTypes.length) {
			router.push(
				pathname + '?' + createQueryString('s', filteredTypes.join(',')),
			);
			return;
		}

		setProblemPool(filteredTypes);
		genNewProblem(filteredTypes);
	}, [search]);

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, value);

			return params.toString();
		},
		[searchParams],
	);

	const [hasMounted, setHasMounted] = useState(false);
	useEffect(() => {
		setHasMounted(true);
	}, []);

	if (!hasMounted) {
		return null;
	}

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

	function genNewProblem(newPool?: string[]) {
		const pool = newPool ?? problemPool;
		const problemTypeId = pool[Math.floor(Math.random() * pool.length)];

		const newProblemType = problemTypes.find(({ id }) => id === problemTypeId);

		// @ts-expect-error: id is from problemPool, an array of ids, so it must exist
		setProblemType(newProblemType);
		// @ts-expect-error: id is from problemPool, an array of ids, so it must exist
		setGameState(newProblemType.resetState());
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
				<SettingsMenu
					settingsOpen={settingsOpen}
					setSettingsOpen={setSettingsOpen}
					currentPool={problemPool}
					genNewProblem={genNewProblem}
				/>
				<TransitionDialog open={helpOpen} onClose={() => setHelpOpen(false)}>
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
						<MathJax dynamic inline hideUntilTypeset="first">
							<b>Directions</b>: <span>{problemType.directions}</span>
						</MathJax>
					</Typography>
					{/*//@ts-expect-error: game state is synced with problem type*/}
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
							// @ts-expect-error: game state is synced with problem type
							.getAnswerChoices(gameState)
							.map(({ element, correct, key }) => (
								<Button
									key={key}
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

function SettingsMenu({
	settingsOpen,
	setSettingsOpen,
	currentPool,
	genNewProblem,
}: {
	settingsOpen: boolean;
	setSettingsOpen: (newState: boolean) => void;
	currentPool: string[];
	genNewProblem: (newPool: string[]) => void;
}) {
	const [mustSelectProblem, setMustSelectProblem] = useState(false);
	const [tempPool, setTempPool] = useState(currentPool);
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set(name, value);

			return params.toString();
		},
		[searchParams],
	);

	useEffect(() => {
		setTempPool(currentPool);
	}, [currentPool]);

	return (
		<>
			<Snackbar
				autoHideDuration={5000}
				anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
				open={mustSelectProblem}
				onClose={() => setMustSelectProblem(false)}
				variant="soft"
			>
				At least one problem type must be selected.
			</Snackbar>
			<TransitionDialog
				open={settingsOpen}
				onClose={() => {
					setTempPool(currentPool);
					setSettingsOpen(false);
				}}
			>
				<ModalClose />
				<DialogTitle>
					<SettingsIcon />
					Right Hand Rule Settings
				</DialogTitle>
				<Divider />
				<form
					onSubmit={(e) => {
						e.preventDefault();
						setSettingsOpen(false);

						router.push(
							pathname + '?' + createQueryString('s', tempPool.join(',')),
						);

						genNewProblem(tempPool);
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
							<ListItem key={id}>
								<Checkbox
									overlay
									variant="soft"
									checked={tempPool.includes(id)}
									onChange={(e) => {
										if (e.target.checked) {
											setTempPool([...tempPool, id]);
										} else if (tempPool.length === 1) {
											setMustSelectProblem(true);
										} else {
											setTempPool(tempPool.filter((a) => a !== id));
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
		</>
	);
}
