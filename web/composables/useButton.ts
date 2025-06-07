export const useHoldRepeat = (callback: () => void, delay = 200) => {
  let interval: ReturnType<typeof setInterval> | null = null;

  const start = () => {
    callback();
    interval = setInterval(callback, delay);
  };

  const stop = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  return { start, stop };
};
