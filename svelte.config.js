import static_adapter from '@sveltejs/adapter-static';

const dev = "production" === "development";

const config = {
  kit: {
    adapter: static_adapter({
        pages: "docs",
        assets: "docs"
    }),
    paths: {
        base: dev ? "" : "/webapp-sveltekit-template",
    },
    methodOverride: {
      allowed: ["PATCH", "DELETE"],
    },
  },
};

export default config;
