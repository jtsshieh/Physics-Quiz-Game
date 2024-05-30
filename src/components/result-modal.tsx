import Modal from '@mui/joy/Modal';
import Typography from '@mui/joy/Typography';

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
			className={`modal-outer ${correct ? 'modal-correct' : 'modal-incorrect'}`}
		>
			<Typography level="h1">{correct ? 'Correct!' : 'Incorrect'}</Typography>
		</Modal>
	);
}
