import { Box, Button } from "@chakra-ui/react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";

interface AnswerCardProps {
  answerText?: string;
  locked: boolean;
  isSelected: boolean;
  onSelected: () => void;
}

const AnswerCard = ({ locked, answerText, onSelected }: AnswerCardProps) => {
  const ChakraButton = motion(Button);

  const blockVariants = {
    initial: {
      rotate: 0,
    },
    target: {
      rotate: 360,
    },
    clicked: {
      scale: 1.5,
    },
    notClicked: {
      scale: 1,
    },
  };
  const rotate = useMotionValue(0);

  const scale = useTransform(rotate, [0, 270], [0, 1]);
  return (
    <ChakraButton
      style={{
        height: "400px",
        width: "400px",
        borderRadius: "10px",
        rotate,
        scale,
      }}
      variants={blockVariants}
      initial="initial"
      animate="target"
      // whileTap={locked ? "clicked" : "notClicked"}
      transition={{
        ease: "easeInOut",
        duration: 2,
        delay: 1,
      }}
      onClick={() => onSelected()}
      colorScheme="blackAlpha"
    >
      {answerText}
    </ChakraButton>
  );
};
export default AnswerCard;
