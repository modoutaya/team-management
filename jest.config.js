module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.[jt]sx?$': 'ts-jest',
    },
    collectCoverageFrom: [
        'tests/**/*.{js,ts}',
    ],
};