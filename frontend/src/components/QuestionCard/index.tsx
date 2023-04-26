import {Heading } from "@chakra-ui/react";
import { motion, useMotionValue, useTransform } from "framer-motion";


interface QuestionCardProps {
    id?: string;
    questionText?: string;
  }

const QuestionCard  = ({ id, questionText}: QuestionCardProps) => {
    
    const blockVariants = {
        initial: {
          rotate: 0,
        },
        target: {
          rotate: 360,
        }
      };
        const rotate = useMotionValue(0);
 
        const scale = useTransform(rotate, [0, 270], [0, 1]);
        const ChakraHeading= motion(Heading);

          return (
            <ChakraHeading
              style={{
                rotate,
                scale,
              }}
              variants={blockVariants}
              initial="initial"
              animate="target"
              transition={{
                ease: 'easeInOut',
                duration: 2,
              }}
              alignItems="center"
              justifyContent="center"
            >{questionText}</ChakraHeading> 

          );

    
}
export default QuestionCard;