import { GameState, RoomConnectionRef } from "../../useQuizGame";
import { motion } from "framer-motion";

import { Heading, Box } from "@chakra-ui/react";
import Participants from "../../components/Participants";

interface ScoreboardProps {
  quizState: GameState;
  roomConnection: RoomConnectionRef;
  style?: React.CSSProperties;
  variant: "end" | "in-game";
}

export default function Scoreboard({
  quizState,
  roomConnection,
  style,
  variant,
}: ScoreboardProps) {
  const { scores } = quizState;
  const { localParticipant, remoteParticipants } = roomConnection.state;

  if (!localParticipant) {
    return <div>Error! Missing local participant</div>;
  }

  const allParticipants = [localParticipant, ...remoteParticipants];

  const scoreboard = allParticipants
    .map((p) => {
      return {
        participantId: p.id,
        participantName: p.displayName || "Unknown quizzer",
        score: scores[p.id] || 0,
      };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <div style={style}>
      <Heading my="8">Final Scores</Heading>
      <motion.div layout>
        <Box mb="8">
          <Participants
            roomConnection={roomConnection}
            quizState={quizState}
            variant="small"
            screen="scoreboard"
          />
        </Box>
      </motion.div>
      {scoreboard.map((s) => (
        <motion.h1 key={s.participantId} layout>
          {s.score} - {s.participantName}
        </motion.h1>
      ))}
    </div>
  );
}
