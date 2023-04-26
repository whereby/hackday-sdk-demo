import { Button } from "@chakra-ui/react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";

interface AnswerCardProps {
  answerText?: string;
  locked: boolean;
  isSelected: boolean;
  onSelected: () => void;
}

const AnswerCard = ({
  locked,
  answerText,
  onSelected,
  isSelected,
}: AnswerCardProps) => {
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
      scale: 1
    },
  };
  const rotate = useMotionValue(0);

  const scale = useTransform(rotate, [0, 270], [0, 1]);
  console.log("locked", locked);


  return (
    <>
      <Button
        height="400px"
        width="400px"
        borderColor="green.500"
        borderWidth={isSelected ? "8px" : "0px"}
        onClick={() => onSelected()}
        colorScheme="blackAlpha"
      >
        {answerText}
      </Button>
    </>
  );
};
export default AnswerCard;
