import { useState } from "react";
import { Input, Button, Box, Flex, Heading } from "@chakra-ui/react";

import { LocalMediaRef } from "../../useQuizGame";
import VideoTile from "../../components/VideoTile";

interface PreCallViewProps {
  handleOnReady: (name: string) => void;
  localMedia: LocalMediaRef;
}

const PreCallView = ({ localMedia, handleOnReady }: PreCallViewProps) => {
  const {
    currentCameraDeviceId,
    cameraDevices,
    localStream,
    currentMicrophoneDeviceId,
    microphoneDevices,
  } = localMedia.state;
  const { setCameraDevice, setMicrophoneDevice } = localMedia.actions;

  const [name, setName] = useState("");
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

  return (
    <Box>
      <Heading mt="10" mb="4">
        Join the game!
      </Heading>
      <Box w="50%" my={4} margin="0 auto">
        <VideoTile muted stream={localStream} />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleOnReady(name);
          }}
        >
          <Flex justifyContent="center" gap="2" mt="4">
            <Input
              autoFocus
              w="50%"
              placeholder="Your name... (required)"
              value={name}
              onChange={handleTextChange}
            ></Input>
            <Button isDisabled={name.length === 0} type={"submit"}>
              Ready!
            </Button>
          </Flex>
        </form>

        <Box my="4">
          <Heading as="h3" mb={"2"} size="md" letterSpacing="0px">
            Camera device
          </Heading>
          {cameraDevices.map((d) => (
            <Button
              mb={"2"}
              backgroundColor={"transparent"}
              border={
                currentCameraDeviceId === d.deviceId
                  ? "1px solid #4880c8"
                  : undefined
              }
              key={d.deviceId}
              fontWeight={
                currentCameraDeviceId === d.deviceId ? "bold" : undefined
              }
              onClick={() => {
                if (d.deviceId !== currentCameraDeviceId) {
                  setCameraDevice(d.deviceId);
                }
              }}
            >
              {d.label}{" "}
            </Button>
          ))}
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          my="4"
        >
          <Heading as="h3" mb={"2"} size="md" letterSpacing="0px">
            Microphone device
          </Heading>
          {microphoneDevices.map((d) => (
            <Button
              mb={"2"}
              backgroundColor={"transparent"}
              border={
                currentMicrophoneDeviceId === d.deviceId
                  ? "1px solid #4880c8"
                  : undefined
              }
              key={d.deviceId}
              fontWeight={
                currentMicrophoneDeviceId === d.deviceId ? "bold" : undefined
              }
              onClick={() => {
                if (d.deviceId !== currentMicrophoneDeviceId) {
                  setMicrophoneDevice(d.deviceId);
                }
              }}
            >
              {d.label}{" "}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PreCallView;
