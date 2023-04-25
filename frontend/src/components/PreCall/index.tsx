import { useState } from "react";

import { Input, Button, Box, Flex } from "@chakra-ui/react";

import VideoTile from "../VideoTile";
// import { VideoView } from "@whereby.com/browser-sdk";

const PreCallSetup = ({ localMedia }) => {
  const { currentCameraDeviceId, cameraDevices, localStream } =
    localMedia.state;
  const { setCameraDevice, toggleCameraEnabled } = localMedia.actions;

  const className = "PreCall";

  const [tilePositions, setTilePositions] = useState({});
  const [name, setName] = useState("");
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

  return (
    <Box>
      <h1>Pre-call setup</h1>
      {cameraDevices.map((d) => (
        <p
          key={d.deviceId}
          onClick={() => {
            if (d.deviceId !== currentCameraDeviceId) {
              setCameraDevice(d.deviceId);
            }
          }}
        >
          {d.label}
        </p>
      ))}
      <Box w="50%" p={4} margin="0 auto">
        <VideoTile stream={localStream} />
        <Flex justifyContent="center" gap="2">
          <Input
            w="50%"
            placeholder="Your name..."
            value={name}
            onChange={handleTextChange}
          ></Input>
          <Button>Ready!</Button>
        </Flex>
      </Box>
      <Button
        m={2}
        onClick={() => {
          setTilePositions({ y: 100 });
        }}
      >
        Shift!
      </Button>
      <Flex className={`${className}__video-container`}>
        <VideoTile stream={localStream} />
        <VideoTile stream={localStream} position={tilePositions} />
        <VideoTile stream={localStream} />
        <VideoTile stream={localStream} position={tilePositions} />
        {/* <VideoView muted stream={localStream} /> */}
      </Flex>
    </Box>
  );
};

const SelfView = ({ localMedia }) => {
  const { localStream } = localMedia.state;

  // return <VideoView muted stream={localStream} />;
  return <VideoTile stream={localStream} />;
};

export { PreCallSetup, SelfView };
