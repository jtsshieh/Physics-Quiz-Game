'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
	Divider,
	IconButton,
	Tab,
	TabList,
	Tabs,
	Typography,
	tabClasses,
} from '@mui/joy';
import { grid, stack } from '@styled-system/patterns';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

const diagrams = ['particle-launch', 'wire-field', 'dual-wire-fields'];

export default function DiagramGeneratorLayout({
	children,
}: {
	children: ReactNode;
}) {
	const route = usePathname();
	const [hasMounted, setHasMounted] = useState(false);
	useEffect(() => {
		setHasMounted(true);
	}, []);

	if (!hasMounted) {
		return null;
	}

	return (
		<div
			className={stack({
				direction: 'column',
				alignItems: 'center',
				gap: 0,
				w: '100vw',
				h: '100dvh',
			})}
		>
			<div
				className={stack({
					direction: 'row',
					justify: 'center',
					align: 'center',
					width: '100%',
					p: 2,
				})}
			>
				<div
					className={stack({
						direction: 'row',
						gap: 2,
						flex: 'auto',
						alignItems: 'center',
					})}
				>
					<IconButton component={Link} href="/">
						<ArrowBackIcon />
					</IconButton>
					<Typography level="h4">Diagram Generator</Typography>
				</div>
			</div>
			<Tabs
				size="md"
				value={diagrams.findIndex((v) => route.split('/').pop() === v)}
				sx={(theme) => ({
					backgroundColor: theme.palette.background.body,
					[`& .${tabClasses.root}`]: {
						transition: '.15s',
						fontWeight: 'md',
						[`&:not(.${tabClasses.selected}):not(:hover)`]: {
							opacity: 0.7,
						},
					},
				})}
			>
				<TabList disableUnderline sx={{ borderRadius: 'xl', gap: 1, p: 1 }}>
					<Tab
						component={Link}
						href="/diagram-generator/particle-launch"
						disableIndicator
					>
						Particle Launch
					</Tab>
					<Tab
						component={Link}
						href="/diagram-generator/wire-field"
						disableIndicator
					>
						Wire Field
					</Tab>
					<Tab
						component={Link}
						href="/diagram-generator/dual-wire-fields"
						disableIndicator
					>
						Dual Wire Field
					</Tab>
				</TabList>
			</Tabs>
			<Divider />
			<div
				className={grid({
					direction: 'row',
					backgroundColor: 'var(--joy-palette-background-level1)',
					w: '100%',
					flex: 'auto',
					gridTemplateColumns: '1fr auto 2fr',
					gap: 0,
					minHeight: 0,
				})}
			>
				{children}
			</div>
		</div>
	);
}
