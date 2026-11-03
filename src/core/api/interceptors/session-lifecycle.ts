/* eslint-disable no-unused-vars */
// Transport coordination only; Redux remains the owner of authentication state.
let generation = 0;
const listeners = new Set<() => void>();
let failureHandler: ((error: unknown) => void) | undefined;

export const getTransportGeneration = () => generation;
export const invalidateSessionRequests = () => {
  generation += 1;
  listeners.forEach((listener) => listener());
};
export const onSessionInvalidated = (listener: () => void) => {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
};
export const setSessionFailureHandler = (handler: (error: unknown) => void) => {
  failureHandler = handler;
};
export const reportSessionFailure = (error: unknown) => failureHandler?.(error);
