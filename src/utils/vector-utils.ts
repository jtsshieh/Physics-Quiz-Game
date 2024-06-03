export function crossProduct(
	[x1, x2, x3]: Vector,
	[y1, y2, y3]: Vector,
): Vector {
	return [x2 * y3 - x3 * y2, x3 * y1 - x1 * y3, x1 * y2 - x2 * y1];
}

export function vecEq([x1, x2, x3]: Vector, [y1, y2, y3]: Vector) {
	return x1 == y1 && x2 == y2 && x3 == y3;
}

export function vecAdd([x1, x2, x3]: Vector, [y1, y2, y3]: Vector): Vector {
	return [x1 + y1, x2 + y2, x3 + y3];
}

export function vecMulByScalar([x1, x2, x3]: Vector, a: number): Vector {
	return [x1 * a, x2 * a, x3 * a];
}

export function flip([x1, x2, x3]: Vector): Vector {
	return [-x1, -x2, -x3];
}

export function vecUnitify([x1, x2, x3]: Vector): Vector {
	const divider = Math.sqrt(
		Math.pow(x1, 2) + Math.pow(x2, 2) + Math.pow(x3, 2),
	);
	if (divider === 0) return [0, 0, 0];
	return [x1 / divider, x2 / divider, x3 / divider];
}
export type Vector = [number, number, number];
