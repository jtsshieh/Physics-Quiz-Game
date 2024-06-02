import { Directions } from '@/utils/direction-constants';
import { MathJax } from 'better-react-mathjax';
import { ReactElement } from 'react';

export function IntoPage({ x, y, r }: { x: number; y: number; r?: number }) {
	const radius = r ?? 5;

	return (
		<polyline
			points={`${x}, ${y}, ${x - radius}, ${y - radius}, ${x + radius}, ${y + radius}, ${x}, ${y}, ${x + radius}, ${y - radius}, ${x}, ${y}, ${x - radius}, ${y + radius}`}
			stroke="black"
			strokeLinecap="square"
		/>
	);
}

export function OutOfPage({ x, y, r }: { x: number; y: number; r?: number }) {
	return <circle r={r ?? 5} cx={x} cy={y} stroke="black" />;
}

export function HorizontalArrow({
	x1,
	x2,
	y,
}: {
	x1: number;
	x2: number;
	y: number;
}) {
	return (
		<line
			x1={x1}
			y1={y}
			x2={x2}
			y2={y}
			stroke="black"
			strokeWidth={2}
			markerEnd="url(#arrow)"
		/>
	);
}

export function VerticalArrow({
	y1,
	y2,
	x,
}: {
	y1: number;
	y2: number;
	x: number;
}) {
	return (
		<line
			x1={x}
			y1={y1}
			x2={x}
			y2={y2}
			stroke="black"
			strokeWidth={2}
			markerEnd="url(#arrow)"
		/>
	);
}

export default function VectorField({
	direction,
	x,
	y,
}: {
	direction: number;
	x: number;
	y: number;
}) {
	const vectorField: ReactElement[] = [];
	if (direction == Directions.IntoPage) {
		for (let x = 25; x < 200; x += 50) {
			for (let y = 25; y < 200; y += 50) {
				vectorField.push(<IntoPage x={x} y={y} key={`${x}${y}`} />);
			}
		}
	} else if (direction == Directions.OutOfPage) {
		for (let x = 25; x < 200; x += 50) {
			for (let y = 25; y < 200; y += 50) {
				vectorField.push(<OutOfPage x={x} y={y} key={`${x}${y}`} />);
			}
		}
	} else if (direction == Directions.Left) {
		for (let y = 25; y < 200; y += 50) {
			vectorField.push(
				<HorizontalArrow x1={175} x2={25} y={y} key={`${x}${y}`} />,
			);
		}
	} else if (direction == Directions.Right) {
		for (let y = 25; y < 200; y += 50) {
			vectorField.push(
				<HorizontalArrow x1={25} x2={175} y={y} key={`${x}${y}`} />,
			);
		}
	} else if (direction == Directions.Up) {
		for (let x = 25; x < 200; x += 50) {
			vectorField.push(
				<VerticalArrow y1={175} y2={25} x={x} key={`${x}${y}`} />,
			);
		}
	} else if (direction == Directions.Down) {
		for (let x = 25; x < 200; x += 50) {
			vectorField.push(
				<VerticalArrow y1={25} y2={175} x={x} key={`${x}${y}`} />,
			);
		}
	}
	return (
		<svg width="200" height="200" x={x} y={y}>
			<rect x={0} y={0} height={200} width={200} fill="none" stroke="black" />
			{vectorField}
			<foreignObject x="75" y="75" width="50" height="50">
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						width: '100%',
						height: '100%',
						position: 'fixed',
					}}
				>
					<MathJax>{'\\(\\mathbf{\\vec{B}}\\)'}</MathJax>
				</div>
			</foreignObject>
		</svg>
	);
}
