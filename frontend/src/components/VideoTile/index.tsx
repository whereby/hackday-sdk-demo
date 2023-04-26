import { useEffect, useCallback } from "react";
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
  isAnsweredBadge?: boolean;
  animation?: string;
}

const VideoTile = ({
  id,
  name,
  stream,
  position,
  animation,
  isAnsweredBadge,
}: VideoTileProps) => {
  const [scope, animate] = useAnimate();

  const { x, y } = position || {};

  const rotateAnimation = useCallback(async () => {
    await animate(scope.current, { rotate: -90 });
    await animate(scope.current, { scale: 1.5 });
    await animate(scope.current, { rotate: 0 });
    await animate(scope.current, { scale: 1 });
  }, [animate, scope]);

  useEffect(() => {
    if (stream) rotateAnimation();
  }, [stream, rotateAnimation]);

  const ChakraBox = motion(Box);

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
      {stream ? (
        <Box
          as={VideoView}
          key={id}
          stream={stream}
          h="240px"
          w="240px"
          borderRadius="16px"
          objectFit="cover"
        />
      ) : (
        <Center h="240px" w="240px">
          <Avatar size="xl" name={name}>
            {isAnsweredBadge && <AvatarBadge boxSize="1.25em" bg="green.500" />}
          </Avatar>
        </Center>
      )}
      <Text>{name}</Text>
    </ChakraBox>
  );
};

export default VideoTile;
