import { Button } from '@mui/joy';
import Link from 'next/link';

export default function Page() {
	return (
		<main>
			Welcome to the Physics Quiz.
			<br />
			Choose a problem type:
			<div className="homepage-buttons">
				<Button component={Link} href="/rhr">
					Right Hand Rule
				</Button>
			</div>
		</main>
	);
}
