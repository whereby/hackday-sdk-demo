import React, { useState, useEffect, useMemo, memo } from "react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { motion, Reorder } from "framer-motion";

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

  const allParticipants = [...remoteParticipants, localParticipant];
  console.log("participants: all", allParticipants);

  const [tileOrder, setTileOrder] = useState(allParticipants);

  useEffect(() => {
    setTileOrder(tileOrder);
  }, [roomConnection, tileOrder]);

  return (
    <MotionFlex gap="4">
      {/* <OrderedTiles participants={allParticipants} /> */}
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
      <Reorder.Group axis="x" values={tileOrder} onReorder={setTileOrder}>
        {tileOrder.map((participant) => {
          console.log("inside map");
          console.log(participant);
          if (!participant) return null;
          // const participant = participants.find((p) => p?.id === participantId);

          const { id, stream, displayName } = participant;
          // const hasParticipantAnswered = !!(quizState.currentAnswers || {})[
          //   participantId
          // ];

          return (
            <Reorder.Item key={id} value={participant}>
              <VideoTile
                stream={stream}
                name={displayName}
                hasAnswered={false}
              />
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    </MotionFlex>
  );
};

// const OrderedTiles = ({ participants }) => {
//   const [tileOrder, setTileOrder] = useState(participants);

//   useEffect(() => {
//     setTileOrder(tileOrder);
//   }, [participants, tileOrder]);

//   return (
//     <Reorder.Group axis="x" values={tileOrder} onReorder={setTileOrder}>
//       {tileOrder.map((participant) => {
//         console.log("inside map");
//         console.log(participant);
//         if (!participant) return null;
//         // const participant = participants.find((p) => p?.id === participantId);

//         const { id, stream, displayName } = participant;
//         // const hasParticipantAnswered = !!(quizState.currentAnswers || {})[
//         //   participantId
//         // ];

//         return (
//           <Reorder.Item key={id} value={participant}>
//             <VideoTile stream={stream} name={displayName} hasAnswered={false} />
//           </Reorder.Item>
//         );
//       })}
//     </Reorder.Group>
//   );
// };

export default memo(Participants);
