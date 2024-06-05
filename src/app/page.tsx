import { Button, Card, CardActions, CardContent, Typography } from '@mui/joy';
import { css } from '@styled-system/css';
import { grid, stack } from '@styled-system/patterns';
import Link from 'next/link';

export default function Page() {
	return (
		<div
			className={stack({
				direction: 'column',
				alignItems: 'center',
				gap: 0,
				w: '100vw',
			})}
		>
			<div
				className={stack({
					direction: 'column',
					justify: 'center',
					align: 'center',
					h: '90dvh',
					w: '100vw',
					backgroundColor: 'var(--joy-palette-neutral-100)',
					p: 8,
					gap: 8,
				})}
			>
				<div
					className={stack({
						direction: 'column',
						align: 'center',
						textAlign: 'center',
					})}
				>
					<Typography level="h1">
						Welcome to the{' '}
						<span
							className={css({
								background:
									'linear-gradient(150deg, hsla(217, 100%, 50%, 1) 0%, hsla(186, 100%, 69%, 1) 100%);',
								backgroundClip: 'text',
								color: 'transparent !important',
							})}
						>
							Physics Quiz Game
						</span>
					</Typography>
					<Typography level="body-lg">
						Practice physics concepts with auto-generated problems.
					</Typography>
				</div>
				<div>
					<Button component={Link} href="#games" size="lg">
						View All Games
					</Button>
				</div>
			</div>
			<div
				id="games"
				className={stack({
					direction: 'column',
					w: '100vw',
					p: 8,
				})}
			>
				<Typography level="h2">Games</Typography>
				<Typography level="body-md">
					Elevate your physics studying with these games that generate custom,
					random, problems on-the-fly
				</Typography>
				<div
					className={grid({
						columns: 1,
						sm: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
						lg: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
					})}
				>
					<Card>
						<CardContent>
							<Typography level="h3">Right Hand Rule</Typography>
							<Typography level="body-md">
								Practice different versions of the Right Hand Rule with this
								conceptual game.
							</Typography>
						</CardContent>
						<CardActions>
							<Button component={Link} href="/rhr">
								Open Game
							</Button>
						</CardActions>
					</Card>
				</div>
			</div>

			<div
				id="teacher-tools"
				className={stack({
					direction: 'column',
					w: '100vw',
					p: 8,
				})}
			>
				<Typography level="h2">Teacher Tools</Typography>
				<Typography level="body-md">
					Enhance your physics-teaching experience with these helpful tools.
				</Typography>
				<div
					className={grid({
						columns: 1,
						sm: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
						lg: { gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' },
					})}
				>
					<Card>
						<CardContent>
							<Typography level="h3">Diagram Generator</Typography>
							<Typography level="body-md">
								Generate your own version of the diagrams used in the games here
								and download them in full SVG quality or in a high quality SVG.
							</Typography>
						</CardContent>
						<CardActions>
							<Button component={Link} href="/diagram-generator">
								Open
							</Button>
						</CardActions>
					</Card>
				</div>
			</div>
		</div>
	);
}
