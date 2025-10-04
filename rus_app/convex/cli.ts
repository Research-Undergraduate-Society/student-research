"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { spawn, ChildProcess } from "child_process";
import { promises as fs } from "fs";
import { join, resolve } from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { parse } from "url";

interface FrameworkConfig {
  name: string;
  detectFiles: string[];
  devCommand: string;
  defaultPort: number;
}

const FRAMEWORKS: FrameworkConfig[] = [
  {
    name: "Vite",
    detectFiles: ["vite.config.js", "vite.config.ts"],
    devCommand: "npm run dev",
    defaultPort: 5173,
  },
  {
    name: "Next.js",
    detectFiles: ["next.config.js", "next.config.ts"],
    devCommand: "npm run dev",
    defaultPort: 3000,
  },
  {
    name: "Create React App",
    detectFiles: ["src/index.js", "src/index.tsx"],
    devCommand: "npm start",
    defaultPort: 3000,
  },
  {
    name: "Vue CLI",
    detectFiles: ["vue.config.js"],
    devCommand: "npm run serve",
    defaultPort: 8080,
  },
];

export const detectFramework = action({
  args: { projectPath: v.string() },
  handler: async (ctx, args) => {
    try {
      const packageJsonPath = join(args.projectPath, "package.json");
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf-8"));
      
      for (const framework of FRAMEWORKS) {
        for (const file of framework.detectFiles) {
          try {
            await fs.access(join(args.projectPath, file));
            return {
              framework: framework.name,
              devCommand: framework.devCommand,
              defaultPort: framework.defaultPort,
              packageJson,
            };
          } catch {
            // File doesn't exist, continue
          }
        }
      }
      
      return {
        framework: "Unknown",
        devCommand: "npm start",
        defaultPort: 3000,
        packageJson,
      };
    } catch (error) {
      throw new Error(`Failed to detect framework: ${error}`);
    }
  },
});

export const scanFunctions = action({
  args: { projectPath: v.string() },
  handler: async (ctx, args) => {
    const functionsDir = join(args.projectPath, "netlify", "functions");
    const apiFunctionsDir = join(args.projectPath, "api");
    
    const functions: Array<{
      name: string;
      path: string;
      endpoint: string;
    }> = [];
    
    // Check netlify/functions directory
    try {
      const files = await fs.readdir(functionsDir);
      for (const file of files) {
        if (file.endsWith(".js") || file.endsWith(".ts")) {
          const name = file.replace(/\.(js|ts)$/, "");
          functions.push({
            name,
            path: join(functionsDir, file),
            endpoint: `/.netlify/functions/${name}`,
          });
        }
      }
    } catch {
      // Directory doesn't exist
    }
    
    // Check api directory
    try {
      const files = await fs.readdir(apiFunctionsDir);
      for (const file of files) {
        if (file.endsWith(".js") || file.endsWith(".ts")) {
          const name = file.replace(/\.(js|ts)$/, "");
          functions.push({
            name,
            path: join(apiFunctionsDir, file),
            endpoint: `/api/${name}`,
          });
        }
      }
    } catch {
      // Directory doesn't exist
    }
    
    return functions;
  },
});

export const loadEnvVars = action({
  args: { projectPath: v.string() },
  handler: async (ctx, args) => {
    try {
      const envPath = join(args.projectPath, ".env");
      const envContent = await fs.readFile(envPath, "utf-8");
      
      const envVars: Record<string, string> = {};
      const lines = envContent.split("\n");
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const [key, ...valueParts] = trimmed.split("=");
          if (key && valueParts.length > 0) {
            envVars[key.trim()] = valueParts.join("=").trim();
          }
        }
      }
      
      return envVars;
    } catch {
      return {};
    }
  },
});

export const parseNetlifyConfig = action({
  args: { projectPath: v.string() },
  handler: async (ctx, args) => {
    try {
      const configPath = join(args.projectPath, "netlify.toml");
      const configContent = await fs.readFile(configPath, "utf-8");
      
      // Simple TOML parser for basic redirect rules
      const redirects: Array<{
        from: string;
        to: string;
        status?: number;
      }> = [];
      
      const lines = configContent.split("\n");
      let inRedirectsSection = false;
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        if (trimmed === "[[redirects]]") {
          inRedirectsSection = true;
          continue;
        }
        
        if (inRedirectsSection && trimmed.startsWith("[")) {
          inRedirectsSection = false;
          continue;
        }
        
        if (inRedirectsSection && trimmed.includes("=")) {
          const [key, value] = trimmed.split("=").map(s => s.trim());
          const cleanValue = value.replace(/"/g, "");
          
          if (key === "from") {
            redirects.push({ from: cleanValue, to: "", status: 200 });
          } else if (key === "to" && redirects.length > 0) {
            redirects[redirects.length - 1].to = cleanValue;
          } else if (key === "status" && redirects.length > 0) {
            redirects[redirects.length - 1].status = parseInt(cleanValue);
          }
        }
      }
      
      return { redirects };
    } catch {
      return { redirects: [] };
    }
  },
});

export const startDevServer = action({
  args: {
    projectPath: v.string(),
    devCommand: v.string(),
    port: v.number(),
  },
  handler: async (ctx, args) => {
    try {
      // This would normally start the actual dev server
      // For demo purposes, we'll simulate it
      console.log(`Starting dev server: ${args.devCommand} on port ${args.port}`);
      console.log(`Project path: ${args.projectPath}`);
      
      return {
        success: true,
        pid: Math.floor(Math.random() * 10000),
        url: `http://localhost:${args.port}`,
      };
    } catch (error) {
      throw new Error(`Failed to start dev server: ${error}`);
    }
  },
});
