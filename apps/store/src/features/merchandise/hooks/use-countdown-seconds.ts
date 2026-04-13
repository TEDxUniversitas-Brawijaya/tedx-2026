import { useState } from "react";

export const useCountdownSeconds = (durationInSeconds: number) => {
  const [deadlineInMilliseconds] = useState(
    () => Date.now() + durationInSeconds * 1000
  );

  const currentTimestamp = Date.now();

  return Math.max(
    0,
    Math.ceil((deadlineInMilliseconds - currentTimestamp) / 1000)
  );
};
