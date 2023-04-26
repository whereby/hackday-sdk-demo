import { useState } from "react";
import { motion } from "framer-motion";

import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

interface LobbyViewProps {
  playerCount: number;
  onGameReady: () => void;
}

const LobbyView = ({ playerCount, onGameReady }: LobbyViewProps) => {
  const [buttonClicked, setButtonClicked] = useState(false);

  const MotionButton = motion(Button);

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
    onGameReady();
  };

  return (
    <Box>
      <Heading as="h1" mb="3">
        Game Lobby
      </Heading>
      <Text>Waiting for players...</Text>

      <Flex
        flexDirection="column"
        p="10"
        background="gray.200"
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
      </Flex>
    </Box>
  );
};

export default LobbyView;
