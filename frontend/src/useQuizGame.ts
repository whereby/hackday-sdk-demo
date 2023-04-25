/**
 * This is a hook to manage the state of the game.
 * Depends on the room connection state.
 */

import { useEffect, useReducer } from "react";
import { useRoomConnection } from "@whereby.com/browser-sdk";

// This is a hack, need to expose this type directly from the SDK
type RoomConnectionRef = ReturnType<typeof useRoomConnection>;

interface Question {
  question: string;
  alternatives: QuestionAlternatives;
  correctAlternative: string;
}

interface QuestionAlternatives {
  [alternativeId: string]: string;
}

interface GameState {
  isQuizMaster: boolean;
  scores: {
    [participantId: string]: number;
  };
  screen: "welcome" | "question" | "end";
  currentAnswers: {
    [participantId: string]: string;
  };
  currentQuestion: Question | null;
  revealAnswers: boolean;
}

interface GameActions {
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
  currentAnswers: {},
  currentQuestion: null,
  revealAnswers: false,
  scores: {},
  screen: "welcome",
};

function reducer(state: GameState, event: GameEvents): GameState {
  switch (event.type) {
    case "QUESTION":
      return {
        ...state,
        screen: "question",
        currentAnswers: {},
        revealAnswers: false,
        currentQuestion: event.payload,
        // TODO: Calculate scores from prev question
      };
    case "ANSWER":
      return {
        ...state,
        currentAnswers: {
          ...state.currentAnswers,
        },
      };
    case "REVEAL":
      return {
        ...state,
        revealAnswers: true,
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

      postAnswer(alternative: string) {
        roomActions.sendChatMessage(
          JSON.stringify({
            type: "ANSWER",
            payload: {
              alternative,
            },
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
