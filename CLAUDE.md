# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Privacy Jenga is an interactive 3D Bitcoin privacy education game built with React, TypeScript, and Three.js. The game teaches Bitcoin privacy concepts through engaging Jenga tower mechanics with 54 educational blocks covering various privacy practices and risks.

## Development Commands

### Root Level Commands
```bash
# Start development server
npm run dev

# Build for production  
npm run build

# Build for GitHub Pages deployment
npm run build:pages

# Preview production build
npm run preview

# Run linting
npm run lint

# Run type checking
npm run type-check

# Run tests
npm run test

# Run E2E tests
npm run test:e2e

# Install all dependencies
npm run install:all

# Clean and reinstall
npm run clean
```

### Web App Specific Commands (from apps/web/)
```bash
# Development
npm run dev          # Vite dev server on port 5173
npm run build        # Production build with TypeScript compilation
npm run build:pages  # Build for GitHub Pages with /Privacy-Jenga/ base path

# Testing
npm run test         # Vitest unit tests
npm run test:ci      # CI mode tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
npm run test:e2e     # End-to-end tests

# Code Quality
npm run lint         # ESLint with TypeScript rules
npm run type-check   # TypeScript compiler check (no emit)
```

### API Service Commands (from services/api/)
```bash
npm run dev    # Development with ts-node
npm run build  # TypeScript compilation
npm run start  # Production server
```

## Architecture & Key Components

### Monorepo Structure
- **apps/web/** - React frontend application (main game)
- **services/api/** - Express API service (minimal usage)
- **Root level** - Shared configuration and orchestration scripts

### Frontend Architecture (apps/web/src/)

#### Core Game Components
- **`JengaTowerRefactored.tsx`** - Main 3D tower component using React Three Fiber
- **`BlockComponent.tsx`** - Individual Jenga block with physics and interactions
- **`TowerControls.tsx`** - Real-time game controls and stability monitoring
- **`GamePage.tsx`** - Main game interface with comprehensive state management

#### Custom Hooks (Specialized Logic)
- **`useTowerStability.ts`** - Calculates tower stability based on removed blocks
- **`useBlockSelection.ts`** - Manages block selection and highlighting
- **`useKeyboardNavigation.ts`** - Keyboard accessibility for block navigation
- **`usePerformanceMonitoring.tsx`** - FPS and memory usage monitoring
- **`useResponsiveDesign.ts`** - Mobile/tablet responsive design logic

#### Game Logic & Services
- **`mockGameService.ts`** - Singleton service managing game state, dice rolls, quiz system
- **`types/index.ts`** - Comprehensive TypeScript definitions for game entities

#### Pages & UI
- **`HomePage.tsx`** - Landing page with game overview and creator attribution
- **`GamePage.tsx`** - Main game interface (1100+ lines, handles all game logic)
- **`ContentModal.tsx`** - Educational content display with quiz functionality

### Technology Stack
- **React 18** with hooks and functional components
- **TypeScript 5.x** with strict mode enabled
- **Vite** for build tooling and dev server
- **Three.js + React Three Fiber** for 3D graphics and physics
- **Tailwind CSS** with custom BITSACCO design system
- **Vitest** for unit testing with jsdom environment
- **ESLint** with TypeScript and React rules

### Game Mechanics Implementation
- **Dice System**: Determines accessible tower layers (1-18)
- **Block Types**: Red (risky), Orange (moderate), Green (safe) with different point values
- **Quiz System**: Interactive questions with stability consequences
- **Continuous Learning**: Tower auto-resets on collapse for uninterrupted education
- **Synchronized State**: Real-time stability calculation across all UI components

## Build Configuration

### Vite Configuration
- **Base Path**: `/Privacy-Jenga/` for GitHub Pages deployment
- **Code Splitting**: Vendor and Three.js chunks for optimal loading
- **Path Aliases**: `@/` maps to `./src/`
- **Test Environment**: jsdom with comprehensive coverage reporting

### TypeScript Configuration
- **Strict Mode**: Enabled with unused variable/parameter checks
- **Target**: ES2020 with DOM libraries
- **Module Resolution**: Bundler mode for Vite compatibility

### Tailwind Configuration
- **Custom BITSACCO Theme**: Teal/cyan primary colors, professional dark theme
- **Custom Animations**: Fade, slide, bounce effects for game interactions
- **Responsive Design**: Mobile-first approach with touch-friendly controls

## Testing Strategy

- **Unit Tests**: Vitest with React Testing Library for component testing
- **E2E Tests**: Located in `src/__tests__/e2e/` for full game flow testing
- **Coverage**: V8 provider with HTML/JSON reporting
- **Custom Hooks Testing**: Dedicated tests for game logic hooks

## Development Notes

### Mobile Responsiveness
- Comprehensive mobile controls in `MobileControls.tsx`
- Touch gesture support via `useTouchGestures.ts`
- Responsive design hooks for layout adaptation

### Performance Monitoring
- Development mode includes FPS/memory monitoring
- Performance hooks track render efficiency
- Code splitting optimizes bundle loading

### Educational Content
- 54 authentic Bitcoin privacy concepts from bitcoinjenga.com
- 7 categories: On-Chain, Off-Chain, Coin Mixing, Wallet Setup, Lightning, Regulatory, Best Practices
- Risk-based color coding system for visual learning

### State Management
- React hooks with useCallback/useMemo optimization
- Singleton MockGameService for consistent game state
- Real-time synchronization between UI components

## Deployment

- **GitHub Pages**: Automated deployment via GitHub Actions
- **Production Build**: Optimized with sourcemaps and manual chunking
- **Environment Variables**: `VITE_APP_TITLE` for build-specific titles