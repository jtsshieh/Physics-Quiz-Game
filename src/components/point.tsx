import { BetterMathJax } from './better-math-jax';

export function Point({ x, y, name }: { x: number; y: number; name: string }) {
	return (
		<>
			<circle cx={x} cy={y} r={5} />
			<BetterMathJax x={x + 5} y={y - 5} text={`${name}`} />
		</>
	);
}
