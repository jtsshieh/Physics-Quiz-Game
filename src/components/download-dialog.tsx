import { TransitionDialog } from './transition-dialog';
import {
	DialogContent,
	DialogTitle,
	Divider,
	ModalClose,
	Typography,
	useTheme,
} from '@mui/joy';
import { DownloadRounded } from '@mui/icons-material';
import React, { ReactNode } from 'react';
import { css } from 'styled-system/css';

export default function DownloadDialog({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const macOS = window.navigator.platform.toUpperCase().indexOf('MAC') >= 0;

	return (
		<TransitionDialog open={open} onClose={onClose}>
			<ModalClose />
			<DialogTitle>
				<DownloadRounded /> Download Information
			</DialogTitle>
			<Divider />
			<DialogContent sx={{ overflow: 'visible' }}>
				<Typography level="body-md">
					Downloading in full SVG quality is currently not supported. Please
					take a screenshot.
				</Typography>

				<Typography level="body-md">
					With {macOS ? 'macOS' : 'Windows'}, use the{' '}
					{macOS ? (
						<>
							<Shortcut>⌘</Shortcut>
							<Shortcut>⇧</Shortcut>
							<Shortcut>4</Shortcut>
						</>
					) : (
						<>
							<Shortcut>⊞ Win</Shortcut>
							<Shortcut>⇧</Shortcut>
							<Shortcut>S</Shortcut>
						</>
					)}{' '}
					shortcut to take a screenshot.
				</Typography>
			</DialogContent>
		</TransitionDialog>
	);
}

function Shortcut({ children }: { children: ReactNode }) {
	const theme = useTheme();
	return (
		<kbd
			className={css({
				all: 'unset',
				border: `1px solid var(--joy-palette-neutral-300)`,
				backgroundColor: 'var(--joy-palette-neutral-100)',
				borderRadius: 6,
				p: 1,
				m: 1,
			})}
		>
			{children}
		</kbd>
	);
}
