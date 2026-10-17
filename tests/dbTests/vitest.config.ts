import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    fileParallelism: false, 
    isolate: false,        
    hookTimeout: 60_000,  
    reporters: ["verbose"]  
  },
});