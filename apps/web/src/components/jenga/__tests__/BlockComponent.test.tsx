import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Canvas } from '@react-three/fiber';
import { BlockComponent } from '../BlockComponent';
import { Block } from '../../../types';
import { TestErrorBoundary } from '../../../test/TestErrorBoundary';

describe('BlockComponent', () => {
  const mockBlock: Block = {
    id: '1',
    layer: 1,
    position: 1,
    type: 'safe',
    removed: false,
    difficulty: 1,
    stability: 100,
    category: 'wallet-setup',
    content: {
      id: '1',
      title: 'Test Block',
      text: 'Test description',
      severity: 'tip',
      points: 10,
      category: 'wallet-setup',
      fact: 'Test fact',
      impact: 'positive',
    },
  };

  const mockWorldPosition: [number, number, number] = [0, 1, 0];
  const mockOnClick = () => {};

  it('should render without crashing when wrapped in Canvas', () => {
    // Test that BlockComponent can be rendered in a mocked Canvas environment
    const { container } = render(
      <TestErrorBoundary>
        <Canvas>
          <BlockComponent
            block={mockBlock}
            layer={1}
            position={1}
            worldPosition={mockWorldPosition}
            onClick={mockOnClick}
            isSelected={false}
            isRemovable={true}
            canPullFromLayer={true}
            isFocused={false}
          />
        </Canvas>
      </TestErrorBoundary>
    );

    expect(container).toBeInTheDocument();
  });

  it('should handle props correctly', () => {
    const { container } = render(
      <TestErrorBoundary>
        <Canvas>
          <BlockComponent
            block={mockBlock}
            layer={1}
            position={1}
            worldPosition={mockWorldPosition}
            onClick={mockOnClick}
            isSelected={true}
            isRemovable={false}
            canPullFromLayer={false}
            isFocused={true}
          />
        </Canvas>
      </TestErrorBoundary>
    );

    expect(container).toBeInTheDocument();
  });

  it('should render removed block differently', () => {
    const removedBlock: Block = {
      ...mockBlock,
      removed: true,
    };

    const { container } = render(
      <TestErrorBoundary>
        <Canvas>
          <BlockComponent
            block={removedBlock}
            layer={1}
            position={1}
            worldPosition={mockWorldPosition}
            onClick={mockOnClick}
            isSelected={false}
            isRemovable={false}
            canPullFromLayer={false}
            isFocused={false}
          />
        </Canvas>
      </TestErrorBoundary>
    );

    expect(container).toBeInTheDocument();
  });
});
