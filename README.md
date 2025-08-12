# 🎮 Privacy Jenga

**Multiplayer educational privacy game with Jenga-style mechanics powered by Bitsacco**

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-blue?style=flat-square)](https://mwanga-lab.github.io/Privacy-Jenga/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)

## 🚀 **Quick Start**

### **Frontend-Only Version (Current)**
The game is now **frontend-only** and works completely offline! No backend server required.

```bash
# Clone the repository
git clone https://github.com/MWANGAZA-LAB/Privacy-Jenga.git
cd Privacy-Jenga

# Install dependencies
cd apps/web
npm install

# Start the game
npm run dev
```

**Open your browser**: http://localhost:5173

### **Features Available Now**
- ✅ **Complete Jenga Game**: All mechanics working
- ✅ **Privacy Education**: Educational content in each block
- ✅ **Single Player Mode**: Full game experience
- ✅ **Local Storage**: Game progress saved in browser
- ✅ **Responsive Design**: Works on mobile and desktop
- ✅ **Bitsacco Branding**: Teal horse logo and theme

## 🏗️ **Architecture Overview**

### **Current Implementation (Frontend-Only)**
```
Client (Browser/Mobile)
├── React + Vite + Tailwind CSS
├── Game UI: React Three Fiber (3D) + Canvas (2D)
├── Mock Game Service (in-memory state)
├── Local Storage for persistence
└── Responsive design for all devices
```

### **Future Scalability Features (Coming Soon)**
```
🔄 Real-time Multiplayer
├── Socket.IO client for real-time communication
├── Optional Lightning wallet integration
└── Multiplayer rooms and turn management

🔄 Backend Services
├── Node.js + TypeScript + Express
├── Socket.IO server with Redis adapter
├── PostgreSQL for persistent data
└── Redis for ephemeral room state

🔄 Infrastructure
├── Docker containers
├── Managed PostgreSQL (AWS RDS/Supabase)
├── Managed Redis (AWS ElastiCache)
└── Monitoring and analytics
```

## 🎯 **Game Features**

### **Core Gameplay**
- **Jenga Tower**: 3D interactive tower with realistic physics
- **Privacy Blocks**: Each block contains educational privacy content
- **Turn-Based**: Strategic block removal with educational rewards
- **Scoring System**: Points for correct privacy knowledge
- **Local Progress**: Save your learning journey in the browser

### **Educational Content**
- **Security Tips**: Two-factor authentication, password security
- **Privacy Best Practices**: Social media settings, data sharing
- **Network Safety**: Public WiFi security, VPN usage
- **Digital Hygiene**: Regular updates, backup strategies

## 🚧 **Development Roadmap**

### **Phase 1: Frontend MVP (✅ Complete)**
- [x] Core Jenga game mechanics
- [x] Privacy education content
- [x] Single-player experience
- [x] Responsive design
- [x] Local storage persistence

### **Phase 2: Multiplayer Features (Coming Soon)**
- [ ] Real-time multiplayer rooms
- [ ] Turn management system
- [ ] Chat functionality
- [ ] Player leaderboards
- [ ] Room creation and joining

### **Phase 3: Advanced Features (Coming Soon)**
- [ ] Backend API services
- [ ] User authentication
- [ ] Progress tracking
- [ ] Analytics and insights
- [ ] Admin panel for content management

## 🛠️ **Tech Stack**

### **Frontend (Current)**
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **3D Graphics**: React Three Fiber + Three.js
- **State Management**: React Hooks + Local Storage
- **Mock Services**: In-memory game state

### **Future Backend (Coming Soon)**
- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Real-time**: Socket.IO + Redis adapter
- **Database**: PostgreSQL
- **Caching**: Redis
- **Deployment**: Docker + Kubernetes

## 📱 **Access URLs**

### **Local Development**
- **Web Client**: http://localhost:5173
- **Game**: Fully functional frontend-only version

### **Production (GitHub Pages)**
- **Live Game**: https://mwanga-lab.github.io/Privacy-Jenga/
- **Repository**: https://github.com/MWANGAZA-LAB/Privacy-Jenga

## 🔧 **Development Commands**

```bash
# Frontend development
cd apps/web
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Future backend commands (when implemented)
cd services/api
npm run dev          # Start API server
npm run build        # Build API
npm run test         # Run tests
```

## 🌟 **Why Frontend-Only First?**

### **Advantages of Current Approach**
1. **Instant Deployment**: Works immediately on GitHub Pages
2. **No Server Costs**: Free hosting and scaling
3. **Faster Development**: Focus on game mechanics and UX
4. **Easier Testing**: All features testable locally
5. **Mobile Ready**: Works offline on all devices

### **Future Benefits**
- **Progressive Enhancement**: Add features incrementally
- **User Feedback**: Gather input before building backend
- **Performance**: Optimize frontend before scaling
- **Cost Control**: Only add infrastructure when needed

## 🤝 **Contributing**

We welcome contributions! The project is designed for easy frontend development:

1. **Fork** the repository
2. **Create** a feature branch
3. **Develop** using the mock service
4. **Test** locally without backend
5. **Submit** a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Bitsacco**: For the educational mission and branding
- **MWANGAZA-LAB**: Development team and vision
- **Privacy Community**: For educational content inspiration
- **Open Source**: Built with amazing open-source tools

---

**🎮 Ready to play?** [Start the game now!](https://mwanga-lab.github.io/Privacy-Jenga/)

**🔮 Want to contribute?** Check out our [roadmap](#development-roadmap) and help build the future of privacy education!
