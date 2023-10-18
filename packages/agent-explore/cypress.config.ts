import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "21c5nu",
  video: true,
  e2e: {
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
