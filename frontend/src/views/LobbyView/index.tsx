import { useState } from "react";
import { motion } from "framer-motion";

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

import { chakraMotionElement } from "../../utils/useChakraMotion";

interface LobbyViewProps {
  localMedia: any;
  onGameReady: () => void;
}

const LobbyView = ({ localMedia, onGameReady }: LobbyViewProps) => {
  const [tilePositions, setTilePositions] = useState({});
  const [buttonClicked, setButtonClicked] = useState(false);
  const [animation, setAnimation] = useState("");

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

  const MotionButton = motion(Button);

  const buttonVariants = {
    hover: {
      scale: 1.25,
      backgroundColor: "#38A169",
      transition: {
        type: "spring",
        stiffness: 200,
        mass: 1,
        damping: 1,
      },
    },
    pressed: {
      scale: 1.2,
    },
    clicked: {
      transition: {
        type: "tween",
        ease: "anticipate",
        duration: 0.25,
      },
    },
    notClicked: {},
  };

  const handleOnReady = () => {
    console.log("handleOnReady");
    setButtonClicked(true);
    onGameReady();
    setAnimation("fly-out");
  };

  const numParticipants = remoteParticipants.length + 1;

  return (
    <Box>
      <Heading as="h1" mb="3">
        Game Lobby
      </Heading>
      <Text>Waiting for players...</Text>
      <Flex flexWrap="wrap">
        <VideoTile stream={localStream} name={"You"} animation={animation} />
        <VideoTile stream={localStream} name={"You"} animation={animation} />
        <VideoTile stream={localStream} name={"You"} animation={animation} />
        <VideoTile stream={localStream} name={"You"} animation={animation} />
        {remoteParticipants.map((p) => {
          const { id, stream, displayName } = p;
          return <VideoTile key={id} stream={stream} name={displayName} />;
        })}
      </Flex>

      {/* TODO: potentially move this control / button pane out */}
      <Flex
        flexDirection="column"
        position="absolute"
        p="10"
        bottom="0"
        right="0"
        background="purple.500"
        h="300px"
        w="25%"
        borderTopLeftRadius="16px"
        overflow="hidden"
        color="white"
      >
        <Text fontSize="2xl" fontWeight="bold" mb="4">
          {numParticipants} Players
        </Text>
        <MotionButton
          onClick={handleOnReady}
          variants={buttonVariants}
          size="lg"
          animate={buttonClicked ? "clicked" : "notClicked"}
          whileHover="hover"
          whileTap="pressed"
          py="10"
          fontSize="2xl"
          background="green.500"
        >
          {buttonClicked ? "Let's go!" : "Start Game"}
        </MotionButton>
      </Flex>

      {/* <Box>
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
      <QuestionView quizState={quizState} localMedia={localMedia} roomConnection={roomConnection} quizActions={quizActions}/>
      </ChakraBox>

      </Box> */}
    </Box>
  );
};

export default LobbyView;
