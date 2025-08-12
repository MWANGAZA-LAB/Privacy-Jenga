#!/bin/bash

# Privacy Jenga Deployment Script
# This script handles the complete deployment process

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="privacy-jenga"
REGISTRY_URL="${REGISTRY_URL:-localhost:5000}"
ENVIRONMENT="${ENVIRONMENT:-development}"
VERSION="${VERSION:-latest}"

echo -e "${BLUE}🚀 Privacy Jenga Deployment Script${NC}"
echo -e "${BLUE}================================${NC}"
echo -e "Environment: ${YELLOW}${ENVIRONMENT}${NC}"
echo -e "Version: ${YELLOW}${VERSION}${NC}"
echo -e "Registry: ${YELLOW}${REGISTRY_URL}${NC}"
echo ""

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    
    # Check if docker-compose is available
    if ! command -v docker-compose &> /dev/null; then
        print_error "docker-compose is not installed. Please install it and try again."
        exit 1
    fi
    
    # Check if required environment variables are set
    if [ -z "$POSTGRES_PASSWORD" ]; then
        print_warning "POSTGRES_PASSWORD not set, using default"
        export POSTGRES_PASSWORD="secure_password_123"
    fi
    
    if [ -z "$REDIS_PASSWORD" ]; then
        print_warning "REDIS_PASSWORD not set, using default"
        export REDIS_PASSWORD="redis_password_123"
    fi
    
    if [ -z "$JWT_SECRET" ]; then
        print_warning "JWT_SECRET not set, using default"
        export JWT_SECRET="your_jwt_secret_here_change_in_production"
    fi
    
    print_status "Prerequisites check completed"
}

# Build and push Docker images
build_images() {
    print_status "Building Docker images..."
    
    # Build API service
    print_status "Building API service..."
    docker build -t ${REGISTRY_URL}/${PROJECT_NAME}-api:${VERSION} ./services/api
    
    # Build Web app
    print_status "Building Web app..."
    docker build -t ${REGISTRY_URL}/${PROJECT_NAME}-web:${VERSION} ./apps/web
    
    # Build Admin panel
    print_status "Building Admin panel..."
    docker build -t ${REGISTRY_URL}/${PROJECT_NAME}-admin:${VERSION} ./apps/admin
    
    print_status "All images built successfully"
}

# Push images to registry
push_images() {
    if [ "$ENVIRONMENT" = "production" ]; then
        print_status "Pushing images to registry..."
        
        docker push ${REGISTRY_URL}/${PROJECT_NAME}-api:${VERSION}
        docker push ${REGISTRY_URL}/${PROJECT_NAME}-web:${VERSION}
        docker push ${REGISTRY_URL}/${PROJECT_NAME}-admin:${VERSION}
        
        print_status "Images pushed successfully"
    else
        print_warning "Skipping image push in ${ENVIRONMENT} environment"
    fi
}

# Deploy services
deploy_services() {
    print_status "Deploying services..."
    
    # Stop existing services
    docker-compose -f ./infra/docker/docker-compose.yml down
    
    # Start services
    docker-compose -f ./infra/docker/docker-compose.yml up -d
    
    print_status "Services deployed successfully"
}

# Wait for services to be ready
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for PostgreSQL
    print_status "Waiting for PostgreSQL..."
    until docker exec privacy-jenga-postgres pg_isready -U privacy_jenga_user; do
        sleep 2
    done
    
    # Wait for Redis
    print_status "Waiting for Redis..."
    until docker exec privacy-jenga-redis redis-cli -a $REDIS_PASSWORD ping; do
        sleep 2
    done
    
    # Wait for API
    print_status "Waiting for API service..."
    until curl -f http://localhost:3001/health > /dev/null 2>&1; do
        sleep 2
    done
    
    print_status "All services are ready"
}

# Run database migrations
run_migrations() {
    print_status "Running database migrations..."
    
    # Wait a bit for the database to be fully ready
    sleep 5
    
    # Run migrations
    docker exec privacy-jenga-api npm run db:migrate
    
    print_status "Database migrations completed"
}

# Seed initial data
seed_data() {
    print_status "Seeding initial data..."
    
    # Seed default content
    docker exec privacy-jenga-api npm run db:seed
    
    print_status "Data seeding completed"
}

# Health check
health_check() {
    print_status "Performing health check..."
    
    # Check API health
    API_HEALTH=$(curl -s http://localhost:3001/health)
    if echo "$API_HEALTH" | grep -q "healthy"; then
        print_status "API service is healthy"
    else
        print_error "API service health check failed"
        echo "$API_HEALTH"
        exit 1
    fi
    
    # Check Web app
    if curl -f http://localhost:5173 > /dev/null 2>&1; then
        print_status "Web app is accessible"
    else
        print_error "Web app is not accessible"
        exit 1
    fi
    
    # Check Admin panel
    if curl -f http://localhost:3002 > /dev/null 2>&1; then
        print_status "Admin panel is accessible"
    else
        print_error "Admin panel is not accessible"
        exit 1
    fi
    
    print_status "All services are healthy"
}

# Show deployment info
show_deployment_info() {
    echo ""
    echo -e "${BLUE}🎉 Deployment Completed Successfully!${NC}"
    echo -e "${BLUE}=====================================${NC}"
    echo -e "🌐 Web App: ${GREEN}http://localhost:5173${NC}"
    echo -e "📡 API: ${GREEN}http://localhost:3001${NC}"
    echo -e "⚙️  Admin Panel: ${GREEN}http://localhost:3002${NC}"
    echo -e "📊 Grafana: ${GREEN}http://localhost:3000${NC}"
    echo -e "📈 Prometheus: ${GREEN}http://localhost:9090${NC}"
    echo ""
    echo -e "${YELLOW}Useful Commands:${NC}"
    echo -e "  View logs: ${BLUE}docker-compose -f ./infra/docker/docker-compose.yml logs -f${NC}"
    echo -e "  Stop services: ${BLUE}docker-compose -f ./infra/docker/docker-compose.yml down${NC}"
    echo -e "  Restart services: ${BLUE}docker-compose -f ./infra/docker/docker-compose.yml restart${NC}"
    echo ""
}

# Main deployment flow
main() {
    echo -e "${BLUE}Starting deployment process...${NC}"
    
    check_prerequisites
    build_images
    push_images
    deploy_services
    wait_for_services
    run_migrations
    seed_data
    health_check
    show_deployment_info
    
    echo -e "${GREEN}🎯 Deployment completed successfully!${NC}"
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "build")
        check_prerequisites
        build_images
        ;;
    "push")
        check_prerequisites
        push_images
        ;;
    "up")
        deploy_services
        ;;
    "down")
        docker-compose -f ./infra/docker/docker-compose.yml down
        ;;
    "logs")
        docker-compose -f ./infra/docker/docker-compose.yml logs -f
        ;;
    "health")
        health_check
        ;;
    *)
        echo "Usage: $0 {deploy|build|push|up|down|logs|health}"
        echo "  deploy  - Full deployment (default)"
        echo "  build   - Build Docker images only"
        echo "  push    - Push images to registry only"
        echo "  up      - Start services only"
        echo "  down    - Stop services"
        echo "  logs    - View service logs"
        echo "  health  - Health check only"
        exit 1
        ;;
esac
