import {Button } from "@chakra-ui/react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";


interface AnswerCardProps {
    answerText?: string;
  }

const AnswerCard  = ({ answerText}: AnswerCardProps) => {
  const ChakraButton= motion(Button);
  const [buttonClicked, setButtonClicked] = useState(false);
    
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
      }
      };
        const rotate = useMotionValue(0);
 
        const scale = useTransform(rotate, [0, 270], [0, 1]);
        const handleOnClick = () => {setButtonClicked(!buttonClicked)}
          return (
            <>
            <ChakraButton
              style={{
                height: '400px',
                width: '400px',
                borderRadius: '10px',
                rotate,
                scale,
              }}
              variants={blockVariants}
              initial="initial"
              animate="target"
              whileTap={buttonClicked ? "clicked" : "notClicked"}
              transition={{
                ease: 'easeInOut',
                duration: 2,
                delay: 1
              }}
              onClick={handleOnClick}
              colorScheme='blackAlpha'
            >{answerText}</ChakraButton> 
            </>

          );

    
}
export default AnswerCard;