# Docker Deployment Guide

## 🐳 Container Configuration

This project is containerized using Docker with the following setup:
- **Container Name**: todo-project
- **Docker Repository**: anildhami007/todo-project
- **Region**: Central India
- **Operating System**: Linux

## 📋 Prerequisites

1. Docker installed on your machine
2. GitHub repository for your project
3. Docker Hub account (anildhami007)
4. Azure account with Web App service

## 🚀 Quick Start - Local Development

### Build and Run with Docker Compose

```bash
# Build and start all services (app + MongoDB)
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f app
```

Your application will be available at: http://localhost:3001

### Build Docker Image Manually

```bash
# Build the image
docker build -t anildhami007/todo-project:latest .

# Run the container
docker run -d -p 3001:3001 --name todo-project anildhami007/todo-project:latest
```

## 🔄 Automatic Deployment Setup

### Step 1: Set up GitHub Repository

1. Initialize Git (if not already done):
```bash
git init
git add .
git commit -m "Initial commit with Docker configuration"
```

2. Create a repository on GitHub and push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 2: Configure GitHub Secrets

Add these secrets to your GitHub repository (Settings → Secrets and variables → Actions):

1. **DOCKER_ACCESS_TOKEN**
   - Value: Your Docker Hub access token
   - This allows GitHub Actions to push images to Docker Hub

2. **AZURE_WEBAPP_PUBLISH_PROFILE** (Get from Azure Portal)
   - Go to your Azure Web App
   - Click "Download publish profile"
   - Copy the entire XML content and paste as secret value

### Step 3: Create Azure Web App

1. **Log in to Azure Portal** (https://portal.azure.com)

2. **Create a new Web App**:
   - Click "Create a resource"
   - Search for "Web App"
   - Click "Create"

3. **Configure Web App**:
   - **Subscription**: Your subscription
   - **Resource Group**: Create new or use existing
   - **Name**: `todo-project` (or your preferred name)
   - **Publish**: Docker Container
   - **Operating System**: Linux
   - **Region**: Central India
   - **Pricing Plan**: Choose based on your needs (B1 or higher recommended)

4. **Configure Docker settings**:
   - **Options**: Single Container
   - **Image Source**: Docker Hub
   - **Access Type**: Public
   - **Image and tag**: `anildhami007/todo-project:latest`
   - **Startup Command**: Leave empty (uses Dockerfile CMD)

5. **Add Application Settings** (Configuration → Application settings):
   - `MONGODB_URI`: Your MongoDB connection string (use Azure Cosmos DB or MongoDB Atlas)
   - `PORT`: 3001
   - `WEBSITES_PORT`: 3001 (Azure-specific setting)

6. **Enable Continuous Deployment**:
   - Go to "Deployment Center"
   - Enable "Continuous deployment"
   - This will pull new images automatically when you push to Docker Hub

### Step 4: Set up MongoDB Database

Choose one of these options:

#### Option A: Azure Cosmos DB (Recommended for Azure)
1. Create Azure Cosmos DB for MongoDB
2. Get connection string from Azure Portal
3. Add to Web App configuration as `MONGODB_URI`

#### Option B: MongoDB Atlas (Cloud)
1. Create free cluster at https://www.mongodb.com/cloud/atlas
2. Whitelist Azure IP addresses (or use 0.0.0.0/0 for all)
3. Get connection string and add to Web App configuration

#### Option C: Azure Container Instance (Self-hosted)
```bash
az container create \
  --resource-group YOUR_RESOURCE_GROUP \
  --name todo-mongo \
  --image mongo:latest \
  --ports 27017 \
  --cpu 1 \
  --memory 1.5
```

## 🔄 How Automatic Deployment Works

1. **You make changes** to your code locally
2. **Commit and push** to GitHub:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin main
   ```
3. **GitHub Actions triggers** automatically:
   - Builds new Docker image
   - Pushes to Docker Hub (anildhami007/todo-project)
   - Notifies Azure Web App

4. **Azure Web App detects** new image:
   - Pulls latest image from Docker Hub
   - Restarts container with new version
   - Your changes are LIVE! 🎉

## 📊 Monitoring and Logs

### View Azure Web App Logs
```bash
# Using Azure CLI
az webapp log tail --name todo-project --resource-group YOUR_RESOURCE_GROUP

# Or view in Azure Portal
# Go to Web App → Monitoring → Log stream
```

### View Docker Hub Builds
- Visit: https://hub.docker.com/r/anildhami007/todo-project

### View GitHub Actions
- Visit: https://github.com/YOUR_USERNAME/YOUR_REPO/actions

## 🛠️ Troubleshooting

### Container not starting
1. Check logs in Azure Portal (Log stream)
2. Verify `WEBSITES_PORT` is set to 3001
3. Ensure MongoDB connection string is correct

### GitHub Actions failing
1. Verify Docker access token is correct in GitHub Secrets
2. Check Actions tab for error details
3. Ensure Docker Hub repository exists

### Application errors
1. Check environment variables in Azure
2. Verify MongoDB is accessible
3. Review application logs

## 🔐 Security Notes

- Never commit `.env` files or secrets to Git
- Rotate Docker access tokens periodically
- Use Azure Key Vault for sensitive data in production
- Enable Azure Web App authentication if needed

## 📱 Accessing Your Application

Once deployed, your app will be available at:
- **Azure URL**: https://todo-project.azurewebsites.net
- **Custom domain**: Can be configured in Azure Portal

## 💡 Tips

1. **Tag versions**: Use semantic versioning for production
   ```bash
   docker tag anildhami007/todo-project:latest anildhami007/todo-project:v1.0.0
   ```

2. **Test locally first**: Always test with `docker-compose up` before pushing

3. **Monitor costs**: Check Azure billing regularly

4. **Backup database**: Set up automated backups for MongoDB

5. **Use staging slot**: Azure supports deployment slots for testing before production

## 🎯 Next Steps

1. Set up custom domain name
2. Enable HTTPS/SSL certificate
3. Configure scaling rules
4. Set up monitoring and alerts
5. Implement health checks
6. Add database backups

---

**Need help?** Check Azure documentation or Docker Hub support.
