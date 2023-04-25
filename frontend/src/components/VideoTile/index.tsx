import React from "react";
import { motion, isValidMotionProp } from "framer-motion";
import { chakra, Box, shouldForwardProp, Avatar } from "@chakra-ui/react";
import { VideoView } from "@whereby.com/browser-sdk";

import "./styles.css";

//https://chakra-ui.com/getting-started/with-framer
const ChakraBox = chakra(motion.div, {
  /**
   * Allow motion props and non-Chakra props to be forwarded.
   */
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

interface VideoTileProps {
  id?: string;
  name?: string;
  stream: MediaStream | undefined;
  position?: {
    x?: number;
    y?: number;
  };
}

const VideoTile = ({ id, name, stream, position }: VideoTileProps) => {
  const className = "VideoTile";
  const { x, y } = position || {};

  return (
    <ChakraBox
      display="flex"
      flexDirection="column"
      alignItems="center"
      margin="2"
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
          height="240px"
          width="240px"
          borderRadius="16px"
          objectFit="cover"
        ></Box>
      ) : (
        <Avatar size="xl" name={name} />
      )}
      <span className={`${className}__name`}>{name}</span>
    </ChakraBox>
  );
};

export default VideoTile;
