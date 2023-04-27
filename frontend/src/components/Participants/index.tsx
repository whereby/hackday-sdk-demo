import { useState, useEffect, useCallback, memo } from "react";
import { Button, Flex } from "@chakra-ui/react";
import { motion, AnimatePresence, usePresence } from "framer-motion";

import { RoomConnectionRef, GameState } from "../../useQuizGame";

import VideoTile from "../VideoTile";

interface ParticipantsProps {
  roomConnection: RoomConnectionRef;
  quizState: GameState;
}

const Participants = ({ roomConnection, quizState }: ParticipantsProps) => {
  const { state: roomState } = roomConnection;
  const { remoteParticipants, localParticipant } = roomState;

  // const [isFinalScore, setIsFinalScore] = useState(false);
  const [tiles, setTiles] = useState([...remoteParticipants, localParticipant]);
  const [isPresent, safeToRemove] = usePresence();
  const [roundResults, setRoundResults] = useState<{
    [participantId: string]: "correct" | "incorrect" | "no_vote";
  }>({});

  const { revealAnswers, currentAnswers, currentQuestion, scores } = quizState;
  // TODO: fix currentAnswers interface

  const sortTiles = useCallback(() => {
    console.log("Sorting tiles!");
    // TODO: sort by score
    const shuffled = [...tiles].sort((a, b) => {
      const aId = a?.id || "unknown";
      const aName = a?.displayName || "Unknown";
      const bId = b?.id || "unknown";
      const bName = b?.displayName || "Unknown";

      const aScore = scores[aId] || 0;
      const bScore = scores[bId] || 0;

      if (aScore === bScore) {
        if (aName >= bName) {
          return -1;
        } else {
          return 1;
        }
      } else if (aScore > bScore) {
        return -1;
      } else {
        return 1;
      }
    });
    setTiles(shuffled);
  }, [tiles, scores]);

  // Should only be triggered when revealAnswers changes - don't change dep array
  useEffect(() => {
    if (revealAnswers) {
      const timer = setTimeout(() => {
        sortTiles();
      }, 3000);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealAnswers]);

  // Should only be triggered when participants change
  useEffect(() => {
    const allParticipants = [...remoteParticipants, localParticipant];

    setTiles(allParticipants);
  }, [remoteParticipants, localParticipant]);

  useEffect(() => {
    if (revealAnswers) {
      if (!currentAnswers) return;

      const results = tiles.reduce((res, tile) => {
        if (!tile) return res;

        const answer = currentQuestion?.correctAlternative;
        const result =
          currentAnswers[tile.id] === answer ? "correct" : "incorrect";

        return { ...res, [tile.id]: result };
      }, {});

      setRoundResults(results);
    } else {
      setRoundResults({});
    }
  }, [
    currentAnswers,
    currentQuestion?.correctAlternative,
    revealAnswers,
    sortTiles,
    tiles,
  ]);

  const transition = { type: "spring", stiffness: 500, damping: 50, mass: 1 };

  const animationProps = {
    layout: true,
    initial: "out",
    // style: {
    //   // position: isPresent ? "static" : "absolute",
    // },
    animate: isPresent ? "in" : "out",
    whileTap: "tapped",
    variants: {
      // in: { scaleY: 1, opacity: 1, color: "green" },
      // out: { scaleY: 0, opacity: 0.5, zIndex: -1, color: "blue" },
      // tapped: { scale: 0.98, opacity: 0.5, transition: { duration: 0.1 } },
    },
    onAnimationComplete: () => !isPresent && safeToRemove(),
    transition,
  };

  return (
    <Flex gap="4" height="35vh">
      <Button
        onClick={sortTiles}
        position="absolute"
        left="0"
        bottom="10"
        zIndex="100"
      >
        Shuffle
      </Button>
      <Flex marginLeft="80px">
        <AnimatePresence>
          {tiles.map((participant) => {
            if (!participant) return null;

            const { id, stream, displayName } = participant;
            const hasParticipantAnswered = !!(currentAnswers || {})[id];

            return (
              <motion.div {...animationProps} key={id}>
                <VideoTile
                  muted={localParticipant?.id === id}
                  stream={stream}
                  name={`${displayName} - ${scores[id] || 0} points`}
                  hasAnswered={hasParticipantAnswered}
                  roundResult={roundResults[id]}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </Flex>
    </Flex>
  );
};

export default memo(Participants);
