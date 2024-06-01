import { ReactNode } from 'react';
import { Transition } from 'react-transition-group';
import Modal from '@mui/joy/Modal';
import { ModalDialog, ModalDialogProps } from '@mui/joy';

export function TransitionDialog({
	open,
	onClose,
	children,
	...props
}: {
	open: boolean;
	onClose: () => void;
	children: ReactNode;
} & ModalDialogProps) {
	return (
		<Transition in={open} timeout={400}>
			{(state: string) => (
				<Modal
					keepMounted
					open={!['exited', 'exiting'].includes(state)}
					onClose={onClose}
					slotProps={{
						backdrop: {
							sx: {
								opacity: 0,
								backdropFilter: 'none',
								transition: `opacity 400ms`,
								...{
									entering: { opacity: 1 },
									entered: { opacity: 1 },
								}[state],
							},
						},
					}}
					sx={{
						visibility: state === 'exited' ? 'hidden' : 'visible',
					}}
				>
					<ModalDialog
						sx={{
							opacity: 0,
							transform: 'scale(.75) translate(-50%, -50%)',
							transformOrigin: 'top left',
							transition: `transform 300ms ease, opacity 300ms ease`,
							...{
								entering: {
									opacity: 1,
									transform: 'scale(1) translate(-50%, -50%)',
								},
								entered: {
									opacity: 1,
									transform: 'scale(1) translate(-50%, -50%)',
								},
							}[state],
						}}
						{...props}
					>
						{children}
					</ModalDialog>
				</Modal>
			)}
		</Transition>
	);
}
