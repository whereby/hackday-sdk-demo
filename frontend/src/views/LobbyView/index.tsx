import { useState } from "react";

import {
  useLocalMedia,
  VideoView,
  useRoomConnection,
} from "@whereby.com/browser-sdk";

import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

import VideoTile from "../../components/VideoTile";
import { WHEREBY_ROOM } from "../../config/constants";
import useQuizGame from "../../useQuizGame";
import QuestionView from "../QuestionView";
import { motion } from "framer-motion";

const LobbyView = ({ localMedia}: any) => {
  const [tilePositions, setTilePositions] = useState({});

  const roomConnection = useRoomConnection(WHEREBY_ROOM, {
    localMedia,
    logger: console,
    localMediaConstraints: {
      audio: false,
      video: true,
    },
  });
  const { state: quizState, actions: quizActions } =
    useQuizGame(roomConnection);

  console.log("Quiz screen", quizState.screen);

  const { localStream } = localMedia.state;
  const { state, actions, components } = roomConnection;
  const { roomConnectionStatus, remoteParticipants } = state;
  const ChakraBox = motion(Box);

  console.log(remoteParticipants);
  return (
    <Box>
      <Heading as="h1" mb="3">
        Game Lobby
      </Heading>
      <Text>Waiting for players...</Text>

      <Box>
        <VideoTile stream={localStream} name={"You"} />
      </Box>

      <Flex>
        {remoteParticipants.map((p) => {
          const { id, stream, displayName } = p;
          return <VideoTile key={id} stream={stream} name={displayName} />;
        })}
      </Flex>

      <Box>
        <Button
          m={2}
          onClick={() => {
            setTilePositions({ y: 400 });
          }}
        >
          Shift!
        </Button>
        <Flex>
          <VideoTile stream={localStream} />
          <VideoTile stream={localStream} position={tilePositions} />
          <VideoTile stream={localStream} />
          <VideoTile stream={localStream} position={tilePositions} />
        </Flex>
      </Box>
      <ChakraBox>
      <QuestionView quizState={quizState} localMedia={localMedia} roomConnection={roomConnection}/>
      </ChakraBox>

    </Box>
  );
};

export default LobbyView;
