#!/usr/bin/env node

import { spawn, ChildProcess } from 'child_process';
import { promises as fs } from 'fs';
import { join, resolve } from 'path';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { watch } from 'chokidar';

interface FrameworkConfig {
  name: string;
  detectFiles: string[];
  devCommand: string[];
  defaultPort: number;
}

interface NetlifyFunction {
  name: string;
  path: string;
  endpoint: string;
  handler?: Function;
}

interface RedirectRule {
  from: string;
  to: string;
  status: number;
}

class NetlifyLocalCLI {
  private projectPath: string;
  private framework: FrameworkConfig | null = null;
  private devServer: ChildProcess | null = null;
  private functions: Map<string, NetlifyFunction> = new Map();
  private envVars: Record<string, string> = {};
  private redirects: RedirectRule[] = [];
  private proxyServer: any = null;
  private functionWatcher: any = null;

  private readonly FRAMEWORKS: FrameworkConfig[] = [
    {
      name: "Vite",
      detectFiles: ["vite.config.js", "vite.config.ts"],
      devCommand: ["npm", "run", "dev"],
      defaultPort: 5173,
    },
    {
      name: "Next.js",
      detectFiles: ["next.config.js", "next.config.ts"],
      devCommand: ["npm", "run", "dev"],
      defaultPort: 3000,
    },
    {
      name: "Create React App",
      detectFiles: ["src/index.js", "src/index.tsx"],
      devCommand: ["npm", "start"],
      defaultPort: 3000,
    },
    {
      name: "Vue CLI",
      detectFiles: ["vue.config.js"],
      devCommand: ["npm", "run", "serve"],
      defaultPort: 8080,
    },
  ];

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = resolve(projectPath);
  }

  async start() {
    console.log('🚀 Starting Netlify Local Development Environment...\n');

    try {
      // 1. Detect framework
      await this.detectFramework();
      
      // 2. Load environment variables
      await this.loadEnvVars();
      
      // 3. Parse Netlify config
      await this.parseNetlifyConfig();
      
      // 4. Scan for serverless functions
      await this.scanFunctions();
      
      // 5. Start dev server
      await this.startDevServer();
      
      // 6. Start proxy server
      await this.startProxyServer();
      
      // 7. Watch for function changes
      this.watchFunctions();
      
      console.log('\n✅ Local development environment is ready!');
      console.log(`🌐 Frontend: http://localhost:8888`);
      console.log(`⚡ Functions: http://localhost:8888/.netlify/functions/`);
      
      if (this.functions.size > 0) {
        console.log('\n📋 Available functions:');
        this.functions.forEach((func) => {
          console.log(`   • ${func.endpoint}`);
        });
      }
      
      console.log('\n🔄 Watching for changes...');
      
    } catch (error) {
      console.error('❌ Failed to start:', error);
      process.exit(1);
    }
  }

  private async detectFramework() {
    console.log('🔍 Detecting framework...');
    
    for (const framework of this.FRAMEWORKS) {
      for (const file of framework.detectFiles) {
        try {
          await fs.access(join(this.projectPath, file));
          this.framework = framework;
          console.log(`   ✓ Detected: ${framework.name}`);
          return;
        } catch {
          // File doesn't exist, continue
        }
      }
    }
    
    // Fallback to generic setup
    this.framework = {
      name: "Generic",
      detectFiles: [],
      devCommand: ["npm", "start"],
      defaultPort: 3000,
    };
    console.log('   ⚠️  Unknown framework, using generic setup');
  }

  private async loadEnvVars() {
    console.log('🔧 Loading environment variables...');
    
    try {
      const envPath = join(this.projectPath, '.env');
      const envContent = await fs.readFile(envPath, 'utf-8');
      
      const lines = envContent.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const [key, ...valueParts] = trimmed.split('=');
          if (key && valueParts.length > 0) {
            this.envVars[key.trim()] = valueParts.join('=').trim();
          }
        }
      }
      
      console.log(`   ✓ Loaded ${Object.keys(this.envVars).length} variables`);
    } catch {
      console.log('   ℹ️  No .env file found');
    }
  }

  private async parseNetlifyConfig() {
    console.log('📝 Parsing Netlify config...');
    
    try {
      const configPath = join(this.projectPath, 'netlify.toml');
      const configContent = await fs.readFile(configPath, 'utf-8');
      
      // Simple TOML parser for redirects
      const lines = configContent.split('\n');
      let currentRedirect: Partial<RedirectRule> = {};
      let inRedirectsSection = false;
      
      for (const line of lines) {
        const trimmed = line.trim();
        
        if (trimmed === '[[redirects]]') {
          if (currentRedirect.from && currentRedirect.to) {
            this.redirects.push(currentRedirect as RedirectRule);
          }
          currentRedirect = { status: 200 };
          inRedirectsSection = true;
          continue;
        }
        
        if (inRedirectsSection && trimmed.startsWith('[')) {
          inRedirectsSection = false;
          continue;
        }
        
        if (inRedirectsSection && trimmed.includes('=')) {
          const [key, value] = trimmed.split('=').map(s => s.trim());
          const cleanValue = value.replace(/"/g, '');
          
          if (key === 'from') currentRedirect.from = cleanValue;
          else if (key === 'to') currentRedirect.to = cleanValue;
          else if (key === 'status') currentRedirect.status = parseInt(cleanValue);
        }
      }
      
      if (currentRedirect.from && currentRedirect.to) {
        this.redirects.push(currentRedirect as RedirectRule);
      }
      
      console.log(`   ✓ Loaded ${this.redirects.length} redirect rules`);
    } catch {
      console.log('   ℹ️  No netlify.toml found');
    }
  }

  private async scanFunctions() {
    console.log('🔍 Scanning for serverless functions...');
    
    const functionDirs = [
      join(this.projectPath, 'netlify', 'functions'),
      join(this.projectPath, 'api'),
    ];
    
    for (const dir of functionDirs) {
      try {
        const files = await fs.readdir(dir);
        
        for (const file of files) {
          if (file.endsWith('.js') || file.endsWith('.ts')) {
            const name = file.replace(/\.(js|ts)$/, '');
            const path = join(dir, file);
            const endpoint = dir.includes('netlify') 
              ? `/.netlify/functions/${name}`
              : `/api/${name}`;
            
            this.functions.set(name, { name, path, endpoint });
          }
        }
      } catch {
        // Directory doesn't exist
      }
    }
    
    console.log(`   ✓ Found ${this.functions.size} functions`);
  }

  private async startDevServer() {
    if (!this.framework) return;
    
    console.log(`🚀 Starting ${this.framework.name} dev server...`);
    
    // Set environment variables for the dev server
    const env = { ...process.env, ...this.envVars };
    
    this.devServer = spawn(this.framework.devCommand[0], this.framework.devCommand.slice(1), {
      cwd: this.projectPath,
      env,
      stdio: 'pipe',
    });
    
    this.devServer.stdout?.on('data', (data) => {
      const output = data.toString();
      if (output.includes('Local:') || output.includes('ready')) {
        console.log(`   ✓ Dev server started`);
      }
    });
    
    this.devServer.stderr?.on('data', (data) => {
      console.error(`Dev server error: ${data}`);
    });
    
    // Wait a moment for the server to start
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  private async startProxyServer() {
    console.log('🌐 Starting proxy server...');
    
    this.proxyServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      const url = parse(req.url || '', true);
      const pathname = url.pathname || '';
      
      // Handle function requests
      if (pathname.startsWith('/.netlify/functions/') || pathname.startsWith('/api/')) {
        await this.handleFunctionRequest(req, res, pathname);
        return;
      }
      
      // Handle redirects
      for (const redirect of this.redirects) {
        if (this.matchPath(pathname, redirect.from)) {
          if (redirect.status >= 300 && redirect.status < 400) {
            res.writeHead(redirect.status, { Location: redirect.to });
            res.end();
            return;
          }
        }
      }
      
      // Proxy to dev server
      await this.proxyToDevServer(req, res);
    });
    
    this.proxyServer.listen(8888, () => {
      console.log('   ✓ Proxy server started on port 8888');
    });
  }

  private async handleFunctionRequest(req: IncomingMessage, res: ServerResponse, pathname: string) {
    const functionName = pathname.startsWith('/.netlify/functions/')
      ? pathname.replace('/.netlify/functions/', '')
      : pathname.replace('/api/', '');
    
    const func = this.functions.get(functionName);
    if (!func) {
      res.writeHead(404);
      res.end('Function not found');
      return;
    }
    
    try {
      // Load and execute the function
      delete require.cache[func.path];
      const module = require(func.path);
      const handler = module.handler || module.default || module;
      
      if (typeof handler !== 'function') {
        throw new Error('Function does not export a handler');
      }
      
      // Collect request body
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        try {
          const event = {
            httpMethod: req.method,
            path: pathname,
            headers: req.headers,
            body,
            queryStringParameters: parse(req.url || '', true).query,
          };
          
          const context = {
            functionName,
            functionVersion: '1.0',
            invokedFunctionArn: `arn:aws:lambda:us-east-1:123456789012:function:${functionName}`,
          };
          
          const result = await handler(event, context);
          
          res.writeHead(result.statusCode || 200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Methods': '*',
            ...result.headers,
          });
          
          res.end(result.body || '');
        } catch (error) {
          console.error(`Function error (${functionName}):`, error);
          res.writeHead(500);
          res.end(JSON.stringify({ error: 'Internal server error' }));
        }
      });
    } catch (error) {
      console.error(`Failed to load function (${functionName}):`, error);
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Failed to load function' }));
    }
  }

  private async proxyToDevServer(req: IncomingMessage, res: ServerResponse) {
    const devPort = this.framework?.defaultPort || 3000;
    
    try {
      const { default: fetch } = await import('node-fetch');
      const url = `http://localhost:${devPort}${req.url}`;
      
      const response = await fetch(url, {
        method: req.method,
        headers: req.headers as any,
        body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined,
      });
      
      res.writeHead(response.status, response.headers.raw());
      response.body?.pipe(res);
    } catch (error) {
      res.writeHead(502);
      res.end('Bad Gateway - Dev server not available');
    }
  }

  private watchFunctions() {
    const functionDirs = [
      join(this.projectPath, 'netlify', 'functions'),
      join(this.projectPath, 'api'),
    ];
    
    this.functionWatcher = watch(functionDirs, { ignored: /node_modules/ });
    
    this.functionWatcher.on('change', (path: string) => {
      console.log(`🔄 Function changed: ${path}`);
      // Clear require cache for hot reloading
      delete require.cache[resolve(path)];
    });
    
    this.functionWatcher.on('add', () => {
      this.scanFunctions();
    });
    
    this.functionWatcher.on('unlink', () => {
      this.scanFunctions();
    });
  }

  private matchPath(pathname: string, pattern: string): boolean {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(pathname);
    }
    return pathname === pattern;
  }

  async stop() {
    console.log('\n🛑 Stopping development environment...');
    
    if (this.devServer) {
      this.devServer.kill();
    }
    
    if (this.proxyServer) {
      this.proxyServer.close();
    }
    
    if (this.functionWatcher) {
      await this.functionWatcher.close();
    }
    
    console.log('✅ Stopped successfully');
  }
}

// CLI Entry Point
if (require.main === module) {
  const cli = new NetlifyLocalCLI();
  
  process.on('SIGINT', async () => {
    await cli.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    await cli.stop();
    process.exit(0);
  });
  
  cli.start().catch((error) => {
    console.error('Failed to start CLI:', error);
    process.exit(1);
  });
}

export default NetlifyLocalCLI;
