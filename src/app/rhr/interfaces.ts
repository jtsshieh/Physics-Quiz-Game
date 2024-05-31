import { ReactElement } from 'react';

export interface RHRProblemType<GameState> {
	id: string;
	name: string;
	description: string;
	directions: string;

	resetState: () => GameState;
	renderDiagram: (state: GameState) => ReactElement;
	getAnswerChoices: (state: GameState) => AnswerChoice[];
}

interface AnswerChoice {
	element: ReactElement;
	correct: boolean;
	key: string;
}
