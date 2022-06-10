/* eslint-disable */
export default {
  displayName: 'snppd-service',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!uuid)'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/snppd-service',
};
