'use client';
import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import NextAppDirEmotionCacheProvider from './emotion-cache';
import { extendTheme } from '@mui/joy';

const theme = extendTheme({
	colorSchemes: {
		light: {
			palette: {
				background: {
					backdrop:
						'rgba(var(--joy-palette-neutral-darkChannel, 11 13 14) / 0.5)',
				},
			},
		},
	},
});
export default function ThemeRegistry({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<NextAppDirEmotionCacheProvider options={{ key: 'joy' }}>
			<CssVarsProvider theme={theme} defaultMode="light">
				<CssBaseline />
				{children}
			</CssVarsProvider>
		</NextAppDirEmotionCacheProvider>
	);
}
