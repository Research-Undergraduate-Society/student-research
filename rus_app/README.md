# Netlify Local Development CLI

A command-line interface tool that replicates the core development experience of the Netlify platform on a local machine. Provides a zero-config, single-command workflow for running full-stack applications locally.

## Features

### 🚀 Single Command Execution
Start your entire local environment with one command:
```bash
npx local-dev
```

### 🔍 Automatic Framework Detection
Automatically detects and supports:
- **Vite** (React, Vue, Svelte)
- **Next.js**
- **Create React App**
- **Vue CLI**
- **Generic npm projects**

### ⚡ Serverless Function Emulation
- Auto-discovers functions in `netlify/functions/` or `api/` directories
- Serves functions at `/.netlify/functions/functionName` or `/api/functionName`
- Supports live reloading on function changes
- Compatible with Netlify's function signature

### 🌍 Environment Variable Loading
- Automatically loads `.env` files
- Makes variables available to both frontend and functions
- Secure environment isolation

### 🔄 Redirect & Proxy Rules
- Parses `netlify.toml` configuration
- Handles redirects and proxy rules
- Avoids CORS issues with seamless API proxying

### 🔥 Hot Module Replacement
- Preserves your framework's HMR capabilities
- Live reloading for serverless functions
- File watching for automatic updates

## Quick Start

### 1. Install the CLI
```bash
npm install -g netlify-local-cli
```

### 2. Create a Project Structure
```
my-app/
├── src/
│   └── index.js          # Your frontend app
├── netlify/
│   └── functions/
│       └── hello.js      # Serverless function
├── .env                  # Environment variables
├── netlify.toml          # Netlify configuration
└── package.json
```

### 3. Example Serverless Function
Create `netlify/functions/hello.js`:
```javascript
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'Hello from Netlify function!',
      method: event.httpMethod,
      path: event.path,
    }),
  };
};
```

### 4. Example Environment Variables
Create `.env`:
```
API_KEY=your-secret-key
DATABASE_URL=postgresql://localhost:5432/mydb
```

### 5. Example Netlify Configuration
Create `netlify.toml`:
```toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/old-page"
  to = "/new-page"
  status = 301
```

### 6. Start Development
```bash
cd my-app
local-dev
```

Your app will be available at `http://localhost:8888` with:
- Frontend served with HMR
- Functions at `/.netlify/functions/hello`
- Environment variables loaded
- Redirects and proxies working

## How It Works

### Framework Detection
The CLI scans your project for framework-specific files:
- `vite.config.js/ts` → Vite
- `next.config.js/ts` → Next.js
- `src/index.js/tsx` → Create React App
- `vue.config.js` → Vue CLI

### Function Discovery
Automatically finds functions in:
- `netlify/functions/*.js`
- `netlify/functions/*.ts`
- `api/*.js`
- `api/*.ts`

### Proxy Server
Runs a unified proxy server on port 8888 that:
1. Routes function requests to the function handler
2. Applies redirect rules from `netlify.toml`
3. Proxies all other requests to your dev server
4. Handles CORS headers automatically

### Live Reloading
- Watches function files for changes
- Clears Node.js require cache for hot reloading
- Preserves your frontend framework's HMR

## Advanced Usage

### Custom Port
```bash
local-dev --port 9000
```

### Specific Project Path
```bash
local-dev --path /path/to/project
```

### Debug Mode
```bash
local-dev --debug
```

### Function-Only Mode
```bash
local-dev --functions-only
```

## Supported Function Formats

### Netlify Functions
```javascript
// netlify/functions/api.js
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello World' }),
  };
};
```

### ES Modules
```javascript
// netlify/functions/modern.js
export const handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Modern syntax' }),
  };
};
```

### TypeScript
```typescript
// netlify/functions/typed.ts
import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'TypeScript support' }),
  };
};
```

## Configuration

### netlify.toml Support
```toml
[build]
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/admin/*"
  to = "/admin/index.html"
  status = 200

[[headers]]
  for = "/api/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
```

### Environment Variables
The CLI loads environment variables in this order:
1. System environment variables
2. `.env` file in project root
3. `.env.local` file (if present)

## Troubleshooting

### Port Already in Use
If port 8888 is busy, the CLI will automatically find the next available port.

### Function Not Loading
- Check that your function exports a `handler`
- Ensure the file is in `netlify/functions/` or `api/`
- Check the console for syntax errors

### Dev Server Not Starting
- Verify your `package.json` has the correct dev script
- Check that dependencies are installed (`npm install`)
- Try running the dev command manually first

### CORS Issues
The CLI automatically adds CORS headers to function responses. If you're still seeing CORS errors:
- Check your function is returning proper headers
- Verify the request is going through the proxy (port 8888)

## Web Interface

This project also includes a web-based dashboard for managing local projects:

1. Start the web interface: `npm run dev`
2. Open `http://localhost:5173`
3. Sign in to manage your local development projects
4. Monitor logs, functions, and project status

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Roadmap

- [ ] TypeScript function support
- [ ] Edge function emulation
- [ ] Build plugin system
- [ ] Docker integration
- [ ] Multi-site support
- [ ] Performance monitoring
- [ ] Deployment preview
