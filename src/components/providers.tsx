'use client';

import { MathJaxContext } from 'better-react-mathjax';
import { ReactNode } from 'react';
import ThemeRegistry from './theme-registry';

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<MathJaxContext hideUntilTypeset="first">
			<ThemeRegistry>{children}</ThemeRegistry>
		</MathJaxContext>
	);
}
