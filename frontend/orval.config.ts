import { defineConfig } from "orval";

export default defineConfig({
  flowboard: {
    input: "../openapi.json",
    output: {
      target: "src/api/generated.ts",
      client: "react-query",
      mode: "tags-split",
      override: {
        mutator: {
          path: "src/shared/api/client.ts",
          name: "apiClient",
        },
      },
    },
  },
});
