import { Button } from '@mui/joy';
import Link from 'next/link';
import { stack } from '../../styled-system/patterns';

export default function Page() {
	return (
		<main className={stack({
			direction: 'column',
			alignItems: 'center',
		})}>
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
