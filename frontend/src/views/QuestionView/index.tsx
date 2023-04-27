import { memo } from "react";
import { motion } from "framer-motion";
import { Box, Button, Center, Heading, Text } from "@chakra-ui/react";

import Title from "../../components/AnimatedTitle";
import AnswerCard from "../../components/AnswerCard";

interface Question {
  question: string;
  alternatives: Record<string, string>;
  correctAlternative: string;
}

interface QuestionViewProps {
  answerQuestion: (string) => void;
  question: Question | null;
  currentAnswer: string | null;
  reveal: boolean;
  revealQuestionAnswers: () => void;
  nextQuestionAction: () => void;
  isQuizMaster: boolean;
}

const MotionBox = motion(Box);

const QuestionView = ({
  question,
  answerQuestion,
  currentAnswer,
  reveal,
  nextQuestionAction,
  revealQuestionAnswers,
  isQuizMaster,
}: QuestionViewProps) => {
  const {
    question: questionText = "",
    alternatives = [],
    correctAlternative = "",
  } = question || {};

  // TODO: Fix
  const boxVariants = {
    visible: {
      // backgroundColor: ["#60F", "#09F", "#FA0"],
      transition: {
        delay: 1,
        duration: 2,
        ease: [0.075, 0.82, 0.165, 1],
        // repeat: Infinity,
        // repeatType: "reverse",
      },
    },
  };

  const handleClick = (answer) => {
    if (!currentAnswer) {
      answerQuestion(answer);
    }
  };

  return (
    <MotionBox
      // key={questionText}
      // bgGradient="linear(to-r, grey, blue)"
      // alignItems="center"
      // justifyContent="center"
      // background="purple.200"
      gap={6}
      // height="70vh"
      variants={boxVariants}
      animate="visible"
      p="10"
      // overflow="auto"
    >
      <Heading>
        {Boolean(currentAnswer) || reveal ? (
          <Text as="h1">{questionText}</Text>
        ) : (
          <Title>{questionText}</Title>
        )}
      </Heading>
      <Center justifyContent="space-evenly" alignItems="center" h="100%">
        {Object.keys(alternatives).map((k) => {
          return (
            <AnswerCard
              isCorrect={question?.correctAlternative === k}
              reveal={reveal}
              key={k}
              locked={!!currentAnswer}
              isSelected={currentAnswer === k}
              answerText={alternatives[k]}
              onSelected={() => handleClick(k)}
            />
          );
        })}
        {reveal && (
          <Heading>
            The correct answer is: {alternatives[correctAlternative]}
          </Heading>
        )}

        {reveal && isQuizMaster && (
          <Button
            onClick={() => {
              nextQuestionAction();
            }}
          >
            Next Question
          </Button>
        )}
        {/* 
      // {reveal && <Heading>The correct answer is: {correctAlternative}</Heading>} */}
        {!reveal && isQuizMaster && (
          <Box>
            <Button
              onClick={() => {
                revealQuestionAnswers();
              }}
            >
              Reveal answers
            </Button>
          </Box>
        )}
      </Center>
    </MotionBox>
  );
};

export default memo(QuestionView);
