import React from "react";

import { VideoView } from "@whereby.com/browser-sdk";

const PreCallSetup = ({ localMedia }) => {
  const { currentCameraDeviceId, cameraDevices, localStream } =
    localMedia.state;
  const { setCameraDevice, toggleCameraEnabled } = localMedia.actions;

  console.log(toggleCameraEnabled);

  return (
    <div className="preCallView">
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
      <VideoView muted stream={localStream} />
    </div>
  );
};

const SelfView = ({ localMedia }) => {
  const { localStream } = localMedia.state;

  return <VideoView muted stream={localStream} />;
};

export { PreCallSetup, SelfView };
