# Decensat DC3 - Docker & GitHub Workflows Setup

## Docker Configuration

### Building the Image

```bash
docker build -t decensat-dc3:latest .
```

### Running the Container

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_PRIVY_APP_ID=your_app_id \
  decensat-dc3:latest
```

### Using Docker Compose

```bash
docker-compose up --build
```

## GitHub Workflows

### Automated CI/CD Pipeline

The project includes three main GitHub Actions workflows:

#### 1. **CI Pipeline** (`.github/workflows/ci.yml`)
Runs on every push and pull request:
- **Lint**: Code quality checks
- **Type Check**: TypeScript validation
- **Test**: Unit tests
- **Build**: Application build
- **Security**: Dependency audits with npm audit and Snyk

#### 2. **Docker Build** (`.github/workflows/docker.yml`)
Builds and pushes Docker images:
- Automatically triggered on push to `master` or `main`
- Pushes to GitHub Container Registry (GHCR)
- Caches layers for faster builds
- Tags with branch name, semver, and commit SHA

#### 3. **Deployment** (`.github/workflows/deploy.yml`)
Deploys to production:
- Triggered on push to `master` branch or version tags
- Builds and pushes Docker image
- Can trigger external deployment webhooks
- Updates deployment status on GitHub

## Environment Variables

Set these secrets in GitHub repository settings for workflows to function:

### Required for Docker Build
- `GITHUB_TOKEN` (auto-provided by GitHub Actions)

### Required for Deployment
- `DEPLOYMENT_TOKEN`: Token for triggering external deployments
- `DEPLOYMENT_WEBHOOK`: URL for deployment webhook

### Application Secrets
- `NEXT_PUBLIC_PRIVY_APP_ID`: Privy application ID
- Any other environment variables needed by the app

## Local Development with Docker

### Prerequisites
- Docker Desktop installed
- Node.js 18+ (for local development)

### Build and Run Locally

```bash
# Build the image
docker build -t decensat:dev .

# Run the container
docker run -it -p 3000:3000 decensat:dev
```

### Development Mode (with hot reload)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# The app will be available at http://localhost:3000
```

## Monitoring & Logs

### View Docker container logs

```bash
docker logs <container_id>
docker logs -f <container_id>  # Follow logs
```

### Health check

The Dockerfile includes a health check that runs every 30 seconds.

```bash
docker inspect --format='{{json .State.Health}}' <container_id>
```

## Best Practices

1. **Keep dependencies updated**: Workflows will check for vulnerabilities
2. **Tag releases**: Use semantic versioning (v1.0.0) for production deployments
3. **Monitor builds**: Check GitHub Actions tab for workflow status
4. **Security**: Never commit secrets; use GitHub Secrets only
5. **Performance**: Docker layer caching helps speed up builds

## Troubleshooting

### Workflow Failures

1. Check the GitHub Actions tab for detailed logs
2. Verify all required secrets are configured
3. Ensure Node.js version compatibility (18+)

### Docker Build Issues

1. Clear Docker cache: `docker system prune -a`
2. Rebuild without cache: `docker build --no-cache -t decensat:latest .`
3. Check .dockerignore for excluded files

### Permission Denied Errors

Ensure `GITHUB_TOKEN` has proper permissions:
- Go to Settings → Actions → General
- Select "Read and write permissions"
