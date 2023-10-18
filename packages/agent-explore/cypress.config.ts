import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "21c5nu",
  video: true,
  viewportWidth: 800,
  viewportHeight: 550,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
