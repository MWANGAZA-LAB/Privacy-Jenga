# 🎯 **Privacy Jenga - Complete Implementation**

> **Multiplayer educational privacy game with Jenga-style mechanics powered by Bitsacco**

## 🏗️ **Architecture Overview**

```
Client (Browser/Mobile)
├── React + Vite + Tailwind CSS
├── Game UI: React Three Fiber (3D) + Canvas (2D)
├── Socket.IO client for real-time communication
└── Optional Lightning wallet integration

⬇️ HTTPS / WSS

Edge & CDN
├── Vercel/Netlify for static assets
├── Cloudflare CDN for global distribution
└── Redis for session management

Backend (API + Real-time)
├── Node.js + TypeScript + Express
├── Socket.IO server with Redis adapter
├── PostgreSQL for persistent data
├── Redis for ephemeral room state
└── Admin service + Headless CMS

Infrastructure
├── Docker containers
├── Managed PostgreSQL (AWS RDS/Supabase)
├── Managed Redis (AWS ElastiCache)
├── Monitoring: Sentry + Prometheus/Grafana
└── Analytics: PostHog self-hosted
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### **1. Clone & Setup**
```bash
git clone <repository-url>
cd privacy-jenga
npm install
npm run install:all
```

### **2. Environment Configuration**
```bash
cp env.example .env
# Edit .env with your configuration
```

### **3. Start Development Environment**
```bash
# Option 1: Use PowerShell script (Windows)
.\start-dev.ps1

# Option 2: Manual start
npm run dev:api    # Terminal 1
npm run dev:web    # Terminal 2
npm run dev:admin  # Terminal 3
```

### **4. Access Services**
- 🌐 **Web App**: http://localhost:5173
- 📡 **API**: http://localhost:3001
- ⚙️ **Admin**: http://localhost:3002
- 📊 **Grafana**: http://localhost:3000

## 🏗️ **Project Structure**

```
privacy-jenga/
├── apps/
│   ├── web/                    # Frontend React app
│   └── admin/                  # Admin panel + CMS
├── services/
│   ├── api/                    # Backend API + Socket.IO
│   └── worker/                 # Background tasks
├── packages/
│   ├── ui/                     # Shared React components
│   └── types/                  # Shared TypeScript types
├── infra/
│   ├── docker/                 # Docker configurations
│   ├── k8s/                    # Kubernetes manifests
│   └── terraform/              # Infrastructure as Code
└── scripts/                    # Deployment & utility scripts
```

## 🔌 **API Endpoints**

### **REST API (HTTPS)**
```
POST /api/v1/rooms              # Create room
POST /api/v1/rooms/:id/join     # Join room
GET  /api/v1/rooms/:id/state    # Get room state
POST /api/v1/rooms/:id/start    # Start game
GET  /api/v1/content            # Get content packs
POST /api/v1/admin/content      # Create/edit content
```

### **Socket.IO Events (WSS)**
```
Client → Server:
├── create_room {settings}
├── join_room {roomId, nickname}
├── start_game {}
├── pick_block {blockId}
├── answer_quiz {blockId, answer}
└── chat_message {text}

Server → Clients:
├── room_created {roomId, code}
├── player_joined {player}
├── game_started {turnOrder}
├── block_removed {blockId, content}
├── quiz_result {blockId, playerId, correct}
└── turn_changed {nextPlayerId}
```

## 🗄️ **Data Model**

### **Core Tables**
```sql
-- Rooms
rooms (id, code, settings, status, created_at, expires_at)

-- Players  
players (id, room_id, nickname, avatar, session_id, points)

-- Blocks
blocks (id, content_id, pos_index, removed, removed_by, removed_at)

-- Content
contents (id, title, text, severity, quiz, tags, locale)

-- Events
events (id, room_id, player_id, type, meta, created_at)
```

### **Redis Schema**
```
room:{id} → Room state (players[], blocks[], currentTurn)
pubsub:rooms → Cross-instance room synchronization
```

## 🔒 **Security & Privacy Features**

### **Security Checklist** ✅
- [x] HTTPS/WSS only
- [x] Input validation & sanitization
- [x] Rate limiting (API + Chat)
- [x] CORS configuration
- [x] Helmet security headers
- [x] SQL injection prevention
- [x] XSS protection
- [x] CSRF protection

### **Privacy Features** ✅
- [x] Minimal PII collection (nickname only)
- [x] Ephemeral room data (24h expiry)
- [x] Anonymized analytics
- [x] No IP→identity mapping
- [x] GDPR compliance ready
- [x] Data minimization
- [x] User consent flows

## 🚀 **Deployment**

### **Docker Deployment**
```bash
# Full deployment
bash scripts/deploy.sh

# Individual commands
bash scripts/deploy.sh build    # Build images
bash scripts/deploy.sh push     # Push to registry  
bash scripts/deploy.sh up       # Start services
bash scripts/deploy.sh down     # Stop services
bash scripts/deploy.sh health   # Health check
```

### **Production Checklist**
- [ ] Set secure environment variables
- [ ] Configure SSL/TLS certificates
- [ ] Set up monitoring & alerting
- [ ] Configure backup strategies
- [ ] Set up CI/CD pipeline
- [ ] Load testing validation
- [ ] Security audit completion

## 🎮 **Game Features**

### **Core Gameplay**
- **Multiplayer Rooms**: 2-6 players
- **Turn-based**: Deterministic block removal
- **Educational Content**: Privacy lessons per block
- **Quiz System**: Points & explanations
- **Real-time Chat**: Room-based communication
- **Scoring**: Leaderboards & achievements

### **Content System**
- **Block Categories**: Tips, Warnings, Critical
- **Localization**: English + Swahili support
- **Admin CMS**: Content management interface
- **Content Packs**: Curated educational themes

### **Bitsacco Integration**
- **Branding**: Teal horse logo throughout
- **Theme Colors**: Teal/cyan color scheme
- **External Links**: Direct to bitsacco.com
- **Reward System**: Optional Lightning integration

## 📊 **Monitoring & Analytics**

### **Infrastructure Monitoring**
- **Prometheus**: Metrics collection
- **Grafana**: Dashboards & visualization
- **Health Checks**: Service availability
- **Performance Metrics**: Response times, throughput

### **Game Analytics**
- **Player Engagement**: Session duration, retention
- **Content Performance**: Block completion rates
- **Quiz Analytics**: Success rates, difficulty analysis
- **Privacy Metrics**: Learning outcomes tracking

## 🧪 **Testing**

### **Test Coverage**
```bash
# Run all tests
npm test

# Individual test suites
npm run test:api     # Backend tests
npm run test:web     # Frontend tests
npm run test:e2e     # End-to-end tests
```

### **Testing Strategy**
- **Unit Tests**: Jest + Testing Library
- **Integration Tests**: API endpoints + Socket events
- **E2E Tests**: Cypress for user flows
- **Load Testing**: k6 for performance validation

## 🔧 **Development Commands**

### **Available Scripts**
```bash
# Development
npm run dev              # Start all services
npm run dev:api          # Start API only
npm run dev:web          # Start web app only
npm run dev:admin        # Start admin panel only

# Building
npm run build            # Build all packages
npm run build:api        # Build API
npm run build:web        # Build web app

# Quality
npm run lint             # Lint all code
npm run test             # Run all tests
npm run type-check       # TypeScript validation
```

## 🌍 **Environment Variables**

### **Required Variables**
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:port/db
POSTGRES_PASSWORD=secure_password

# Redis
REDIS_URL=redis://:password@host:port
REDIS_PASSWORD=redis_password

# Security
JWT_SECRET=your_jwt_secret_here
```

### **Optional Variables**
```bash
# External Services
LNBITS_URL=https://lnbits.com
LNBITS_API_KEY=your_api_key

# Monitoring
SENTRY_DSN=your_sentry_dsn
PROMETHEUS_ENABLED=true
```

## 📈 **Performance & Scaling**

### **Scaling Strategy**
- **Horizontal Scaling**: Multiple API instances
- **Redis Adapter**: Socket.IO cross-instance sync
- **Load Balancing**: Nginx reverse proxy
- **CDN**: Static asset distribution
- **Database**: Connection pooling + read replicas

### **Performance Targets**
- **API Response**: < 100ms (95th percentile)
- **Socket Latency**: < 50ms
- **Game State Sync**: < 100ms
- **Concurrent Users**: 1000+ per instance

## 🤝 **Contributing**

### **Development Workflow**
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### **Code Standards**
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb + custom rules
- **Prettier**: Consistent formatting
- **Conventional Commits**: Standard commit messages

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Bitsacco**: For the educational mission and branding
- **MWANGAZA-LAB**: Development team
- **Open Source Community**: For the amazing tools and libraries

---

## 🚀 **Ready to Deploy?**

The Privacy Jenga system is now fully implemented and ready for deployment! 

**Next Steps:**
1. Configure your environment variables
2. Run the deployment script
3. Access your services
4. Start playing and learning!

**Need Help?**
- Check the [Issues](../../issues) page
- Review the [Wiki](../../wiki) for detailed guides
- Contact the development team

**Happy Gaming & Learning! 🎮✨**
