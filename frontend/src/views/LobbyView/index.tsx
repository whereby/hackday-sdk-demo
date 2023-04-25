import { useState } from "react";

import {
  useLocalMedia,
  VideoView,
  useRoomConnection,
} from "@whereby.com/browser-sdk";

import { Box, Button, Flex } from "@chakra-ui/react";

import VideoTile from "../../components/VideoTile";
import { WHEREBY_ROOM } from "../../config/constants";

const LobbyView = ({ localMedia }: any) => {
  const [tilePositions, setTilePositions] = useState({});

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

      <Box>
        {remoteParticipants.map((p) => {
          const { id, stream, displayName } = p;
          return <VideoTile key={id} stream={stream} name={displayName} />;
        })}
      </Box>

      <Box>
        <Button
          m={2}
          onClick={() => {
            setTilePositions({ y: 400 });
          }}
        >
          Shift!
        </Button>
        <Flex>
          <VideoTile stream={localStream} />
          <VideoTile stream={localStream} position={tilePositions} />
          <VideoTile stream={localStream} />
          <VideoTile stream={localStream} position={tilePositions} />
        </Flex>
      </Box>
    </Box>
  );
};

export default LobbyView;
