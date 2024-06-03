import { MathJaxBaseContext } from 'better-react-mathjax';
import { useContext, useEffect, useRef } from 'react';

export function BetterMathJax({
	text,
	x,
	y,
}: {
	text: string;
	x: number;
	y: number;
}) {
	const mjPromise = useContext(MathJaxBaseContext);
	const ref = useRef<SVGSVGElement>(null);

	useEffect(() => {
		if (mjPromise) {
			mjPromise.promise.then((mathJax) => {
				mathJax.startup.promise
					.then(() =>
						mathJax['tex2svgPromise'](text, {
							display: false,
						}),
					)
					.then((output) => {
						mathJax.startup.document.clear();
						mathJax.startup.document.updateDocument();
						if (ref.current)
							ref.current.outerHTML = output.children[0].outerHTML;
					});
			});
		}
	}, []);
	return (
		<svg x={x} y={y}>
			<svg ref={ref}></svg>
		</svg>
	);
}
