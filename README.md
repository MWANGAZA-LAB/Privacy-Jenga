# 🎯 Privacy Jenga - Interactive Bitcoin Privacy Education Game

> **Learn Bitcoin privacy and security through an engaging 3D tower-building experience!**

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-3D-green.svg)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple.svg)](https://vitejs.dev/)

## 🌟 **What is Privacy Jenga?**

Privacy Jenga is an **interactive educational game** that teaches Bitcoin privacy and security concepts through engaging 3D tower mechanics. Each of the 54 blocks contains authentic Bitcoin privacy practices, making learning both fun and memorable.

<img width="1920" height="972" alt="image" src="https://github.com/user-attachments/assets/24fce154-2a7e-4343-bb16-fb645259275e" />


### 🧠 **Educational Philosophy**
This implementation focuses on **continuous learning** and eliminates traditional "game over" mechanics. When the tower becomes unstable, it smoothly resets, allowing players to explore all 54 privacy concepts without interruption.

## ✨ **Key Features**

### 🎮 **Enhanced 3D Gameplay**
- **54-Block Educational System** - Complete Jenga tower with 18 layers
- **Realistic Physics** - Beautiful block falling animations with gravity and tumbling
- **Interactive 3D Environment** - Rotate, zoom, and explore the tower
- **Dice-Based Layer Access** - Roll to determine which layers you can access
- **Real-time Tower Stability** - Dynamic stability calculation with visual feedback

### 🎯 **Bitcoin Privacy Education**
- **Authentic Privacy Practices** - Based on real Bitcoin privacy principles
- **Three Risk Categories:**
  - � **Red Blocks (1-18)** - "Never do these" - Severe privacy risks
  - 🟠 **Orange Blocks (19-36)** - "Avoid these" - Moderate risks  
  - � **Green Blocks (37-54)** - "Consider these" - Mild recommendations

### 🎲 **Advanced Game Mechanics**
- **Animated Dice Rolling** - 1.5-second rolling animation with visual feedback
- **Layer Access Control** - Strategic gameplay based on dice results
- **Progressive Difficulty** - Higher layers offer more points but increased risk
- **Synchronized UI** - All stability indicators show consistent values
- **Tactile Feedback** - Immediate visual response to block interactions

### 📚 **Educational Content Categories**
- **On-Chain Privacy** (15 blocks) - Address reuse, transaction amounts, change addresses
- **Off-Chain Practices** (10 blocks) - VPNs, operational security, wallet management
- **Coin Mixing** (10 blocks) - CoinJoin, traceability, privacy tools
- **Wallet Setup** (5 blocks) - Hierarchical wallets, seed phrase security
- **Lightning Network** (5 blocks) - Channel privacy, routing, unlinkability
- **Regulatory** (5 blocks) - KYC risks, public records, compliance
- **Best Practices** (4 blocks) - Tor usage, multisig, fund management

### 🎯 **Continuous Learning Experience**
- **No Game Over** - Tower automatically resets for uninterrupted learning
- **Achievement System** - Long-term engagement through progress tracking
- **Interactive Tutorials** - Comprehensive help system and guided learning
- **Performance Monitoring** - Real-time FPS and memory usage display (dev mode)

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn

### **Installation**
```bash
# Clone the repository
git clone https://github.com/yourusername/privacy-jenga.git
cd privacy-jenga

# Install dependencies
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

### **2. Roll the Dice**
- Click "Roll Dice" to determine layer access
- Each roll shows which layers you can pull from
- Plan your strategy based on available access

### **3. Remove Blocks**
- Click on highlighted blocks within allowed layers
- Read the privacy lesson on each block
- Answer quiz questions for bonus points

### **4. Build Your Score**
- Safe blocks earn points and stabilize the tower
- Risky blocks earn points but destabilize
- Challenge blocks offer bonus points for correct answers
- Higher layers = more points (risk vs. reward)

### **5. Continuous Learning**
- Watch the tower stability indicator
- Green = Stable, Yellow = Warning, Red = Danger
- When tower becomes unstable, it automatically resets for continuous learning
- Your score and progress are preserved across tower resets

## 🏗️ **Architecture & Technology**

### **Frontend Stack**
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with strict mode enabled
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework with custom BITSACCO theme
- **Three.js + React Three Fiber** - 3D graphics and realistic tower physics
- **React Three Drei** - Additional 3D components and controls

### **Key Components**
- **`JengaTowerRefactored`** - Enhanced 3D tower with physics and visual feedback
- **`BlockComponent`** - Individual block with realistic falling animations
- **`TowerControls`** - Real-time stability monitoring and game controls
- **`useBlockSelection`** - Advanced block selection and keyboard navigation
- **`useTowerStability`** - Synchronized stability calculation across UI
- **`useKeyboardNavigation`** - Full accessibility support
- **`GamePage`** - Main game interface with synchronized state management
- **`HomePage`** - Landing page with feature showcase and creator credits

### **State Management**
- **React Hooks** - Modern state management with useCallback and useMemo
- **Custom Hooks** - Specialized hooks for tower stability, block selection, and keyboard navigation
- **Singleton Service** - MockGameService for consistent game state management
- **Real-time Synchronization** - Unified stability calculation across all UI components

## 🎨 **UI/UX Features**

### **Visual Enhancements**
- **Animated Dice Rolling** - 1.5-second spinning animation with glow effects
- **Physics-based Block Falling** - Realistic gravity, tumbling, and fade animations
- **Dynamic Tower Stability** - Real-time color-coded stability indicators
- **Interactive 3D Controls** - Orbit controls for camera manipulation
- **Tactile Feedback** - Immediate visual response to user interactions
- **Synchronized UI Elements** - Consistent stability display across all panels

### **BITSACCO Design System**
- **Professional Dark Theme** - Custom color palette with teal accents
- **Consistent Visual Language** - Unified design across all components
- **Accessibility First** - High contrast, keyboard navigation, screen reader support
- **Responsive Layout** - Mobile-first design with touch-friendly controls

## 📱 **User Experience Features**

### **First-Time User Experience**
- **Automatic tutorial** for new players
- **Welcome overlay** explaining the unified learning experience
- **Progressive disclosure** of game mechanics and privacy concepts

### **Help System**
- **Contextual help** accessible during gameplay
- **Comprehensive rules** and strategy guides
- **Visual examples** and step-by-step instructions

### **Accessibility**
- **Keyboard navigation** support
- **Screen reader** friendly content
- **High contrast** color schemes
- **Clear visual cues** for all interactions

## 🔧 **Development**

### **Project Structure**
```
apps/web/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── jenga/          # 3D tower components
│   │   │   ├── JengaTowerRefactored.tsx  # Main 3D tower component
│   │   │   ├── BlockComponent.tsx        # Individual block with physics
│   │   │   ├── TowerControls.tsx         # Real-time controls panel
│   │   │   └── hooks/                    # Specialized game hooks
│   │   │       ├── useTowerStability.ts   # Stability calculation
│   │   │       ├── useBlockSelection.ts   # Block selection logic
│   │   │       └── useKeyboardNavigation.ts # Accessibility support
│   │   ├── ContentModal.tsx # Educational content display
│   │   ├── GameHelp.tsx     # Comprehensive help system
│   │   └── ...
│   ├── pages/               # Page components
│   │   ├── GamePage.tsx     # Main game interface
│   │   └── HomePage.tsx     # Landing page with credits
│   ├── services/            # Game logic and services
│   │   └── mockGameService.ts # Singleton game state management
│   ├── types/               # TypeScript type definitions
│   └── index.css           # Enhanced animations and BITSACCO theme
├── public/                  # Static assets
└── package.json            # Dependencies and scripts
```

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
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
- **GitHub Actions** for automated deployment

## 🚀 **Deployment**

### **GitHub Pages**
- **Automatic deployment** via GitHub Actions
- **Subdirectory routing** support (`/Privacy-Jenga/`)
- **Optimized builds** for production

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
4. Add tests if applicable
5. Submit a pull request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments & Credits**

### **Original Creators**
This project is inspired by and based on the educational content from:
- **[bitcoinjenga.com](https://bitcoinjenga.com)** by **Amiti Uttarwar** & **D++**
- Original concept of teaching Bitcoin privacy through interactive gameplay
- Authentic Bitcoin privacy practices and educational framework

### **Educational Content**
- **Authentic Privacy Practices** - All 54 privacy tips are based on real Bitcoin privacy principles from bitcoinjenga.com
- **Risk Categorization** - "Never/Avoid/Consider" framework from the original educational content
- **Community-Driven Learning** - Building upon the Bitcoin privacy education community's work

### **Technical Implementation**
- **React Three Fiber Community** - For 3D web development resources and examples
- **Three.js Contributors** - For the powerful 3D graphics library
- **Tailwind CSS Team** - For the utility-first CSS framework
- **Open Source Community** - For the incredible tools and libraries that make this possible

### **Special Thanks**
- **Bitcoin Privacy Advocates** - For their continued work in privacy education
- **Educational Game Community** - For insights on effective learning through gameplay
- **Web3 Developers** - For pushing the boundaries of interactive web experiences

## � **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

**Educational Content Attribution**: The privacy practices and educational framework are inspired by and based on [bitcoinjenga.com](https://bitcoinjenga.com) by Amiti Uttarwar & D++. This implementation serves as an interactive, web-based adaptation of their educational concepts.

## �📞 **Support & Contact**

- **Issues**: [GitHub Issues](https://github.com/MWANGAZA-LAB/Privacy-Jenga/issues)
- **Discussions**: [GitHub Discussions](https://github.com/MWANGAZA-LAB/Privacy-Jenga/discussions)
- **Original Educational Content**: [bitcoinjenga.com](https://bitcoinjenga.com)

---

**🧠 Ready to master Bitcoin privacy through interactive 3D learning?**  
**🎮 [Start your privacy education journey now!](https://MWANGAZA-LAB.github.io/Privacy-Jenga/)**

*Built with ❤️ for Bitcoin privacy education and the open-source community*  
*Inspired by the original educational work of Amiti Uttarwar & D++ at bitcoinjenga.com*
