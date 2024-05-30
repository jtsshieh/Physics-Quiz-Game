'use client';

import { ResultModal } from '../../components/result-modal';
import React, { ReactElement, useState } from 'react';
import { Button, IconButton, Typography } from '@mui/joy';
import { Directions, DirectionVectors } from '../../constants';
import { MathJax } from 'better-react-mathjax';
import { crossProduct, flip, vecEq } from '../../utils';
import Link from 'next/link';
import { css, cx } from '../../../styled-system/css';
import { stack } from '../../../styled-system/patterns';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Settings } from '@mui/icons-material';
import { ParticleLaunch } from './particle-launch';

const problemTypes = [new ParticleLaunch()];

export default function RightHandRule() {
	const [modalOpen, setModalOpen] = useState(false);
	const [correctState, setCorrectState] = useState(false);
	const [problem, setProblem] = useState(problemTypes[0]);
	const [gameState, setGameState] = useState(problem.resetState());

	function createCheckAnswer(correct: boolean) {
		if (correct) {
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
				<ResultModal
					open={modalOpen}
					correct={correctState}
					setClose={() => {
						setModalOpen(false);
						if (correctState) {
							setGameState(problem.resetState());
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
						flex: 'auto',
						minHeight: 0,
					})}
				>
					<Typography level="body-lg">
						<MathJax inline={true}>
							<b>Directions</b>:{problem.directions}
						</MathJax>
					</Typography>
					{problem.renderDiagram(gameState)}
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
						{problem.getAnswerChoices(gameState).map(({ element, correct }) => (
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
