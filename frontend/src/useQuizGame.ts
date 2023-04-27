/**
 * This is a hook to manage the state of the game.
 * Depends on the room connection state.
 */

import { useEffect, useReducer } from "react";
import { useLocalMedia, useRoomConnection } from "@whereby.com/browser-sdk";

import questions from "./events/questions";
// This is a hack, need to expose this type directly from the SDK
export type RoomConnectionRef = ReturnType<typeof useRoomConnection>;
export type LocalMediaRef = ReturnType<typeof useLocalMedia>;

interface Question {
  question: string;
  alternatives: QuestionAlternatives;
  correctAlternative: string;
}

interface QuestionAlternatives {
  [alternativeId: string]: string;
}

export interface GameState {
  isQuizMaster: boolean;
  scores: {
    [participantId: string]: number;
  };
  screen: "welcome" | "question" | "end";
  currentAnswers: {
    [participantId: string]: string;
  } | null;
  currentQuestion: Question | null;
  revealAnswers: boolean;
}

export interface GameActions {
  start(): void;
  end(): void;
  postAnswer(alternative: string): void;
  postQuestion(question: Question): void;
  revealAnswers(): void;
}

type GameEvents =
  | {
      type: "QUESTION";
      payload: Question;
      senderId: string;
    }
  | {
      type: "ANSWER";
      payload: string;
      senderId: string;
    }
  | {
      type: "REVEAL";
      senderId: string;
    }
  | {
      type: "END";
      senderId: string;
    };

const initialState: GameState = {
  isQuizMaster: false,
  currentAnswers: null,
  currentQuestion: null,
  revealAnswers: false,
  scores: {},
  screen: "welcome",
};

function calculateScores(state: GameState): {
  [participantId: string]: number;
} {
  const { currentQuestion, scores, currentAnswers = {} } = state;
  if (!(currentQuestion && currentAnswers)) {
    return scores;
  }

  const newScores = {
    ...scores,
  };

  Object.keys(currentAnswers).forEach((participantId) => {
    const answer = currentAnswers[participantId];
    const participantScore = scores[participantId] || 0;
    newScores[participantId] =
      participantScore +
      (answer === currentQuestion.correctAlternative ? 1 : 0);
  });

  return newScores;
}

function reducer(state: GameState, event: GameEvents): GameState {
  switch (event.type) {
    case "QUESTION":
      return {
        ...state,
        screen: "question",
        currentAnswers: {},
        revealAnswers: false,
        currentQuestion: event.payload,
      };
    case "ANSWER":
      return {
        ...state,
        currentAnswers: {
          ...state.currentAnswers,
          [event.senderId]: event.payload,
        },
      };
    case "REVEAL":
      return {
        ...state,
        revealAnswers: true,
        scores: calculateScores(state),
      };
    case "END":
      return {
        ...state,
        screen: "end",
        currentAnswers: {},
        currentQuestion: null,
        revealAnswers: false,
      };
    default:
      throw state;
  }
}

export default function useQuizGame(roomConnection: RoomConnectionRef): {
  state: GameState;
  actions: GameActions;
} {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { state: roomState, actions: roomActions } = roomConnection;

  useEffect(() => {
    if (roomState.mostRecentChatMessage) {
      try {
        const event = JSON.parse(roomState.mostRecentChatMessage.text);
        event.senderId = roomState.mostRecentChatMessage.senderId;
        dispatch(event);
      } catch (error) {
        console.log("Invalid command, ignoring");
      }
    }
  }, [roomState.mostRecentChatMessage]);

  return {
    state,
    actions: {
      start() {
        // TODO: Check if user is quiz master?
        // Separate type or just straight to question
        roomActions.sendChatMessage(JSON.stringify(questions[0]));
      },
      end() {
        if (!state.isQuizMaster) {
          console.warn("Not authorized to end quiz");
          return;
        }

        roomActions.sendChatMessage(
          JSON.stringify({
            type: "END",
          })
        );
      },

      // This will only be needed if we implement quiz-master UI
      postQuestion(question: Question) {
        if (!state.isQuizMaster) {
          console.warn("Not authorized to post question");
          return;
        }

        roomActions.sendChatMessage(
          JSON.stringify({
            type: "QUESTION",
            payload: question,
          })
        );
      },

      postAnswer(alternative: string) {
        roomActions.sendChatMessage(
          JSON.stringify({
            type: "ANSWER",
            payload: alternative,
          })
        );
      },

      // This will only be needed if we implement quiz-master UI
      revealAnswers() {
        if (!state.isQuizMaster) {
          console.warn("Not authorized to reveal answers");
          return;
        }

        roomActions.sendChatMessage(
          JSON.stringify({
            type: "REVEAL",
          })
        );
      },
    },
  };
}
