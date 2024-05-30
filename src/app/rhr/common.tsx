import { Directions } from '../../constants';
import {
	HorizontalArrow,
	IntoPage,
	OutOfPage,
	VerticalArrow,
} from '../../components/vector-field';
import { css } from '../../../styled-system/css';
import { MathJax } from 'better-react-mathjax';
import React from 'react';

export const ButtonArrows = {
	[Directions.IntoPage]: (
		<svg width="50" height="50">
			<IntoPage x={25} y={25} />
		</svg>
	),

	[Directions.OutOfPage]: (
		<svg width="50" height="50">
			<OutOfPage x={25} y={25} />
		</svg>
	),

	[Directions.Left]: (
		<svg width="50" height="50">
			<HorizontalArrow x1={0} x2={45} y={25} />
		</svg>
	),

	[Directions.Right]: (
		<svg width="50" height="50">
			<HorizontalArrow x1={50} x2={5} y={25} />
		</svg>
	),

	[Directions.Up]: (
		<svg width="50" height="50">
			<VerticalArrow x={25} y1={50} y2={5} />
		</svg>
	),

	[Directions.Down]: (
		<svg width="50" height="50">
			<VerticalArrow x={25} y1={0} y2={45} />
		</svg>
	),

	[Directions.None]: (
		<svg width="50" height="50">
			<foreignObject x="0" y="0" width="50" height="50">
				<div
					className={css({
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '100%',
					})}
				>
					<MathJax>{'\\(\\text{None}\\)'}</MathJax>
				</div>
			</foreignObject>
		</svg>
	),
};
