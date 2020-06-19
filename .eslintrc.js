module.exports = {
    parser: "babel-eslint",
    env: {
        jest: true,
        es6: true,
        node: true,
        browser: true,
    },
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: [
        "react",
        // "react-hooks"
    ],
    extends: ["eslint:recommended", "plugin:react/recommended", "plugin:prettier/recommended"],
    rules: {
        "no-console": "off",
        "react/prop-types": 0,
        // "react-hooks/rules-of-hooks": "error",
        // "react-hooks/exhaustive-deps": "warn",
        "max-len": [2, 120, 4, { ignoreUrls: true }],
    },
    globals: {
        page: true,
        browser: true,
        context: true,
        jestPuppeteer: true,
    },
};