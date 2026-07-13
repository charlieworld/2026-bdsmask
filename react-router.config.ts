import type { Config } from "@react-router/dev/config";

export default {
  ssr: false,
  prerender: ["/", "/agenda", "/staff", "/tickets", "/origin", "/chat"],
} satisfies Config;
