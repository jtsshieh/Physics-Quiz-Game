import { Metadata } from 'next';
import { ReactNode } from 'react';

import Providers from '@/components/providers';

import './globals.css';

export const metadata: Metadata = {
	title: 'Physics Quiz Game',
	description: 'Test your Physics Knowledge',
};
export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
