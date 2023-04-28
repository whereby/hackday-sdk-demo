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

  const handleClick = (answer) => {
    if (!currentAnswer) {
      answerQuestion(answer);
    }
  };

  return (
    <Flex
      key={questionText}
      flexDir="column"
      justifyContent="center"
      gap={6}
      height="100%"
      p="4"
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
        gap="4"
        flexDirection="column"
        alignItems="center"
        h="100%"
        w="100%"
      >
        <Flex my="4" w="100%" h="240px">
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

        <Box mb="8">
          {reveal && isQuizMaster && (
            <Button onClick={nextQuestionAction}>Next Question</Button>
          )}

          {!reveal && isQuizMaster && (
            <Button onClick={revealQuestionAnswers}>Reveal answers</Button>
          )}
        </Box>
      </Center>
    </Flex>
  );
};

export default memo(QuestionView);
