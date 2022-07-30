import adapter from "@sveltejs/adapter-netlify";
import preprocess from "svelte-preprocess";

const dev = "production" === "development";

const config = {
  preprocess: preprocess(),
  kit: {
    adapter: adapter(),
    methodOverride: {
      allowed: ["PATCH", "DELETE"],
    },
  },
};

export default config;