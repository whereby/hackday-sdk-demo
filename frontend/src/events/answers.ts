type Answer = {
  type: "ANSWER";
  payload: {
    alternative: string;
  };
};

const exampleAnswer = { type: "ANSWER", payload: { alternative: "A" } };

export { exampleAnswer };
export type { Answer };
