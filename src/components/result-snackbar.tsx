import Modal from '@mui/joy/Modal';
import Typography from '@mui/joy/Typography';
import { css, cx } from '../../styled-system/css';
import { stack } from '../../styled-system/patterns';
import { Snackbar, useTheme } from '@mui/joy';
import { Cancel, CheckCircle } from '@mui/icons-material';

export function ResultSnackbar({
	correct,
	open,
	setClose,
}: {
	correct: boolean;
	open: boolean;
	setClose: () => void;
}) {
	const theme = useTheme();
	return (
		<Snackbar
			open={open}
			onClose={setClose}
			anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
			variant="soft"
			color={correct ? 'success' : 'danger'}
			startDecorator={correct ? <CheckCircle /> : <Cancel />}
		>
			<div className={stack({ direction: 'column', gap: 0.5 })}>
				<Typography level="title-md">
					{correct ? 'Correct' : 'Incorrect'}
				</Typography>
				<Typography
					level="body-md"
					className={css({
						color: theme.colorSchemes.light.palette.text.tertiary,
					})}
				>
					{correct
						? 'Click anywhere to move to the next problem.'
						: 'Select another answer.'}
				</Typography>
			</div>
		</Snackbar>
	);
}
