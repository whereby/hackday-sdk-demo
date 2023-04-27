import { useState, memo } from "react";
import { Box, Button, Flex, Wrap, Center, Heading } from "@chakra-ui/react";
import AnswerCard from "../../components/AnswerCard";
import QuestionCard from "../../components/QuestionCard";
import Title from "../../components/Title";
import VideoTile from "../../components/VideoTile";
import { motion } from "framer-motion";
import { GameActions, GameState } from "../../useQuizGame";
import { useRoomConnection } from "@whereby.com/browser-sdk";
import { current } from "@reduxjs/toolkit";
import questions from "../../events/questions";

type RoomConnectionRef = ReturnType<typeof useRoomConnection>;

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
  nextQuestionAnswer: () => void;
}

const MotionBox = motion(Box);

const QuestionView = ({
  question,
  answerQuestion,
  currentAnswer,
  reveal,
  nextQuestionAnswer,
}: QuestionViewProps) => {
  //const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);

  console.log("currentAnswer: ", currentAnswer);

  const {
    question: questionText = "",
    alternatives = [],
    correctAlternative = "",
  } = question || {};

  // TODO: Fix
  const boxVariants = {
    visible: {
      backgroundColor: ["#60F", "#09F", "#FA0"],
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
    //setCurrentAnswer(answer);
    if (!currentAnswer) {
      answerQuestion(answer);
    }
  };

  console.log("Questions", questions);

  return (
    <MotionBox
      key={questionText}
      // bgGradient="linear(to-r, grey, blue)"
      // alignItems="center"
      // justifyContent="center"
      // background="purple.200"
      gap={6}
      height="100%"
      variants={boxVariants}
      animate="visible"
      p="10"
    >
      <Heading>
        <Title>{questionText}</Title>
      </Heading>

      {/* TODO: use question view to change bg colour */}

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
      </Center>

      {reveal && (
        <Button
          onClick={() => {
            nextQuestionAnswer();
          }}
        >
          Next Question
        </Button>
      )}
      {/* 
      // {reveal && <Heading>The correct answer is: {correctAlternative}</Heading>} */}

      <Box>
        <Button onClick={() => {}}>Reveal answers</Button>
      </Box>
    </MotionBox>
  );
};

export default memo(QuestionView);
