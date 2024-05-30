import { Metadata } from 'next';
import './App.css';
import Providers from '../components/providers';

export const metadata: Metadata = {
	title: 'Physics Quiz Game',
	description: 'Test your Physics Knowledge',
};
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<div id="root">
					<Providers>{children}</Providers>
				</div>
			</body>
		</html>
	);
}
