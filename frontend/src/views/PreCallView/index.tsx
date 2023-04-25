import { useState } from "react";

import { Input, Button, Box, Flex, Heading, Text } from "@chakra-ui/react";

import VideoTile from "../../components/VideoTile";
// import { VideoView } from "@whereby.com/browser-sdk";

const PreCallView = ({ localMedia, handleOnReady }) => {
  const { currentCameraDeviceId, cameraDevices, localStream } =
    localMedia.state;
  const { setCameraDevice, toggleCameraEnabled } = localMedia.actions;

  const [name, setName] = useState("");
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

  return (
    <Box>
      <Heading as="h1" mb="3">
        Game Lobby
      </Heading>
      <Text>Waiting for players...</Text>

      <Box my="4">
        <Heading as="h3" size="md">
          Device setup
        </Heading>
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
      </Box>

      <Box w="50%" my={4} margin="0 auto">
        <VideoTile stream={localStream} />
        <Flex justifyContent="center" gap="2" mt="4">
          <Input
            w="50%"
            placeholder="Your name..."
            value={name}
            onChange={handleTextChange}
          ></Input>
          <Button onClick={handleOnReady}>Ready!</Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default PreCallView;