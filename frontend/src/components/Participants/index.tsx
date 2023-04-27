import React, { useState, useEffect, useCallback, memo } from "react";
import { Box, Button, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import { motion, Reorder, AnimatePresence, usePresence } from "framer-motion";

import { RoomConnectionRef, GameState } from "../../useQuizGame";

import VideoTile from "../VideoTile";

interface ParticipantsProps {
  roomConnection: RoomConnectionRef;
  quizState: GameState;
}
// const MotionFlex = motion(Flex);

const Participants = ({ roomConnection, quizState }: ParticipantsProps) => {
  const { state: roomState } = roomConnection;
  const { remoteParticipants, localParticipant } = roomState;
  const { id } = localParticipant || {};

  const [tiles, setTiles] = useState([...remoteParticipants, localParticipant]);
  const [tilesAreSorted, setTilesAreSorted] = useState(false);
  // const [isFinalScore, setIsFinalScore] = useState(false);
  const [isPresent, safeToRemove] = usePresence();

  const [shouldAnimateResult, setShouldAnimateResult] = useState<{
    [participantId: string]: "correct" | "incorrect" | "no_vote";
  }>({});

  const { revealAnswers, currentAnswers , scores} = quizState;

  const sortTiles = useCallback(() => {
    if (!tilesAreSorted) {
      const shuffled = [...tiles].sort((a, b) => 0.5 - Math.random());
      setTiles(shuffled);
      setTilesAreSorted(true);
    }
  }, [tiles, tilesAreSorted]);

  // Determine correct / incorrect answers once reveal goes from false -> true
  useEffect(() => {
    if (quizState.revealAnswers) {
      setTilesAreSorted(false);
      let res = {};
      if (!currentAnswers) return;

      tiles.forEach((t) => {
        if (!t) return;
        res[t.id] =
          currentAnswers[t.id] === quizState.currentQuestion?.correctAlternative
            ? "correct"
            : "incorrect";
      });

      console.log(res);
      setShouldAnimateResult(res);
      const timer = setTimeout(() => {
        sortTiles();
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setShouldAnimateResult({});
    }
  }, [
    currentAnswers,
    quizState.currentQuestion?.correctAlternative,
    quizState.revealAnswers,
    sortTiles,
    tiles,
  ]);

  //  const scoreboard = allParticipants
  // .map((p) => {
  //   return {
  //     participantId: p.id,
  //     participantName: p.displayName || "Unknown quizzer",
  //     score: scores[p.id] || 0,
  //   };
  // })
  // .sort((a, b) => b.score - a.score);

  // useEffect(() => {
  //   if(quizState.screen === "end")
  // }

  // console.log(shouldAnimateResult);

  useEffect(() => {
    const allParticipants = [...remoteParticipants, localParticipant];
    setTiles(allParticipants);
  }, [remoteParticipants, localParticipant]);

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
    <Flex gap="4" height="35vh" overflow="auto">
      <Button onClick={sortTiles} position="absolute" left="0" bottom="10" zIndex="100">Shuffle</Button> 
      <Flex marginLeft="80px">
      <AnimatePresence>
        {tiles.map((participant) => {
          if (!participant) return null;

          const { id, stream, displayName } = participant;
          const hasParticipantAnswered = !!(currentAnswers || {})[id];

          return (
            <motion.div {...animationProps} key={id}>
              <VideoTile
                stream={stream}
                name={displayName}
                hasAnswered={hasParticipantAnswered}
                questionResult={shouldAnimateResult[id]}
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
