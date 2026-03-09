import { render, screen } from '@testing-library/react';
import { MysticalHeading, MysticalBodyText, MysticalScriptText } from '../typography';

describe('Mystical Typography Components', () => {
  describe('MysticalHeading', () => {
    it('should render with Libre Baskerville and turquoise', () => {
      render(<MysticalHeading>Crystal Collection</MysticalHeading>);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveStyle({ fontFamily: "'Libre Baskerville', serif" });
      expect(heading).toHaveStyle({ color: '#4abfbf' });
    });

    it('should use brand color for sm headings (18px meets WCAG AA)', () => {
      render(<MysticalHeading size="sm">Small Heading</MysticalHeading>);
      const heading = screen.getByRole('heading', { level: 2 });
      // 18px is large enough for brand color under WCAG AA
      expect(heading).toHaveStyle({ color: '#4abfbf' });
    });

    it('should render different heading levels', () => {
      const { container: h1 } = render(<MysticalHeading level={1}>H1</MysticalHeading>);
      const { container: h3 } = render(<MysticalHeading level={3}>H3</MysticalHeading>);

      expect(h1.querySelector('h1')).toBeInTheDocument();
      expect(h3.querySelector('h3')).toBeInTheDocument();
    });

    it('should support custom className', () => {
      render(<MysticalHeading className="custom-class">Test</MysticalHeading>);
      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveClass('custom-class');
    });
  });

  describe('MysticalBodyText', () => {
    it('should render with Montserrat and theme color', () => {
      render(<MysticalBodyText>Body text content</MysticalBodyText>);
      const text = screen.getByText('Body text content');
      expect(text).toHaveStyle({ fontFamily: "'Montserrat', sans-serif" });
      expect(text).toHaveStyle({ color: 'hsl(var(--text-primary))' });
    });

    it('should support different sizes', () => {
      const { container: lg } = render(<MysticalBodyText size="lg">Large</MysticalBodyText>);
      const { container: sm } = render(<MysticalBodyText size="sm">Small</MysticalBodyText>);

      expect(lg.querySelector('p')).toHaveStyle({ fontSize: '1.125rem' });
      expect(sm.querySelector('p')).toHaveStyle({ fontSize: '0.875rem' });
    });

    it('should support custom className', () => {
      render(<MysticalBodyText className="custom-class">Test</MysticalBodyText>);
      const text = screen.getByText('Test');
      expect(text.tagName).toBe('P');
      expect(text).toHaveClass('custom-class');
    });
  });

  describe('MysticalScriptText', () => {
    it('should render with Alex Brush and gold', () => {
      render(<MysticalScriptText>Coves</MysticalScriptText>);
      const text = screen.getByText('Coves');
      expect(text).toHaveStyle({ fontFamily: "'Alex Brush', cursive" });
      expect(text).toHaveStyle({ color: '#e1af2f' });
    });

    it('should use WCAG compliant color for small text', () => {
      render(<MysticalScriptText size="sm">Small Script</MysticalScriptText>);
      const text = screen.getByText('Small Script');
      expect(text).toHaveStyle({ color: 'hsl(38 80% 35%)' });
    });

    it('should support different sizes', () => {
      const { container: xl } = render(<MysticalScriptText size="xl">Extra Large</MysticalScriptText>);
      const { container: sm } = render(<MysticalScriptText size="sm">Small</MysticalScriptText>);

      expect(sm.firstChild).toHaveStyle({ fontSize: '1rem' });
      expect(xl.firstChild).toHaveStyle({ fontSize: '3rem' });
    });

    it('should support custom className', () => {
      render(<MysticalScriptText className="custom-class">Test</MysticalScriptText>);
      const text = screen.getByText('Test');
      expect(text).toHaveClass('custom-class');
    });
  });
});
