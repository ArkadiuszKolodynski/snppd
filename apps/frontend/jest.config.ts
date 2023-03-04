/* eslint-disable */
export default {
  displayName: 'frontend',
  preset: '../../jest.preset.js',
  globals: {},
  transform: {
    '^(.+\\.svelte$)': [
      'svelte-jester',
      {
        preprocess: 'apps/frontend/svelte.config.js',
      },
    ],
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['svelte', 'ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/frontend',
};
