import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { screen, fireEvent } from '@testing-library/dom';
import { DndContext } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import WidgetWrapper from '@/components/widgets/WidgetWrapper';
import type { Widget } from '@/components/widgets/WidgetTypes';

const widget: Widget = {
  id: 'w1',
  type: 'strategic-goals',
  title: 'Strategic Goals',
  size: 'medium',
  position: 0,
};

const renderWithDnd = (onRemove = vi.fn(), onResize = vi.fn()) =>
  render(
    <DndContext>
      <SortableContext items={[widget.id]}>
        <WidgetWrapper widget={widget} onRemove={onRemove} onResize={onResize} />
      </SortableContext>
    </DndContext>
  );

describe('WidgetWrapper', () => {
  it('renders widget title inside sortable context', () => {
    renderWithDnd();
    expect(screen.getByText('Strategic Goals')).toBeInTheDocument();
  });

  it('calls onRemove when close button is clicked', () => {
    const onRemove = vi.fn();
    renderWithDnd(onRemove);
    const buttons = screen.getAllByRole('button');
    // Last button is the remove (X) button
    fireEvent.click(buttons[buttons.length - 1]);
    expect(onRemove).toHaveBeenCalledWith('w1');
  });

  it('calls onResize when resize button is clicked, cycling size', () => {
    const onResize = vi.fn();
    renderWithDnd(vi.fn(), onResize);
    const buttons = screen.getAllByRole('button');
    // Resize button is the second-to-last (remove is last)
    fireEvent.click(buttons[buttons.length - 2]);
    // medium -> large
    expect(onResize).toHaveBeenCalledWith('w1', 'large');
  });
});
