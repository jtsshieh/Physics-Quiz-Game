'use client';

import * as React from 'react';
import { MathJaxContext } from 'better-react-mathjax';
import ThemeRegistry from './theme-registry';

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<MathJaxContext hideUntilTypeset="first">
			<ThemeRegistry>{children}</ThemeRegistry>
		</MathJaxContext>
	);
}
