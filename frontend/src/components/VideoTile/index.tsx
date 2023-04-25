import React from "react";
import { motion, isValidMotionProp } from "framer-motion";
import { chakra, Box, Skeleton, shouldForwardProp } from "@chakra-ui/react";
import { VideoView } from "@whereby.com/browser-sdk";

import "./styles.css";

interface VideoTileProps {
  id?: string;
  stream: MediaStream | null;
  position?: {
    x?: number;
    y?: number;
  };
}

//https://chakra-ui.com/getting-started/with-framer
const ChakraBox = chakra(motion.div, {
  /**
   * Allow motion props and non-Chakra props to be forwarded.
   */
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

const VideoTile = ({ id, stream, position }: VideoTileProps) => {
  const className = "VideoTile";
  const { x, y } = position || {};

  const Tile = chakra(VideoView);
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
      {/* // <VideoView className={className} key={id} stream={stream} /> */}
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
        <Skeleton height="240px" width="240px" />
      )}
      <span className={`${className}__name`}>Participant {id}</span>
    </ChakraBox>
  );
};

export default VideoTile;
