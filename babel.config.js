module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: { node: "current" },
        // modules: false,
      },
    ],
    "@babel/preset-react",
  ],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./"],
        alias: {
          tests: "./tests",
          src: "./src",
        },
      },
    ],
  ],
  ignore: ["node_modules/**"],
};
