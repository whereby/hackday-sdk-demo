import React from "react";

import {
  useLocalMedia,
  VideoView,
  useRoomConnection,
} from "@whereby.com/browser-sdk";

import { Box } from "@chakra-ui/react";

import { PreCallSetup, SelfView } from "../../components/PreCall";
import VideoTile from "../../components/VideoTile";
import { WHEREBY_ROOM } from "../../config/constants";

const LobbyView = ({ localMedia }: any) => {
  const { state, actions, components } = useRoomConnection(WHEREBY_ROOM, {
    localMedia,
    logger: console,
    localMediaConstraints: {
      audio: false,
      video: true,
    },
  });

  const { localStream } = localMedia.state;

  const { roomConnectionStatus, remoteParticipants } = state;

  console.log(remoteParticipants);
  return (
    <Box>
      <Box>
        <VideoTile stream={localStream} name={"You"} />
      </Box>

      {remoteParticipants.map((p) => {
        const { id, stream, displayName } = p;
        return (
          <Box key={id}>{<VideoTile stream={stream} name={displayName} />}</Box>
        );
      })}
    </Box>
  );
};

export default LobbyView;
