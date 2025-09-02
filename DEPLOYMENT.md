# Deployment Guide

## Local Development

### Prerequisites
- Node.js 18.10 or later
- npm or yarn
- n8n installed locally or via Docker

### Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/jezweb/n8n-nodes-data-converter.git
cd n8n-nodes-data-converter
```

2. **Install dependencies**
```bash
npm install
```

3. **Build the node**
```bash
npm run build
```

4. **Link for local testing**
```bash
npm link
cd ~/.n8n/custom
npm link n8n-nodes-data-converter
```

5. **Restart n8n**
```bash
n8n start
```

### Development Workflow

1. **Make changes** to source files
2. **Build** with `npm run build`
3. **Restart n8n** to load changes
4. **Test** in n8n workflow editor

## Production Deployment

### Via n8n Community Nodes

**Recommended for most users**

1. Open n8n interface
2. Navigate to Settings → Community Nodes
3. Search for "data-converter"
4. Click Install
5. Restart n8n

### Manual Installation

#### Docker Deployment

1. **Extend n8n Docker image**

Create `Dockerfile`:
```dockerfile
FROM n8nio/n8n:latest
RUN npm install -g n8n-nodes-data-converter
```

2. **Build and run**
```bash
docker build -t n8n-custom .
docker run -it --rm \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8n-custom
```

#### Docker Compose

```yaml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n:latest
    ports:
      - "5678:5678"
    volumes:
      - n8n_data:/home/node/.n8n
      - ./custom-nodes:/home/node/.n8n/custom
    environment:
      - N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/custom
    command: >
      sh -c "
        npm install -g n8n-nodes-data-converter &&
        n8n start
      "

volumes:
  n8n_data:
```

#### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: n8n
spec:
  replicas: 1
  selector:
    matchLabels:
      app: n8n
  template:
    metadata:
      labels:
        app: n8n
    spec:
      initContainers:
      - name: install-custom-nodes
        image: n8nio/n8n:latest
        command: ['sh', '-c', 'npm install -g n8n-nodes-data-converter']
        volumeMounts:
        - name: n8n-custom
          mountPath: /home/node/.n8n/custom
      containers:
      - name: n8n
        image: n8nio/n8n:latest
        ports:
        - containerPort: 5678
        volumeMounts:
        - name: n8n-data
          mountPath: /home/node/.n8n
        - name: n8n-custom
          mountPath: /home/node/.n8n/custom
      volumes:
      - name: n8n-data
        persistentVolumeClaim:
          claimName: n8n-data-pvc
      - name: n8n-custom
        emptyDir: {}
```

### PM2 Deployment

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'n8n',
    script: 'n8n',
    args: 'start',
    env: {
      N8N_CUSTOM_EXTENSIONS: '/home/node/.n8n/custom',
      N8N_PORT: 5678
    },
    error_file: './logs/n8n-error.log',
    out_file: './logs/n8n-out.log',
    time: true
  }]
};
```

## Configuration

### Environment Variables

```bash
# Custom node location
N8N_CUSTOM_EXTENSIONS=/path/to/custom/nodes

# Node-specific settings (if any)
DATA_CONVERTER_MAX_SIZE=10485760  # 10MB max file size
DATA_CONVERTER_TIMEOUT=30000      # 30 second timeout
```

### Performance Tuning

#### Memory Settings
```bash
# Increase Node.js memory for large conversions
NODE_OPTIONS="--max-old-space-size=4096"
```

#### Concurrency
```bash
# Limit concurrent conversions
DATA_CONVERTER_MAX_CONCURRENT=5
```

## Monitoring

### Health Checks

Monitor node availability:
```javascript
// health-check.js
const axios = require('axios');

axios.get('http://localhost:5678/healthz')
  .then(() => console.log('n8n is healthy'))
  .catch(() => process.exit(1));
```

### Logging

Enable debug logging:
```bash
DEBUG=n8n* n8n start
```

### Metrics

Track usage with n8n's execution data:
- Execution time per operation
- Success/failure rates
- Most used conversions

## Troubleshooting

### Common Issues

#### Node Not Appearing
1. Check installation: `npm list -g n8n-nodes-data-converter`
2. Verify custom node path
3. Check n8n logs for errors
4. Restart n8n

#### Build Errors
```bash
# Clear and rebuild
rm -rf dist node_modules
npm install
npm run build
```

#### Permission Issues
```bash
# Fix permissions
chmod -R 755 ~/.n8n/custom
chown -R $(whoami) ~/.n8n/custom
```

### Debug Mode

Enable verbose logging:
```bash
export N8N_LOG_LEVEL=debug
export NODE_ENV=development
n8n start
```

## Updating

### Via Community Nodes
1. Go to Settings → Community Nodes
2. Find Data Converter
3. Click Update
4. Restart n8n

### Manual Update
```bash
npm update -g n8n-nodes-data-converter
# or
npm install -g n8n-nodes-data-converter@latest
```

### Version Pinning
```json
{
  "dependencies": {
    "n8n-nodes-data-converter": "0.1.0"
  }
}
```

## Security

### Best Practices
1. Keep node updated
2. Validate all inputs
3. Set resource limits
4. Use read-only file systems where possible
5. Run n8n as non-root user

### Input Validation
The node validates:
- Input size limits
- Format correctness
- Character encoding
- Malformed data

### Network Security
If exposing n8n:
```nginx
# nginx.conf
server {
    listen 443 ssl;
    server_name n8n.example.com;
    
    ssl_certificate /etc/ssl/cert.pem;
    ssl_certificate_key /etc/ssl/key.pem;
    
    location / {
        proxy_pass http://localhost:5678;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Backup & Recovery

### Backup Strategy
```bash
# Backup custom nodes
tar -czf custom-nodes-backup.tar.gz ~/.n8n/custom

# Backup workflows
n8n export:workflow --all --output=workflows-backup.json
```

### Recovery
```bash
# Restore custom nodes
tar -xzf custom-nodes-backup.tar.gz -C ~/

# Restore workflows
n8n import:workflow --input=workflows-backup.json
```

## Support

### Getting Help
- GitHub Issues: [Report bugs](https://github.com/jezweb/n8n-nodes-data-converter/issues)
- n8n Community: [Forum discussions](https://community.n8n.io)
- Documentation: Check README.md and ARCHITECTURE.md

### Logs Location
- Docker: `docker logs <container-id>`
- PM2: `pm2 logs n8n`
- Systemd: `journalctl -u n8n`
- Direct: `~/.n8n/logs/`