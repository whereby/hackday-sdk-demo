import { useState } from "react";

import { Input, Button, Box, Flex, Heading, Text } from "@chakra-ui/react";

import AnimatedTitle from "../../components/AnimatedTitle";
import VideoTile from "../../components/VideoTile";
import { chakraMotionElement } from "../../utils/useChakraMotion";

const PreCallView = ({ localMedia, handleOnReady }) => {
  const {
    currentCameraDeviceId,
    cameraDevices,
    localStream,
    currentMicrophoneDeviceId,
    microphoneDevices,
  } = localMedia.state;
  const { setCameraDevice, toggleCameraEnabled, setMicrophoneDevice } =
    localMedia.actions;

  const [name, setName] = useState("");
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

  const handleClick = () => {
    handleOnReady(name);
  };

  return (
    <Box>
      <Heading mt="10" mb="4">
        Join the game!
      </Heading>
      <Box w="50%" my={4} margin="0 auto">
        <VideoTile muted stream={localStream} />
        <Flex justifyContent="center" gap="2" mt="4">
          <Input
            w="50%"
            placeholder="Your name..."
            value={name}
            onChange={handleTextChange}
          ></Input>
          <Button onClick={handleClick}>Ready!</Button>
        </Flex>
        <Box my="4">
          <Heading as="h3" size="md" letterSpacing="0px">
            Camera device -
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
              {d.label}{" "}
              {currentCameraDeviceId === d.deviceId ? "(selected)" : ""}
            </p>
          ))}
        </Box>
        <Box my="4">
          <Heading as="h3" size="md" letterSpacing="0px">
            Microphone device -
          </Heading>
          {microphoneDevices.map((d) => (
            <p
              key={d.deviceId}
              onClick={() => {
                if (d.deviceId !== currentMicrophoneDeviceId) {
                  setMicrophoneDevice(d.deviceId);
                }
              }}
            >
              {d.label}{" "}
              {currentMicrophoneDeviceId === d.deviceId ? "(selected)" : ""}
            </p>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PreCallView;
