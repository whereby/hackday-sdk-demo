import React, { useState, useEffect, useMemo, memo } from "react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { motion, Reorder, AnimatePresence, usePresence } from "framer-motion";

import { RoomConnectionRef, GameState } from "../../useQuizGame";

import VideoTile from "../VideoTile";

interface ParticipantsProps {
  roomConnection: RoomConnectionRef;
  quizState: GameState;
}
const MotionFlex = motion(Flex);

const Participants = ({ roomConnection, quizState }: ParticipantsProps) => {
  const { state: roomState } = roomConnection;
  const { remoteParticipants, localParticipant } = roomState;
  const { stream: localStream, id: selfId = "" } = localParticipant || {};

  const hasAnswered = !!(
    quizState.currentAnswers && quizState.currentAnswers[selfId]
  );

  const [tiles, setTiles] = useState([...remoteParticipants, localParticipant]);
  const [isPresent, safeToRemove] = usePresence();

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

  const sortTiles = () => {
    console.log("sortTiles");
    const shuffled = [...tiles].sort((a, b) => 0.5 - Math.random());
    setTiles(shuffled);
  };

  console.log(tiles);

  return (
    <MotionFlex gap="4">
      <Button onClick={sortTiles}>Shuffle</Button>
      <AnimatePresence>
        {tiles.map((participant) => {
          if (!participant) return null;

          const { id, stream, displayName } = participant;
          // const hasParticipantAnswered = !!(quizState.currentAnswers || {})[id];
          // console.log(hasParticipantAnswered);

          return (
            <motion.div {...animationProps} key={id}>
              <VideoTile
                stream={stream}
                name={displayName}
                hasAnswered={false}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
      {/* <VideoTile stream={localStream} name={"You"} hasAnswered={hasAnswered} />
      {remoteParticipants.map((participant, i) => {
        const { id, stream, displayName } = participant;
        const hasParticipantAnswered = !!(quizState.currentAnswers || {})[id];
        console.log(hasParticipantAnswered);

        return (
          <VideoTile
            key={id}
            stream={stream}
            name={displayName}
            hasAnswered={hasParticipantAnswered}
          />
        );
      })} */}
    </MotionFlex>
  );
};

// tileOrder.map((participant) => {
//   console.log("inside map");
//   console.log(participant);
//   if (!participant) return null;
//   // const participant = participants.find((p) => p?.id === participantId);

//   const { id, stream, displayName } = participant;
//   // const hasParticipantAnswered = !!(quizState.currentAnswers || {})[
//   //   participantId
//   // ];

//   return (
//     <Reorder.Item key={id} value={participant}>
//       <VideoTile
//         stream={stream}
//         name={displayName}
//         hasAnswered={false}
//       />
//     </Reorder.Item>
//   );
// })}

export default memo(Participants);
