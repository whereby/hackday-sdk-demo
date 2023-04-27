import { useState, useEffect, useCallback } from "react";
import { motion, useAnimate } from "framer-motion";
import { Box, Avatar, AvatarBadge, Text, Center } from "@chakra-ui/react";
import { VideoView } from "@whereby.com/browser-sdk";

import "./styles.css";

interface VideoTileProps {
  id?: string;
  name?: string;
  stream: MediaStream | undefined;
  position?: {
    x?: number;
    y?: number;
  };
  hasAnswered?: boolean;
  animation?: string;
  questionResult?: "correct" | "incorrect" | "no_vote" | null;
}

const ChakraBox = motion(Box);

const VideoTile = ({
  id,
  name,
  stream,
  position,
  animation,
  hasAnswered,
  questionResult,
}: VideoTileProps) => {
  const [scope, animate] = useAnimate();

  console.log("questionResult:", questionResult);
  const { x, y } = position || {};

  const popAnimation = useCallback(async () => {
    await animate(scope.current, { scale: 1.5 });
    await animate(scope.current, { scale: 1 });
  }, [animate, scope]);

  const rotateAnimation = useCallback(async () => {
    await animate(scope.current, { rotate: -90 });
    await animate(scope.current, { scale: 1.5 });
    await animate(scope.current, { rotate: 0 });
    await animate(scope.current, { scale: 1 });
  }, [animate, scope]);

  const answeredAnimation = useCallback(async () => {
    await animate(scope.current, { rotate: -90 });
    await animate(scope.current, { rotate: 0 });
  }, [animate, scope]);

  useEffect(() => {
    popAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (stream) rotateAnimation();
  }, [stream, rotateAnimation]);

  useEffect(() => {
    if (hasAnswered) answeredAnimation();
  }, [hasAnswered, answeredAnimation]);

  useEffect(() => {
    console.log("oi");
    if (questionResult === "correct") {
      console.log("oi again");
      rotateAnimation();
    } else if (questionResult === "incorrect") {
      popAnimation();
    }
  }, [popAnimation, questionResult, rotateAnimation]);

  return (
    <ChakraBox
      display="flex"
      flexDirection="column"
      alignItems="center"
      margin="2"
      ref={scope}
      animate={{ x, y }}
      whileHover={{ scale: [null, 1.1, 1.05], rotate: 1 }}
      // @ts-ignore no problem in operation, although type error appears.
      transition={{
        ease: "easeOut",
        duration: 0.25,
        y: {
          type: "spring",
          duration: 2,
        },
      }}
    >
      <Center
        h="240px"
        w="240px"
        background="gray.200"
        borderRadius="16px"
        borderColor="green.500"
        borderWidth={hasAnswered ? "8px" : "0px"}
        overflow="hidden"
      >
        {stream ? (
          <Box
            as={VideoView}
            key={id}
            stream={stream}
            w="100%"
            h="100%"
            objectFit="cover"
          />
        ) : (
          <Avatar size="xl" name={name}>
            {hasAnswered && <AvatarBadge boxSize="1.25em" bg="green.500" />}
          </Avatar>
        )}
      </Center>
      {/* {stream ? (
        <Center
          as={VideoView}
          key={id}
          stream={stream}
          h="240px"
          w="240px"
          borderRadius="16px"
          objectFit="cover"
          borderColor="green.500"
          borderWidth={hasAnswered ? "8px" : "0px"}
        ></Center>
      ) : (
        <Center h="240px" w="240px">
          <Avatar size="xl" name={name}>
            {hasAnswered && <AvatarBadge boxSize="1.25em" bg="green.500" />}
          </Avatar>
        </Center>
      )} */}
      <Text>{name}</Text>
    </ChakraBox>
  );
};

export default VideoTile;
