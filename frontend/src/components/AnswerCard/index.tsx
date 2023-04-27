import { Box, Button } from "@chakra-ui/react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState, useMemo } from "react";

interface AnswerCardProps {
  answerText?: string;
  locked: boolean;
  isSelected: boolean;
  isCorrect: boolean;
  reveal: boolean;
  onSelected: () => void;
}

const ChakraButton = motion(Button);

const AnswerCard = ({
  locked,
  answerText,
  onSelected,
  isSelected,
  isCorrect,
  reveal,
}: AnswerCardProps) => {
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

  console.log(isSelected);

  const rotate = useMotionValue(0);
  const scale = useTransform(rotate, [0, 270], [0, 1]);

  const borderColor = useMemo(() => {
    if (reveal) {
      if (isCorrect) return "green.300";

      return "red.300";
    }

    if (isSelected) return "blue.300";

    return "";
  }, [isSelected, reveal, isCorrect]);

  return (
    <ChakraButton
      style={{
        height: "400px",
        width: "400px",
        // rotate,
        // scale,
      }}
      // variants={blockVariants}
      // initial="initial"
      // animate="target"
      // whileTap={locked ? "clicked" : "notClicked"}
      transition={{
        ease: "easeInOut",
        duration: 2,
        delay: 1,
      }}
      borderColor={borderColor}
      borderWidth={isSelected || reveal ? "8px" : "0px"}
      onClick={() => onSelected()}
      colorScheme="blackAlpha"
    >
      {answerText}
    </ChakraButton>
  );
};
export default AnswerCard;
