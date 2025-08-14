# Privacy Jenga - Refined Game Mechanics Specification
## Senior Software & Game Developer Engineering Analysis

### 🎯 **Core Game Flow Overview**

```
1. DICE ROLL → Mix block colors + Unlock layers
2. BLOCK SELECTION → Player chooses from available blocks  
3. QUIZ CHALLENGE → Answer privacy question
4. STABILITY IMPACT → Correct/Incorrect answer affects tower
5. WIN/LOSE CONDITIONS → Based on accuracy vs stability ratio
6. TOWER REGENERATION → On collapse, restart with lessons learned
```

---

## 🎲 **DICE ROLLING MECHANICS** 

### **Current Issue Identified:**
- Dice animation is interfering with block color rendering
- Block color mixing should be **visual feedback**, not rendering conflict

### **Refined Implementation:**

```typescript
// ✅ CORRECT: Dice roll should trigger color remix animation
const handleDiceRoll = async () => {
  // 1. Show dice rolling animation (1.5s)
  setDiceRollAnimation(true);
  
  // 2. SIMULTANEOUSLY mix block colors with smooth transition
  await animateBlockColorMixing(); // New function needed
  
  // 3. Calculate available layers (unchanged)
  const result = await gameService.rollDice();
  
  // 4. Update UI with new color distribution
  setBlocks(result.mixedBlocks);
  setDiceRollAnimation(false);
};

// 🌈 New: Visual block color mixing animation
const animateBlockColorMixing = async () => {
  // Smoothly transition block colors over 1.2s
  // Show "mixing" particle effects
  // Update block types without breaking render cycle
};
```

---

## ❌ **WRONG ANSWER CONSEQUENCES**

### **Current Implementation Analysis:**
```typescript
// ✅ GOOD: Basic stability reduction exists
if (!isCorrect) {
  stabilityChange = -8; // Reduces stability by 8%
  this.gameState.incorrectAnswers++;
}

// ❌ NEEDS IMPROVEMENT: More sophisticated penalty system needed
```

### **Enhanced Wrong Answer System:**

```typescript
// 🔴 PROGRESSIVE PENALTY SYSTEM
const calculateWrongAnswerPenalty = (consecutiveWrongs: number, blockType: string) => {
  let basePenalty = -8;
  
  // Progressive penalties for consecutive wrong answers
  const consecutiveMultiplier = Math.min(consecutiveWrongs * 1.5, 4.0);
  
  // Block type affects penalty severity
  const typeMultiplier = {
    'safe': 1.0,      // -8% stability loss
    'risky': 1.5,     // -12% stability loss  
    'challenge': 2.0  // -16% stability loss
  }[blockType];
  
  return basePenalty * consecutiveMultiplier * typeMultiplier;
};

// 📊 STABILITY REDEMPTION SYSTEM
const calculateCorrectAnswerBonus = (consecutiveCorrect: number, currentStability: number) => {
  let baseBonus = +12; // Base stability gain
  
  // Bonus for consecutive correct answers
  const streakBonus = Math.min(consecutiveCorrect * 2, 10);
  
  // Reduced bonus when stability is already high (diminishing returns)
  const stabilityFactor = currentStability < 50 ? 1.5 : 0.8;
  
  return (baseBonus + streakBonus) * stabilityFactor;
};
```

---

## 🏗️ **TOWER STABILITY & COLLAPSE MECHANICS**

### **Enhanced Stability Calculation:**

```typescript
// 🎯 COMPREHENSIVE STABILITY FACTORS
const calculateTowerStability = () => {
  const baseStability = 100;
  
  // 1. Removed blocks factor (physical instability)
  const removedBlocksPenalty = blocksRemoved * 3;
  
  // 2. Quiz accuracy factor (knowledge stability)
  const accuracyRatio = correctAnswers / (correctAnswers + incorrectAnswers);
  const knowledgeBonus = accuracyRatio > 0.7 ? 10 : 0;
  
  // 3. Consecutive wrong answers (confidence penalty)
  const confidencePenalty = consecutiveWrongAnswers * 5;
  
  // 4. Block type distribution (risk management)
  const riskFactors = calculateRiskDistribution();
  
  return Math.max(0, Math.min(100, 
    baseStability 
    - removedBlocksPenalty 
    - confidencePenalty 
    + knowledgeBonus 
    - riskFactors
  ));
};
```

### **Collapse Conditions:**
```typescript
// 💥 TOWER COLLAPSE TRIGGERS
const checkCollapseConditions = () => {
  // 1. Critical stability threshold
  if (towerStability <= 15) return 'STABILITY_COLLAPSE';
  
  // 2. Accuracy threshold breach
  const accuracyRate = correctAnswers / totalAnswers;
  if (totalAnswers >= 10 && accuracyRate < 0.3) return 'KNOWLEDGE_COLLAPSE';
  
  // 3. Consecutive failures
  if (consecutiveWrongAnswers >= 5) return 'CONFIDENCE_COLLAPSE';
  
  return 'STABLE';
};
```

---

## 🎉 **WIN CONDITIONS & GAME COMPLETION**

### **Victory Requirements:**
```typescript
// 🏆 ENHANCED WIN CONDITIONS
const checkVictoryConditions = () => {
  const totalBlocks = 54;
  const answeredBlocks = correctAnswers + incorrectAnswers;
  const accuracyRate = correctAnswers / answeredBlocks;
  
  // 1. KNOWLEDGE MASTERY: Answer all blocks with 70%+ accuracy
  if (answeredBlocks >= totalBlocks && accuracyRate >= 0.7) {
    return {
      victory: true,
      type: 'KNOWLEDGE_MASTER',
      grade: getAccuracyGrade(accuracyRate),
      bonus: calculateMasteryBonus(accuracyRate, towerStability)
    };
  }
  
  // 2. EFFICIENCY VICTORY: High accuracy with tower intact
  if (accuracyRate >= 0.9 && towerStability >= 80 && answeredBlocks >= 30) {
    return {
      victory: true,
      type: 'EFFICIENCY_EXPERT',
      grade: 'A+',
      bonus: 'PERFECT_PRIVACY_CHAMPION'
    };
  }
  
  return { victory: false };
};

// 📊 GRADING SYSTEM
const getAccuracyGrade = (accuracy: number) => {
  if (accuracy >= 0.95) return 'A+';
  if (accuracy >= 0.90) return 'A';
  if (accuracy >= 0.85) return 'B+';
  if (accuracy >= 0.80) return 'B';
  if (accuracy >= 0.70) return 'C+';
  return 'C';
};
```

---

## 🔄 **TOWER REGENERATION SYSTEM**

### **Smart Regeneration Logic:**
```typescript
// 🏗️ ENHANCED TOWER REGENERATION
const regenerateTower = async (collapseReason: string) => {
  // 1. Preserve learning progress
  const learningStats = {
    previousAccuracy: correctAnswers / (correctAnswers + incorrectAnswers),
    weakCategories: identifyWeakCategories(),
    strongCategories: identifyStrongCategories(),
    attemptNumber: gameAttempts + 1
  };
  
  // 2. Adaptive difficulty adjustment
  const newDifficulty = calculateAdaptiveDifficulty(learningStats);
  
  // 3. Reset tower with lessons learned
  await resetTowerWithAdaptation({
    difficulty: newDifficulty,
    focusAreas: learningStats.weakCategories,
    encouragement: generateEncouragementMessage(collapseReason),
    progressRetention: retainCategoryProgress()
  });
  
  // 4. Show regeneration feedback
  showRegenerationDialog({
    reason: collapseReason,
    improvements: suggestImprovements(learningStats),
    newFocus: learningStats.weakCategories
  });
};
```

---

## 🎮 **IMPLEMENTATION PRIORITY FIXES**

### **1. Immediate Dice Animation Fix:**
```typescript
// 🚨 CRITICAL: Fix dice roll color mixing interference
// Location: apps/web/src/pages/GamePage.tsx:275-300

// ISSUE: setBlocks() during animation causes render conflicts
// SOLUTION: Separate animation state from block state updates
```

### **2. Enhanced Stability System:**
```typescript
// 📊 PRIORITY: Implement progressive penalty system
// Location: apps/web/src/services/mockGameService.ts:380-450

// ADD: Consecutive wrong answer tracking
// ADD: Progressive penalty calculation
// ADD: Stability redemption bonuses
```

### **3. Victory Condition Refinement:**
```typescript
// 🏆 ENHANCEMENT: Multi-path victory conditions  
// Location: apps/web/src/services/mockGameService.ts:440-450

// ADD: Efficiency victory path
// ADD: Grading system
// ADD: Performance-based achievements
```

---

## 🔧 **TECHNICAL ARCHITECTURE NOTES**

### **State Management:**
- **Dice Animation State**: Separate from block color state
- **Stability Calculation**: Real-time with debounced updates
- **Quiz Progress**: Persistent across regenerations
- **Learning Analytics**: Track improvement patterns

### **Performance Considerations:**
- **Block Color Transitions**: Use CSS transforms, not re-renders
- **Stability Updates**: Batch calculations to avoid UI lag
- **Animation Timing**: Coordinate dice roll with color mixing
- **Memory Management**: Clean up Three.js resources on regeneration

---

## 📈 **SUCCESS METRICS**

1. **Educational Effectiveness**: 70%+ accuracy rate achievement
2. **Engagement Retention**: Tower regeneration acceptance rate
3. **Knowledge Retention**: Cross-session improvement tracking
4. **Gameplay Balance**: Average completion time vs difficulty
5. **User Satisfaction**: Feedback on challenge progression

---

**This specification provides a comprehensive framework for implementing sophisticated, educational gameplay mechanics while maintaining technical performance and user engagement.**
