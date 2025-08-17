# 🎯 Privacy Jenga - Interactive Bitcoin Privacy Education Game

> **Learn Bitcoin privacy and security through an engaging 3D tower-building experience!**

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-3D-green.svg)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple.svg)](https://vitejs.dev/)
[![Mobile Responsive](https://img.shields.io/badge/Mobile-Responsive-green.svg)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Responsive/responsive_design_basics)

## 🌟 **What is Privacy Jenga?**

Privacy Jenga is an **interactive educational game** that teaches Bitcoin privacy and security concepts through engaging 3D tower mechanics. Each of the 54 blocks contains authentic Bitcoin privacy practices, making learning both fun and memorable.

### 🧠 **Educational Philosophy**
This implementation focuses on **continuous learning** and eliminates traditional "game over" mechanics. When the tower becomes unstable, it smoothly resets, allowing players to explore all 54 privacy concepts without interruption.

## ✨ **Key Features**

### 🎮 **Enhanced 3D Gameplay**
- **54-Block Educational System** - Complete Jenga tower with 18 layers
- **Realistic Physics** - Beautiful block falling animations with gravity and tumbling
- **Interactive 3D Environment** - Rotate, zoom, and explore the tower
- **Question-Based Learning** - Answer privacy questions to maintain tower stability
- **Real-time Tower Stability** - Dynamic stability calculation with visual feedback

### 🎯 **Bitcoin Privacy Education**
- **Authentic Privacy Practices** - Based on real Bitcoin privacy principles
- **Three Difficulty Categories:**
  - 🔴 **Red Blocks (Hard)** - High-risk privacy practices with severe penalties
  - 🟠 **Orange Blocks (Medium)** - Moderate difficulty with balanced risk/reward
  - 🟢 **Green Blocks (Easy)** - Safe practices with gentle learning curve

### 🎲 **Advanced Game Mechanics**
- **Question-Driven Learning** - Every block contains a privacy question
- **Adaptive Difficulty** - Game adjusts based on player performance
- **Stability Impact System** - Correct answers improve stability, wrong answers reduce it
- **Achievement System** - Unlock badges for learning milestones
- **Continuous Play** - Tower rebuilds automatically for uninterrupted learning

### 📚 **Educational Content Categories**
- **On-Chain Privacy** - Address reuse, transaction amounts, change addresses
- **Off-Chain Practices** - VPNs, operational security, wallet management
- **Coin Mixing** - CoinJoin, traceability, privacy tools
- **Wallet Setup** - Hierarchical wallets, seed phrase security
- **Lightning Network** - Channel privacy, routing, unlinkability
- **Regulatory** - KYC risks, public records, compliance
- **Best Practices** - Tor usage, multisig, fund management

### 📱 **Mobile Responsive Design**
- **Cross-Platform Compatibility** - Works seamlessly on desktop, tablet, and mobile
- **Touch-Friendly Controls** - Optimized for touch interactions
- **Responsive UI Elements** - Adaptive layouts for all screen sizes
- **Mobile-Specific Features** - Dedicated mobile controls and navigation
- **Performance Optimized** - Smooth 3D rendering on mobile devices

### 🎯 **Continuous Learning Experience**
- **No Game Over** - Tower automatically resets for uninterrupted learning
- **Achievement System** - Long-term engagement through progress tracking
- **Interactive Tutorials** - Comprehensive help system and guided learning
- **Progress Tracking** - Monitor learning progress across all 54 concepts

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn

### **Installation**
```bash
# Clone the repository
git clone https://github.com/MWANGAZA-LAB/Privacy-Jenga.git
cd Privacy-Jenga

# Install dependencies
cd apps/web
npm install

# Start development server
npm run dev
```

### **Build for Production**
```bash
npm run build
```

## 🎮 **How to Play**

### **1. Start Your Journey**
- Click "Start Playing Now" to begin
- First-time users get an automatic tutorial
- Access help anytime via the Help button

### **2. Select Blocks**
- Click on any block to reveal its privacy question
- Each block contains a unique Bitcoin privacy concept
- Plan your strategy based on block difficulty (Green = Easy, Orange = Medium, Red = Hard)

### **3. Answer Questions**
- Read the privacy question carefully
- Select the correct answer from multiple choices
- Learn from the detailed explanation provided

### **4. Manage Tower Stability**
- Correct answers improve tower stability
- Wrong answers reduce stability and can cause collapse
- Watch the stability indicator (Green = Stable, Yellow = Warning, Red = Critical)

### **5. Continuous Learning**
- When the tower collapses, it automatically rebuilds
- Your progress and achievements are preserved
- Continue learning until you've mastered all 54 concepts

## 🏗️ **Architecture & Technology**

### **Frontend Stack**
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with strict mode enabled
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework with responsive design
- **Three.js + React Three Fiber** - 3D graphics and realistic tower physics
- **React Three Drei** - Additional 3D components and controls
- **Framer Motion** - Smooth animations and transitions

### **Key Components**
- **`SimplifiedJengaTower`** - Enhanced 3D tower with responsive design
- **`ContentModal`** - Interactive question display and answer handling
- **`MobileControls`** - Touch-friendly controls for mobile devices
- **`useResponsiveDesign`** - Responsive design hook for cross-platform compatibility
- **`enhancedGameService`** - Advanced game logic and state management
- **`GamePage`** - Main game interface with mobile-responsive layout

### **State Management**
- **React Hooks** - Modern state management with useCallback and useMemo
- **Custom Hooks** - Specialized hooks for responsive design and game logic
- **Enhanced Game Service** - Comprehensive game state management
- **Real-time Synchronization** - Unified stability calculation across all UI components

## 🎨 **UI/UX Features**

### **Visual Enhancements**
- **Responsive 3D Tower** - Adapts to different screen sizes
- **Physics-based Block Interactions** - Realistic animations and effects
- **Dynamic Stability Indicators** - Real-time color-coded stability feedback
- **Interactive 3D Controls** - Touch and mouse-friendly camera controls
- **Smooth Animations** - Framer Motion powered transitions
- **Mobile-Optimized UI** - Touch-friendly buttons and controls

### **Responsive Design System**
- **Mobile-First Approach** - Designed for mobile devices first
- **Breakpoint System** - Small mobile, large mobile, tablet, desktop
- **Adaptive Layouts** - UI elements adjust to screen size
- **Touch Interactions** - Optimized for touch devices
- **Performance Optimization** - Efficient rendering on all devices

## 📱 **Mobile Experience**

### **Responsive Breakpoints**
- **Small Mobile** (< 480px) - iPhone SE, small Android devices
- **Large Mobile** (480px - 767px) - iPhone 12/13/14, larger Android devices
- **Tablet** (768px - 1023px) - iPad, small laptops
- **Desktop** (≥ 1024px) - Laptops, desktops

### **Mobile-Specific Features**
- **Touch-Friendly Controls** - Larger touch targets and intuitive gestures
- **Simplified UI** - Streamlined interface for smaller screens
- **Optimized 3D Performance** - Efficient rendering for mobile GPUs
- **Mobile Navigation** - Dedicated mobile control panel
- **Responsive Typography** - Readable text at all screen sizes

## 🔧 **Development**

### **Project Structure**
```
apps/web/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── jenga/          # 3D tower components
│   │   │   └── SimplifiedJengaTower.tsx  # Main 3D tower component
│   │   ├── mobile/         # Mobile-specific components
│   │   │   └── MobileControls.tsx        # Touch-friendly controls
│   │   ├── ContentModal.tsx # Educational content display
│   │   ├── GameHelp.tsx     # Comprehensive help system
│   │   └── ...
│   ├── hooks/               # Custom React hooks
│   │   └── useResponsiveDesign.ts # Responsive design hook
│   ├── pages/               # Page components
│   │   ├── GamePage.tsx     # Main game interface
│   │   └── HomePage.tsx     # Landing page
│   ├── services/            # Game logic and services
│   │   └── simplifiedGameService.ts # Enhanced game state management
│   ├── types/               # TypeScript type definitions
│   └── index.css           # Responsive styles and animations
├── public/                  # Static assets
└── package.json            # Dependencies and scripts
```

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:pages  # Build for GitHub Pages
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
npm run test:ci      # Run tests in CI mode
```

## 🧪 **Testing & Quality**

### **Code Quality**
- **TypeScript** for type safety
- **ESLint** for code consistency
- **Prettier** for code formatting
- **Strict mode** enabled

### **Build Process**
- **Vite** for fast development and optimized builds
- **Tree shaking** for minimal bundle size
- **Code splitting** for optimal performance
- **GitHub Actions** for automated deployment with mobile responsiveness checks

### **Mobile Testing**
- **Responsive Design Verification** - Automated checks for viewport meta tags
- **CSS Media Query Validation** - Ensures responsive styles are present
- **Cross-Platform Compatibility** - Tested on various devices and browsers

## 🚀 **Deployment**

### **GitHub Pages**
- **Automatic deployment** via GitHub Actions
- **Mobile responsiveness verification** in CI/CD pipeline
- **Optimized builds** for production
- **Subdirectory routing** support

### **Environment Variables**
```bash
# Development
VITE_APP_TITLE=Privacy Jenga (Dev)

# Production  
VITE_APP_TITLE=Privacy Jenga
```

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Setup**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on multiple devices and screen sizes
5. Add tests if applicable
6. Submit a pull request

### **Mobile Development Guidelines**
- Test on actual mobile devices when possible
- Use the responsive design hook for consistent breakpoints
- Ensure touch targets are at least 44px × 44px
- Optimize 3D performance for mobile GPUs
- Test with different screen orientations

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments & Credits**

### **Original Creators**
This project is inspired by and based on the educational content from:
- **[bitcoinjenga.com](https://bitcoinjenga.com)** by **Amiti Uttarwar** & **D++**
- Original concept of teaching Bitcoin privacy through interactive gameplay
- Authentic Bitcoin privacy practices and educational framework

### **Educational Content**
- **Authentic Privacy Practices** - All 54 privacy questions are based on real Bitcoin privacy principles
- **Risk Categorization** - Difficulty-based learning system for progressive education
- **Community-Driven Learning** - Building upon the Bitcoin privacy education community's work

### **Technical Implementation**
- **React Three Fiber Community** - For 3D web development resources and examples
- **Three.js Contributors** - For the powerful 3D graphics library
- **Tailwind CSS Team** - For the utility-first CSS framework
- **Open Source Community** - For the incredible tools and libraries that make this possible

### **Mobile Development**
- **Responsive Design Community** - For mobile-first design principles
- **Web Performance Community** - For optimization techniques
- **Touch Interaction Experts** - For mobile UX best practices

## 📞 **Support & Contact**

- **Issues**: [GitHub Issues](https://github.com/MWANGAZA-LAB/Privacy-Jenga/issues)
- **Discussions**: [GitHub Discussions](https://github.com/MWANGAZA-LAB/Privacy-Jenga/discussions)
- **Original Educational Content**: [bitcoinjenga.com](https://bitcoinjenga.com)

---

**🧠 Ready to master Bitcoin privacy through interactive 3D learning?**  
**🎮 [Start your privacy education journey now!](https://MWANGAZA-LAB.github.io/Privacy-Jenga/)**

*Built with ❤️ for Bitcoin privacy education and the open-source community*  
*Inspired by the original educational work of Amiti Uttarwar & D++ at bitcoinjenga.com*
