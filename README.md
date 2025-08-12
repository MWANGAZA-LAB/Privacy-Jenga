# 🎯 Privacy Jenga - Interactive Privacy Education Game

> **Learn online privacy and security through an engaging tower-building experience!**

[![Build Status](https://github.com/yourusername/privacy-jenga/actions/workflows/static.yml/badge.svg)](https://github.com/yourusername/privacy-jenga/actions/workflows/static.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 **What is Privacy Jenga?**

Privacy Jenga is an **interactive educational game** that teaches online privacy and security concepts through the classic tower-building mechanics of Jenga. Each block contains valuable knowledge about protecting yourself online, making learning both fun and memorable.

## ✨ **Key Features**

### 🎮 **Gameplay Mechanics**
- **54-Block Tower System** - Complete Jenga experience with 18 layers
- **Dice-Based Access Control** - Roll to determine which layers you can access
- **Three Block Types:**
  - 🟢 **Safe Blocks** - Good privacy practices (+points, +stability)
  - 🔴 **Risky Blocks** - Bad practices (+points, -stability)  
  - 🟡 **Challenge Blocks** - Quiz questions (correct = bonus, wrong = penalty)

### 🎲 **Dice Mechanics**
- **Layer 1-3**: Safe Zone (Green) - Perfect for beginners
- **Layer 1-6**: Steady (Blue) - Balanced risk/reward
- **Layer 1-9**: Risky (Yellow) - Increased challenge
- **Layer 1-12**: Danger Zone (Orange) - High risk, high reward
- **Layer 1-15**: Extreme (Red) - Expert level challenges
- **All Layers**: Ultimate Challenge (Purple) - Maximum difficulty

### 📚 **Educational Content**
- **Progressive Learning** - Start with basics, advance to complex topics
- **Real-World Examples** - Practical privacy scenarios and solutions
- **Interactive Quizzes** - Test your knowledge with immediate feedback
- **Achievement System** - Unlock badges for learning milestones

### 🎯 **Game Modes**
- **Classic Mode** - Traditional gameplay until tower collapse
- **Endless Mode** - Continuous play with tower resets and high score tracking

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

### **5. Monitor Stability**
- Watch the tower stability indicator
- Green = Stable, Yellow = Warning, Red = Danger
- Game ends when tower becomes unstable

## 🏗️ **Architecture & Technology**

### **Frontend Stack**
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Three.js + React Three Fiber** - 3D graphics and tower visualization

### **Key Components**
- **`GameTutorial`** - Interactive 6-step tutorial system
- **`GameHelp`** - Comprehensive 4-tab help system
- **`JengaTower`** - Enhanced 3D tower with visual feedback
- **`GamePage`** - Main game interface with integrated features
- **`HomePage`** - Landing page with feature showcase

### **State Management**
- **React Hooks** - Local component state management
- **Mock Services** - In-memory game logic for frontend-only development
- **Local Storage** - Game progress and achievement persistence

## 🎨 **UI/UX Features**

### **BITSACCO Dark Theme**
- **Professional dark color scheme** throughout the application
- **Consistent visual language** with teal accents
- **Accessibility-focused** design with high contrast

### **Visual Enhancements**
- **Clear layer restrictions** with visual overlays
- **Block type legend** for easy identification
- **Tower stability indicator** with color-coded progress
- **Interactive instructions** panel
- **Enhanced 3D rendering** with better spacing

### **Responsive Design**
- **Mobile-first approach** for touch interactions
- **Responsive grid layouts** for all screen sizes
- **Touch-friendly controls** and navigation

## 📱 **User Experience Features**

### **First-Time User Experience**
- **Automatic tutorial** for new players
- **Welcome overlay** explaining game concepts
- **Progressive disclosure** of game mechanics

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
│   │   ├── GameTutorial.tsx # Interactive tutorial system
│   │   ├── GameHelp.tsx     # Comprehensive help system
│   │   ├── JengaTower.tsx   # 3D tower visualization
│   │   ├── GameStats.tsx    # Game statistics display
│   │   └── ...
│   ├── pages/               # Page components
│   ├── services/            # Game logic and mock services
│   ├── types/               # TypeScript type definitions
│   └── styles/              # Global styles and CSS
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

## 🙏 **Acknowledgments**

- **Privacy Education Community** - For inspiration and feedback
- **Open Source Contributors** - For the amazing tools and libraries
- **Game Development Community** - For educational game design insights

## 📞 **Support & Contact**

- **Issues**: [GitHub Issues](https://github.com/yourusername/privacy-jenga/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/privacy-jenga/discussions)
- **Email**: privacy-jenga@example.com

---

**🎯 Ready to master online privacy? [Start playing now!](https://yourusername.github.io/privacy-jenga/)**

*Built with ❤️ for privacy education • Powered by React & Three.js*
