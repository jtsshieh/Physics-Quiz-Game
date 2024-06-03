import { Directions } from './direction-constants';

export function isXAxis(direction: number) {
	return direction === Directions.Left || direction === Directions.Right;
}

export function isYAxis(direction: number) {
	return direction === Directions.Up || direction === Directions.Down;
}

export function isZAxis(direction: number) {
	return (
		direction === Directions.IntoPage || direction === Directions.OutOfPage
	);
}
