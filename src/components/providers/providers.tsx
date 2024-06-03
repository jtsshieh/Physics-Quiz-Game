'use client';

import { MathJaxContext } from 'better-react-mathjax';
import { ReactNode } from 'react';

import ThemeRegistry from './theme-registry';

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<MathJaxContext
			hideUntilTypeset="first"
			src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-svg.js"
			config={{ loader: { load: ['input/tex', 'output/chtml', 'output/svg'] } }}
		>
			<ThemeRegistry>{children}</ThemeRegistry>
		</MathJaxContext>
	);
}
