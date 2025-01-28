# Development Server Hosting Guide

This guide explains how to make your development server accessible from any network using localtunnel.

## Prerequisites

- Node.js and npm installed
- The project's development server (Vite)

## Setup Steps

1. **Install localtunnel globally**
   ```bash
   sudo npm install -g localtunnel
   ```

2. **Configure Vite for External Access**
   
   Update your `frontend/vite.config.ts` with the following server configuration:
   ```typescript
   server: {
     host: '0.0.0.0',  // Allow external access
     port: 3000,
     allowedHosts: ['your-tunnel-subdomain.loca.lt'],  // Replace with your actual tunnel URL
     proxy: {
       '/api': {
         target: 'http://localhost:4000',
         changeOrigin: true,
         secure: false,
       },
     },
   }
   ```

## Starting the Server

1. **Start the Vite development server**
   ```bash
   cd frontend
   npm run dev
   ```
   This will start your development server on port 3000.

2. **Create a tunnel in a new terminal**
   ```bash
   lt --port 3000
   ```
   This will output a URL like: `https://your-subdomain.loca.lt`

3. **Update Vite Configuration**
   - When you get your tunnel URL, update the `allowedHosts` in `vite.config.ts` with your specific subdomain
   - The server will automatically restart with the new configuration

## Accessing the Server

Your server will be accessible through two URLs:
1. Local: `http://localhost:3000`
2. Public: `https://your-subdomain.loca.lt`

### First-Time Access

When someone tries to access your tunnel URL for the first time:
1. They will see a security page from localtunnel
2. They need to enter the tunnel password
3. The tunnel password is your public IP address
   - You can find your public IP by visiting: https://loca.lt/mytunnelpassword
   - Or by using any IP lookup service

## Important Notes

1. **Keep Both Processes Running**
   - The Vite development server (`npm run dev`)
   - The localtunnel process (`lt --port 3000`)
   Both must remain active for the tunnel to work.

2. **Security Considerations**
   - The tunnel URL and password provide access to your development server
   - Only share these credentials with trusted users
   - The tunnel is meant for development/testing, not production use

3. **Tunnel URL Changes**
   - The tunnel URL changes each time you restart the localtunnel process
   - You'll need to update the `allowedHosts` in `vite.config.ts` with the new URL
   - The Vite server will automatically restart when you save the config

4. **Troubleshooting**
   - If the connection fails, try restarting both the Vite server and localtunnel
   - Ensure your firewall allows connections on port 3000
   - Verify the `allowedHosts` in vite.config.ts matches your current tunnel URL

## Example Commands

Complete sequence of commands to start everything:

```bash
# Terminal 1: Start Vite server
cd frontend
npm run dev

# Terminal 2: Start tunnel
lt --port 3000

# After getting the tunnel URL, update vite.config.ts allowedHosts
# The server will automatically restart
```

Remember to keep both terminal windows open while you need the tunnel active.
