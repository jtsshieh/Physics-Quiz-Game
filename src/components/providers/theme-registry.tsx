'use client';

import { extendTheme } from '@mui/joy';
import CssBaseline from '@mui/joy/CssBaseline';
import { CssVarsProvider } from '@mui/joy/styles';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

import NextAppDirEmotionCacheProvider from './emotion-cache';

const inter = Inter({
	subsets: ['latin'],
	display: 'swap',
});

const theme = extendTheme({
	components: {
		JoyButton: {
			defaultProps: {
				size: 'md',
				variant: 'outlined',
				color: 'neutral',
			},
			styleOverrides: {
				root: ({ theme }) => ({
					'--Button-radius': theme.vars.radius.lg,
					transition: 'background-color 150ms ease-in-out',

					[theme.breakpoints.up('sm')]: {
						// large styles for large screen sizes
						'--Button-gap': '0.75rem',
						minHeight: 'var(--Button-minHeight, 2.75rem)',
						fontSize: theme.vars.fontSize.md,
						paddingBlock: 'var(--Button-paddingBlock, 0.5rem)',
						paddingInline: '1.5rem',
					},
				}),
			},
		},
		JoyIconButton: {
			defaultProps: {
				variant: 'plain',
			},
			styleOverrides: {
				root: ({ theme }) => ({
					transition: 'background-color 150ms ease-in-out',
				}),
			},
		},
		JoyCheckbox: {
			defaultProps: {
				color: 'neutral',
			},
			styleOverrides: {
				checkbox: ({ theme }) => ({
					borderRadius: theme.vars.radius.sm,
					transition: 'background-color 150ms ease-in-out',
				}),
			},
		},

		JoyRadio: {
			defaultProps: {
				color: 'neutral',
			},
			styleOverrides: {
				radio: ({ theme }) => ({
					borderRadius: theme.vars.radius.lg,
				}),
				root: ({ theme }) => ({
					padding: 4,
					transition: 'background-color 150ms ease-in-out',
				}),
			},
		},
	},

	fontFamily: {
		display: inter.style.fontFamily,
		body: inter.style.fontFamily,
	},

	colorSchemes: {
		light: {
			palette: {
				neutral: {
					outlinedBg: 'var(--joy-palette-common-white)',
					outlinedHoverBg: 'var(--joy-palette-neutral-100)',
				},
				background: {
					backdrop:
						'rgba(var(--joy-palette-neutral-darkChannel, 11 13 14) / 0.5)',
				},
			},
		},
	},
});
export default function ThemeRegistry({ children }: { children: ReactNode }) {
	return (
		<NextAppDirEmotionCacheProvider options={{ key: 'joy' }}>
			<CssVarsProvider theme={theme} defaultMode="light">
				<CssBaseline />
				{children}
			</CssVarsProvider>
		</NextAppDirEmotionCacheProvider>
	);
}
