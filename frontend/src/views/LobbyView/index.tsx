import { useState } from "react";
import { motion } from "framer-motion";

import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

import AnimatedTitle from "../../components/AnimatedTitle";
import { GameActions } from "../../useQuizGame";
import QRCode from "react-qr-code";

interface LobbyViewProps {
  isQuizMaster: boolean;
  playerCount: number;
  quizActions: GameActions;
}

const MotionButton = motion(Button);

const tileSize = ["120px", "120px", "240px"];


const LobbyView = ({
  playerCount,
  quizActions,
  isQuizMaster,
}: LobbyViewProps) => {
  const [buttonClicked, setButtonClicked] = useState(false);

  // Just playing around with variants here
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
    setButtonClicked(true);
    quizActions.start();
  };

  return (
    <Box height="100%">
      <Heading as="h1" mt="10" mb="4">
        <AnimatedTitle>Game Lobby</AnimatedTitle>
      </Heading>
      <Text>Waiting for players...</Text>
     <Box h={tileSize}
        w={tileSize} position="absolute" right="10" top="10"><QRCode value="https://hackday-sdk-demo.netlify.app/" /></Box>

      <Flex
        flexDirection="column"
        p="10"
        h="300px"
        w="100%"
        overflow="hidden"
        color="white"
        justifyContent="center"
        alignItems="center"
      >
        <Text fontSize="2xl" fontWeight="bold" mb="4">
          {playerCount} Players
        </Text>
        {isQuizMaster && (
          <MotionButton
            onClick={handleOnReady}
            variants={buttonVariants}
            size="md"
            animate={buttonClicked ? "clicked" : "notClicked"}
            whileHover="hover"
            whileTap="pressed"
            py="10"
            fontSize="2xl"
            background="green.500"
            w="50%"
          >
            {buttonClicked ? "Let's go!" : "Start Game"}
          </MotionButton>
        )}
      </Flex>
    </Box>
  );
};

export default LobbyView;
