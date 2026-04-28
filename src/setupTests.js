// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

jest.mock('gsap', () => {
  const timeline = {
    to: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    eventCallback: jest.fn().mockReturnThis(),
    play: jest.fn().mockReturnThis(),
    reverse: jest.fn().mockReturnThis(),
  };

  return {
    __esModule: true,
    default: {
      registerPlugin: jest.fn(),
      context: jest.fn((callback) => {
        if (typeof callback === 'function') {
          callback();
        }
        return { revert: jest.fn() };
      }),
      set: jest.fn(),
      from: jest.fn(),
      to: jest.fn(),
      fromTo: jest.fn(),
      timeline: jest.fn(() => timeline),
      utils: {
        toArray: jest.fn(() => []),
      },
    },
  };
});

jest.mock('gsap/ScrollTrigger', () => ({
  __esModule: true,
  ScrollTrigger: {
    create: jest.fn(),
  },
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
