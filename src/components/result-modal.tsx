import Modal from '@mui/joy/Modal';
import Typography from '@mui/joy/Typography';
import { css, cx } from '../../styled-system/css';
import { stack } from '../../styled-system/patterns';

export function ResultModal({
	correct,
	open,
	setClose,
}: {
	correct: boolean;
	open: boolean;
	setClose: () => void;
}) {
	return (
		<Modal
			open={open}
			onClose={setClose}
			className={cx(
				stack({
					bgBlendMode: 'multiply',
					alignItems: 'center',
					justifyContent: 'center',
				}),
				correct && css({ bgColor: 'rgba(119, 236, 149, 0.2)'}),
				!correct && css({ bgColor: 'rgba(255, 199, 197, 0.2)' })
			)}
		>
			<Typography level="h1">{correct ? 'Correct!' : 'Incorrect'}</Typography>
		</Modal>
	);
}
