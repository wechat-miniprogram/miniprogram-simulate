module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  roots: ['test'],
  testMatch: ['**/?(*.)+(test).[jt]s?(x)'],
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['src/**/*.[jt]s'],
}
