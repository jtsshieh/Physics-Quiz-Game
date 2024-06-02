import { Button } from '@mui/joy';
import { stack } from '@styled-system/patterns';
import Link from 'next/link';

export default function Page() {
	return (
		<main
			className={stack({
				direction: 'column',
				alignItems: 'center',
			})}
		>
			Welcome to the Physics Quiz.
			<br />
			Choose a problem type:
			<div className="homepage-buttons">
				<Button component={Link} href="/rhr">
					Right Hand Rule
				</Button>
				<Button component={Link} href="/diagram-generator">
					Diagram Generator
				</Button>
			</div>
		</main>
	);
}
