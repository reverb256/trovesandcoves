import React from 'react';
import { render, screen } from '@testing-library/react';
import { MysticalCard, CardContent } from '../card';

describe('MysticalCard', () => {
  it('should render with mystical gradient background', () => {
    render(
      <MysticalCard>
        <div>Card content</div>
      </MysticalCard>
    );
    const card = screen.getByText('Card content');
    expect(card.parentElement).toHaveStyle({
      background: 'linear-gradient(135deg, hsl(var(--bg-card)) 0%, hsl(var(--bg-secondary)) 100%)'
    });
  });

  it('should render with turquoise border when variant is accent', () => {
    render(
      <MysticalCard variant="accent">
        <div>Card content</div>
      </MysticalCard>
    );
    const card = screen.getByText('Card content');
    expect(card.parentElement).toHaveStyle({
      border: '1px solid hsla(174, 85%, 45%, 0.3)'
    });
  });

  it('should render glass morphism effect when variant is glass', () => {
    render(
      <MysticalCard variant="glass">
        <div>Card content</div>
      </MysticalCard>
    );
    const card = screen.getByText('Card content');
    // Glass variant has shadow-lg and backdrop-blur-sm classes
    expect(card.parentElement).toHaveClass('shadow-lg');
    expect(card.parentElement).toHaveClass('backdrop-blur-sm');
  });

  it('should support custom className', () => {
    render(
      <MysticalCard className="custom-class">
        <div>Card content</div>
      </MysticalCard>
    );
    const card = screen.getByText('Card content');
    expect(card.parentElement).toHaveClass('custom-class');
  });

  it('should support custom styles', () => {
    render(
      <MysticalCard style={{ padding: '20px' }}>
        <div>Card content</div>
      </MysticalCard>
    );
    const card = screen.getByText('Card content');
    expect(card.parentElement).toHaveStyle({ padding: '20px' });
  });

  it('should support elevated variant', () => {
    render(
      <MysticalCard variant="elevated">
        <div>Card content</div>
      </MysticalCard>
    );
    const card = screen.getByText('Card content');
    expect(card.parentElement).toHaveClass('shadow-2xl');
  });

  it('should support interactive variant', () => {
    render(
      <MysticalCard variant="interactive">
        <div>Card content</div>
      </MysticalCard>
    );
    const card = screen.getByText('Card content');
    expect(card.parentElement).toHaveClass('group-hover:scale-105');
  });

  it('should work with CardContent', () => {
    render(
      <MysticalCard>
        <CardContent>
          <div>Content inside CardContent</div>
        </CardContent>
      </MysticalCard>
    );
    expect(screen.getByText('Content inside CardContent')).toBeInTheDocument();
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <MysticalCard ref={ref}>
        <div>Card content</div>
      </MysticalCard>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
