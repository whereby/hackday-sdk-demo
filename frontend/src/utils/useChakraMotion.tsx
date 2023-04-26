import { chakra, shouldForwardProp } from "@chakra-ui/react";
import { isValidMotionProp } from "framer-motion";

//https://chakra-ui.com/getting-started/with-framer
/**
 * Allow motion props and non-Chakra props to be forwarded.
 */
const chakraMotionElement = (motionElementType) => {
  return chakra(motionElementType, {
    shouldForwardProp: (prop) => {
      return isValidMotionProp(prop) || shouldForwardProp(prop);
    },
  });
};

export { chakraMotionElement };
