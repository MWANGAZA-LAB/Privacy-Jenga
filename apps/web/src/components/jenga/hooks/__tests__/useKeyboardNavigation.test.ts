 import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useKeyboardNavigation } from '../useKeyboardNavigation';
import { Block } from '../../../../types';

// Mock document.addEventListener and removeEventListener
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

Object.defineProperty(document, 'addEventListener', {
  value: mockAddEventListener,
  writable: true,
});

Object.defineProperty(document, 'removeEventListener', {
  value: mockRemoveEventListener,
  writable: true,
});

describe('useKeyboardNavigation', () => {
  // Helper function to create keyboard events with proper target
  const createKeyboardEvent = (key: string): KeyboardEvent => {
    const event = new KeyboardEvent('keydown', { key });
    Object.defineProperty(event, 'target', {
      value: document.body,
      configurable: true
    });
    return event;
  };

  const mockAccessibleBlocks: Block[] = [
    {
      id: '1',
      layer: 1,
      position: 1,
      type: 'safe',
      removed: false,
      difficulty: 1,
      stability: 0.9,
      category: 'on-chain-privacy',
      content: {
        id: '1',
        title: 'Block 1',
        text: 'Block 1 description',
        severity: 'tip',
        points: 10,
        category: 'on-chain-privacy',
        fact: 'Test fact 1',
        impact: 'positive'
      },
    },
    {
      id: '2',
      layer: 1,
      position: 2,
      type: 'risky',
      removed: false,
      difficulty: 1,
      stability: 0.8,
      category: 'wallet-setup',
      content: {
        id: '2',
        title: 'Block 2',
        text: 'Block 2 description',
        severity: 'warning',
        points: 20,
        category: 'wallet-setup',
        fact: 'Test fact 2',
        impact: 'neutral'
      },
    },
    {
      id: '3',
      layer: 1,
      position: 3,
      type: 'challenge',
      removed: false,
      difficulty: 1,
      stability: 0.7,
      category: 'coin-mixing',
      content: {
        id: '3',
        title: 'Block 3',
        text: 'Block 3 description',
        severity: 'critical',
        points: 15,
        category: 'coin-mixing',
        fact: 'Test fact 3',
        impact: 'neutral'
      },
    },
  ];

  const mockOnBlockSelect = vi.fn();
  const mockOnFocusChange = vi.fn();

  beforeEach(() => {
    // Clear all mock call histories but preserve implementations
    mockAddEventListener.mockClear();
    mockRemoveEventListener.mockClear();
    mockOnBlockSelect.mockClear();
    mockOnFocusChange.mockClear();
    
    // Re-ensure document mocks are in place
    Object.defineProperty(document, 'addEventListener', {
      value: mockAddEventListener,
      writable: true,
    });
    Object.defineProperty(document, 'removeEventListener', {
      value: mockRemoveEventListener,
      writable: true,
    });
  });

  afterEach(() => {
    // Don't restore all mocks as it breaks our document mocks
    mockOnBlockSelect.mockClear();
    mockOnFocusChange.mockClear();
  });

  it('sets up keyboard event listeners when enabled', () => {
    renderHook(() =>
      useKeyboardNavigation({
        accessibleBlocks: mockAccessibleBlocks,
        focusedBlockId: null,
        selectedBlockId: null,
        onBlockSelect: mockOnBlockSelect,
        onFocusChange: mockOnFocusChange,
        isEnabled: true,
      })
    );

    expect(mockAddEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('does not set up event listeners when disabled', () => {
    renderHook(() =>
      useKeyboardNavigation({
        accessibleBlocks: mockAccessibleBlocks,
        focusedBlockId: null,
        selectedBlockId: null,
        onBlockSelect: mockOnBlockSelect,
        onFocusChange: mockOnFocusChange,
        isEnabled: false,
      })
    );

    expect(mockAddEventListener).not.toHaveBeenCalled();
  });

  it('removes event listeners on cleanup', () => {
    const { unmount } = renderHook(() =>
      useKeyboardNavigation({
        accessibleBlocks: mockAccessibleBlocks,
        focusedBlockId: null,
        selectedBlockId: null,
        onBlockSelect: mockOnBlockSelect,
        onFocusChange: mockOnFocusChange,
        isEnabled: true,
      })
    );

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith('keydown', expect.any(Function));
  });

  it('handles arrow key navigation correctly', () => {
    let keydownHandler: (event: KeyboardEvent) => void;

    mockAddEventListener.mockImplementation((event, handler) => {
      if (event === 'keydown') {
        keydownHandler = handler;
      }
    });

    renderHook(() =>
      useKeyboardNavigation({
        accessibleBlocks: mockAccessibleBlocks,
        focusedBlockId: '1',
        selectedBlockId: null,
        onBlockSelect: mockOnBlockSelect,
        onFocusChange: mockOnFocusChange,
        isEnabled: true,
      })
    );

    // Simulate right arrow key press with proper target
    const rightArrowEvent = createKeyboardEvent('ArrowRight');
    act(() => {
      keydownHandler!(rightArrowEvent);
    });

    expect(mockOnFocusChange).toHaveBeenCalledWith('2');
  });

  it('handles Enter key for block selection', () => {
    let keydownHandler: (event: KeyboardEvent) => void;

    mockAddEventListener.mockImplementation((event, handler) => {
      if (event === 'keydown') {
        keydownHandler = handler;
      }
    });

    renderHook(() =>
      useKeyboardNavigation({
        accessibleBlocks: mockAccessibleBlocks,
        focusedBlockId: '1',
        selectedBlockId: null,
        onBlockSelect: mockOnBlockSelect,
        onFocusChange: mockOnFocusChange,
        isEnabled: true,
      })
    );

    // Simulate Enter key press
    const enterEvent = createKeyboardEvent('Enter');
    act(() => {
      keydownHandler!(enterEvent);
    });

    expect(mockOnBlockSelect).toHaveBeenCalledWith('1');
  });

  it('handles Space key for block selection', () => {
    let keydownHandler: (event: KeyboardEvent) => void;

    mockAddEventListener.mockImplementation((event, handler) => {
      if (event === 'keydown') {
        keydownHandler = handler;
      }
    });

    renderHook(() =>
      useKeyboardNavigation({
        accessibleBlocks: mockAccessibleBlocks,
        focusedBlockId: '2',
        selectedBlockId: null,
        onBlockSelect: mockOnBlockSelect,
        onFocusChange: mockOnFocusChange,
        isEnabled: true,
      })
    );

    // Simulate Space key press
    const spaceEvent = createKeyboardEvent(' ');
    act(() => {
      keydownHandler!(spaceEvent);
    });

    expect(mockOnBlockSelect).toHaveBeenCalledWith('2');
  });

  it('wraps around when navigating past boundaries', () => {
    let keydownHandler: (event: KeyboardEvent) => void;

    mockAddEventListener.mockImplementation((event, handler) => {
      if (event === 'keydown') {
        keydownHandler = handler;
      }
    });

    renderHook(() =>
      useKeyboardNavigation({
        accessibleBlocks: mockAccessibleBlocks,
        focusedBlockId: '3', // Last block
        selectedBlockId: null,
        onBlockSelect: mockOnBlockSelect,
        onFocusChange: mockOnFocusChange,
        isEnabled: true,
      })
    );

    // Simulate right arrow key press (should wrap to first block)
    const rightArrowEvent = createKeyboardEvent('ArrowRight');
    act(() => {
      keydownHandler!(rightArrowEvent);
    });

    expect(mockOnFocusChange).toHaveBeenCalledWith('1');
  });

  it('handles empty accessible blocks array', () => {
    let keydownHandler: (event: KeyboardEvent) => void;

    mockAddEventListener.mockImplementation((event, handler) => {
      if (event === 'keydown') {
        keydownHandler = handler;
      }
    });

    renderHook(() =>
      useKeyboardNavigation({
        accessibleBlocks: [],
        focusedBlockId: null,
        selectedBlockId: null,
        onBlockSelect: mockOnBlockSelect,
        onFocusChange: mockOnFocusChange,
        isEnabled: true,
      })
    );

    // Simulate arrow key press with no blocks
    const rightArrowEvent = createKeyboardEvent('ArrowRight');
    act(() => {
      keydownHandler!(rightArrowEvent);
    });

    // Should not call any handlers
    expect(mockOnFocusChange).not.toHaveBeenCalled();
    expect(mockOnBlockSelect).not.toHaveBeenCalled();
  });

  it('updates event listener when dependencies change', () => {
    const { rerender } = renderHook(
      ({ accessibleBlocks }) =>
        useKeyboardNavigation({
          accessibleBlocks,
          focusedBlockId: null,
          selectedBlockId: null,
          onBlockSelect: mockOnBlockSelect,
          onFocusChange: mockOnFocusChange,
          isEnabled: true,
        }),
      {
        initialProps: { accessibleBlocks: mockAccessibleBlocks },
      }
    );

    const initialCallCount = mockAddEventListener.mock.calls.length;

    // Change accessible blocks
    rerender({ accessibleBlocks: [mockAccessibleBlocks[0]] });

    // Should have added new event listener
    expect(mockAddEventListener.mock.calls.length).toBeGreaterThan(initialCallCount);
  });
});
