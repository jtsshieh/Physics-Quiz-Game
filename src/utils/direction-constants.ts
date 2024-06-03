import { Vector } from './vector-utils';

export const Directions = {
	IntoPage: 0,
	OutOfPage: 1,
	Left: 2,
	Right: 3,
	Up: 4,
	Down: 5,
	None: 6,
};

/**
 * An array of all possible directions
 */
export const allDirections = Object.values(Directions);

/**
 * An array of all possible directions excluding None
 */
export const normalDirections = allDirections.slice(0, 6);

/**
 * An array of directions along the z-axis (into the page/out of the page)
 */
export const zDirections = allDirections.slice(0, 2);

/**
 * An array of directions along the x-axis (left or right)
 */
export const xDirections = allDirections.slice(2, 4);

/**
 * An array of directions along the y-axis (up/down)
 */
export const yDirections = allDirections.slice(4, 6);

/**
 * An array of directions along the x-axis and y-axis
 */
export const xyDirections = allDirections.slice(2, 6);

export const DirectionVectors: Record<number, Vector> = {
	[Directions.IntoPage]: [0, 0, -1],
	[Directions.OutOfPage]: [0, 0, 1],
	[Directions.Left]: [-1, 0, 0],
	[Directions.Right]: [1, 0, 0],
	[Directions.Up]: [0, 1, 0],
	[Directions.Down]: [0, -1, 0],
	[Directions.None]: [0, 0, 0],
};
