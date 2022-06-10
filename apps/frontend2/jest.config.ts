/* eslint-disable */
export default {
  displayName: 'frontend',
  testEnvironment: 'jsdom',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^(.+\\.svelte$)': [
      'svelte-jester',
      {
        preprocess: 'apps/frontend/svelte.config.cjs',
      },
    ],
    '^.+\\.ts$': 'ts-jest',
  },
  moduleFileExtensions: ['svelte', 'ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/frontend',
};
