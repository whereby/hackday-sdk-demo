import React from "react";
import { motion } from "framer-motion";
import { Flex, Text } from "@chakra-ui/react";

interface TitleProps {
  children: string;
}

const Title = ({ children }: TitleProps) => {
  const words = children.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      x: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const MotionFlex = motion(Flex);
  const MotionText = motion(Text);

  return (
    <MotionFlex
      overflow="hidden"
      fontSize="2rem"
      variants={container}
      initial="hidden"
      animate="visible"
      justifyContent="center"
    >
      {words.map((word, i) => (
        <MotionText key={i} variants={child} mr="1">
          {word}
        </MotionText>
      ))}
    </MotionFlex>
  );
};

export default Title;
