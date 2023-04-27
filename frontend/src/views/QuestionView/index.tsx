import { memo } from "react";
import { motion } from "framer-motion";
import { Flex, Box, Button, Center, Heading, Text } from "@chakra-ui/react";

import AnimatedTitle from "../../components/AnimatedTitle";
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

  // TODO: Add new background
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
      p="4"
      // overflow="auto"
    >
      <Heading>
        {Boolean(currentAnswer) || reveal ? (
          <Text as="h1" fontWeight="800">
            {questionText}
          </Text>
        ) : (
          <AnimatedTitle>{questionText}</AnimatedTitle>
        )}
      </Heading>
      <Center
        justifyContent="space-evenly"
        flexDirection="column"
        alignItems="center"
        h="100%"
        w="100%"
      >
        <Flex gap="4" my="4" w="100%" h="240px">
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
        </Flex>

        <Heading my="4" visibility={reveal ? "inherit" : "hidden"}>
          The correct answer is: {alternatives[correctAlternative]}
        </Heading>

        <Box>
          {reveal && isQuizMaster && (
            <Button onClick={nextQuestionAction}>Next Question</Button>
          )}

          {!reveal && isQuizMaster && (
            <Button onClick={revealQuestionAnswers}>Reveal answers</Button>
          )}
        </Box>
      </Center>
    </MotionBox>
  );
};

export default memo(QuestionView);
