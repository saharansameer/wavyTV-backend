import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node }, // Enables Node.js globals like `process`, `__dirname`, etc.
    },
  },
  pluginJs.configs.recommended, // Enables ESLint's recommended rules
];
