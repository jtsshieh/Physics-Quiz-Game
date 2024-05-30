export function crossProduct(
	[x1, x2, x3]: Vector,
	[y1, y2, y3]: Vector,
): Vector {
	return [x2 * y3 - x3 * y2, x3 * y1 - x1 * y3, x1 * y2 - x2 * y1];
}

export function vecEq([x1, x2, x3]: Vector, [y1, y2, y3]: Vector) {
	return x1 == y1 && x2 == y2 && x3 == y3;
}

export function flip([x1, x2, x3]: Vector): Vector {
	return [-x1, -x2, -x3];
}
export type Vector = [number, number, number];
