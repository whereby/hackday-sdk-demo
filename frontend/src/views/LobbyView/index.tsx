import { useState } from "react";
import { motion } from "framer-motion";

import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

import Title from "../../components/AnimatedTitle";
import { GameActions } from "../../useQuizGame";

interface LobbyViewProps {
  isQuizMaster: boolean;
  playerCount: number;
  quizActions: GameActions;
}

const MotionButton = motion(Button);

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
    <Box
      height="100%"
      // background="purple.200"
    >
      <Heading as="h1" mb="3">
        <Title>Game Lobby</Title>
      </Heading>
      <Text>Waiting for players...</Text>

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
