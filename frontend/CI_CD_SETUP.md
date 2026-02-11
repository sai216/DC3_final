# CI/CD Implementation Guide

## 1. Configure GitHub Repository Secrets

Go to: **Settings → Secrets and variables → Actions**

### Essential Secrets to Add:

```
SNYK_TOKEN                  (Optional, for security scanning)
DEPLOYMENT_WEBHOOK          (Optional, for external deployments)
DEPLOYMENT_TOKEN            (Optional, for webhook auth)
```

## 2. Verify Workflow Permissions

Go to: **Settings → Actions → General**

✅ Enable:
- "Read and write permissions"
- "Allow GitHub Actions to create and approve pull requests"

## 3. How CI/CD Workflows Are Triggered

### Automatic Triggers:

```yaml
# CI Pipeline (ci.yml)
Trigger: Any push or PR to master/main/develop
Runs: Lint → Type Check → Test → Build → Security

# Docker Build (docker.yml)
Trigger: Push to master/main
Pushes image to: ghcr.io/your-repo

# Deploy (deploy.yml)
Trigger: Push to master branch or version tags (v*.*)
Deploys: Latest image to production
```

## 4. Manual Workflow Dispatch

For manual deployments without code changes:

**Go to Actions tab → Select workflow → "Run workflow"**

## 5. Monitoring Your Workflows

### View Workflow Status:
1. Push code to your repository
2. Go to **Actions** tab
3. Click on the workflow run to see real-time logs
4. Check ✅ or ❌ status

### Real-time Logs:
```
Each job shows:
- ✅ Successful steps
- ❌ Failed steps with error messages
- ⏱️ Execution time
```

## 6. Step-by-Step: Your First Deployment

### Step 1: Make Code Changes
```bash
git add .
git commit -m "Your feature"
git push origin master
```

### Step 2: Watch the Workflow
- GitHub automatically triggers CI workflow
- Check Actions tab for:
  - ✅ Linting passed
  - ✅ Type checking passed
  - ✅ Build completed
  - ✅ Security scan completed

### Step 3: Docker Build
- Automatically builds Docker image
- Pushes to ghcr.io/sai216/Decesant_Dc3

### Step 4: Deployment (Optional)
- If you have webhooks configured, deployment triggers
- Otherwise, manually deploy the image

## 7. Using Your Docker Image

### Pull from GitHub Container Registry:
```bash
docker login ghcr.io
docker pull ghcr.io/sai216/Decesant_Dc3:latest
docker run -p 3000:3000 ghcr.io/sai216/Decesant_Dc3:latest
```

### Or use specific commit SHA:
```bash
docker pull ghcr.io/sai216/Decesant_Dc3:<commit-sha>
```

## 8. Common CI/CD Tasks

### Force Rebuild (without code changes):
1. Go to **Actions** tab
2. Select **"Build and Push Docker Image"**
3. Click **"Run workflow"**
4. Select branch: **master**
5. Click **"Run workflow"**

### Deploy to Production:
```bash
# Tag a release
git tag v1.0.0
git push origin v1.0.0

# This triggers the deploy workflow automatically
```

### Skip CI for a Commit:
```bash
git commit -m "Your message [skip ci]"
git push origin master
```

## 9. Troubleshooting Failed Workflows

### Check Logs:
1. Go to **Actions** → Failed workflow
2. Click on failed job
3. Expand the failed step
4. Read the error message

### Common Issues:

**❌ "npm ERR! code EWORKSPACECYCLE"**
- Solution: Run `npm install` locally first, commit lock file

**❌ "Docker build failed"**
- Check Dockerfile syntax
- Ensure all required files exist
- View build logs in Actions

**❌ "Node modules not found"**
- Ensure package-lock.json is committed
- Delete node_modules: `rm -rf node_modules`

## 10. Best Practices

### ✅ DO:
- Commit often with descriptive messages
- Use semantic versioning for releases (v1.0.0)
- Run tests locally before pushing
- Monitor workflow status after every push
- Keep secrets secure (never commit them)

### ❌ DON'T:
- Commit directly to master without testing
- Skip security scans in production
- Use hardcoded secrets in code
- Ignore workflow failures
- Deploy without reviewing changes

## 11. Next Steps

### 1. Test Locally:
```bash
npm install
npm run build
npm test
```

### 2. Push Code:
```bash
git push origin master
```

### 3. Monitor Workflow:
- Go to **Actions** tab
- Watch the pipeline execute
- Verify all steps pass ✅

### 4. Deploy Image:
```bash
docker pull ghcr.io/sai216/Decesant_Dc3:latest
docker run -p 3000:3000 ghcr.io/sai216/Decesant_Dc3:latest
```

## 12. Deployment Options

### Option A: Manual Docker Deployment
```bash
docker pull ghcr.io/sai216/Decesant_Dc3:latest
docker run -p 3000:3000 ghcr.io/sai216/Decesant_Dc3:latest
```

### Option B: Using Docker Compose
```bash
# Create docker-compose.yml with your image
docker-compose up
```

### Option C: Cloud Deployment
- AWS ECS
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform

### Option D: Kubernetes
```bash
kubectl apply -f k8s-deployment.yaml
```

## Quick Reference Commands

```bash
# View workflow status
git log --oneline -10

# Check which commit triggered a workflow
git show <commit-hash>

# Manually run a workflow
# Go to Actions → Select workflow → "Run workflow"

# Force push (use with caution!)
git push --force origin master

# View remote branches
git branch -r

# Create release tag
git tag v1.0.0
git push origin v1.0.0

# View tags
git tag -l
```

## Monitoring Dashboard

Create a status badge in your README.md:

```markdown
[![CI/CD Pipeline](https://github.com/sai216/Decesant_Dc3/actions/workflows/ci.yml/badge.svg)](https://github.com/sai216/Decesant_Dc3/actions)

[![Docker Build](https://github.com/sai216/Decesant_Dc3/actions/workflows/docker.yml/badge.svg)](https://github.com/sai216/Decesant_Dc3/actions)
```

---

**Your workflows are now live! Every push automatically triggers CI/CD. 🚀**
