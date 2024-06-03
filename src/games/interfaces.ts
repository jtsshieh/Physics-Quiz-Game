import { ReactElement, Ref } from 'react';

export interface RHRProblemType<GameState> {
	id: string;
	name: string;
	description: string;
	directions: string;

	resetState: () => GameState;
	renderDiagram: (state: GameState, ref?: Ref<SVGElement>) => ReactElement;
	getAnswerChoices: (state: GameState) => AnswerChoice[];
}

interface AnswerChoice {
	element: ReactElement;
	correct: boolean;
	key: string;
}
