'use client';
import { grid, stack } from '../../../styled-system/patterns';
import {
	Divider,
	IconButton,
	Tab,
	tabClasses,
	TabList,
	Tabs,
	Typography,
} from '@mui/joy';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import React, { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const diagrams = ['particle-launch', 'wire-field'];

export default function DiagramGeneratorLayout({
	children,
}: {
	children: ReactNode;
}) {
	const route = usePathname();
	const router = useRouter();
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
				onChange={(e, v) => {
					router.push(`/diagram-generator/${diagrams[v as number]}`);
				}}
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
					<Tab disableIndicator>Particle Launch</Tab>
					<Tab disableIndicator>Wire Field</Tab>
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
