# RBC MIDaP Style Guide

## 1. Color Palette

### Primary Colors

- Primary Blue: `#005A9C`
  - Use for primary actions, headers, and key UI elements
- Secondary Green: `#00A651`
  - Use for secondary actions, success states, and accents

### Accent Colors

- Accent Gold: `#FDB913`
  - Use sparingly for highlights and call-to-action elements

### Neutral Colors

- Text Color (Dark Gray): `#333333`
- Background Color (Light Gray): `#F5F5F5`
- White: `#FFFFFF`

### Functional Colors

- Error Red: `#D32F2F`
- Success Green: `#4CAF50`

## 2. Typography

### Font Family

- Primary Font: Roboto
- Fallback: Sans-serif

### Font Sizes

- Heading 1: 32px (2rem)
- Heading 2: 28px (1.75rem)
- Heading 3: 24px (1.5rem)
- Heading 4: 20px (1.25rem)
- Body Text (Large): 18px (1.125rem)
- Body Text (Regular): 16px (1rem)
- Body Text (Small): 14px (0.875rem)

### Font Weights

- Regular: 400
- Medium: 500
- Bold: 700

### Line Heights

- Headings: 1.2
- Body Text: 1.5

## 3. Layout

### Grid System

- 12-column grid for flexibility

### Spacing

- Base unit: 8px
- Margins:
  - Desktop: 24px
  - Mobile: 16px
- Padding: 16px (consistent across components)

### Breakpoints

- Mobile: up to 640px
- Tablet: 641px to 1024px
- Desktop: 1025px and above

## 4. Components

### Buttons

- Primary Button:
  - Background: Primary Blue (`#005A9C`)
  - Text: White
  - Hover: Darken background by 10%
- Secondary Button:
  - Background: Secondary Green (`#00A651`)
  - Text: White
  - Hover: Darken background by 10%
- Tertiary/Outline Button:
  - Background: White
  - Border: Primary Blue (`#005A9C`)
  - Text: Primary Blue (`#005A9C`)
  - Hover: Light blue background

### Form Elements

- Input Fields:
  - Border: 1px solid `#CCCCCC`
  - Border Radius: 4px
  - Padding: 8px 12px
  - Focus: 2px solid Primary Blue (`#005A9C`)
- Labels:
  - Position: Above input fields
  - Font Weight: Medium (500)
- Dropdowns:
  - Styling consistent with input fields
  - Chevron icon for indication

### Cards

- Background: White
- Border Radius: 8px
- Box Shadow: 0 2px 4px rgba(0, 0, 0, 0.1)
- Padding: 16px

### Tables

- Header Background: Light Gray (`#F5F5F5`)
- Alternating Row Colors:
  - Even Rows: White
  - Odd Rows: Very Light Gray (`#FAFAFA`)
- Border: 1px solid `#EEEEEE`

### Modals

- Overlay Background: rgba(0, 0, 0, 0.5)
- Modal Background: White
- Border Radius: 8px
- Box Shadow: 0 4px 6px rgba(0, 0, 0, 0.1)

### Alerts and Notifications

- Success: Green (`#4CAF50`)
- Error: Red (`#D32F2F`)
- Warning: Orange (`#FF9800`)
- Info: Blue (`#2196F3`)
- Border Radius: 4px
- Icon: Left-aligned

## 5. Icons

- Use Material Design Icons for consistency
- Size: 24px x 24px (adjust for specific use cases)
- Color: Inherit from text color or specific functional color

## 6. Images

- Use high-quality, professional medical imagery
- Maintain aspect ratios
- Alt text: Provide descriptive alt text for accessibility

## 7. Accessibility

- Ensure color contrast ratio of at least 4.5:1 for normal text
- Use ARIA labels for non-text elements
- Ensure keyboard navigation functionality

## 8. Responsive Design

- Use flexible grids and images
- Adjust layout and component sizes based on breakpoints
- Ensure touch targets are at least 44x44 pixels on mobile

## 9. Animation and Transitions

- Use subtle animations for state changes (e.g., hover effects)
- Keep transitions short (200-300ms) and smooth
- Avoid animations that could cause discomfort or seizures

This style guide provides a comprehensive framework for maintaining consistency in the design and development of the RBC MIDaP application. It covers key aspects of visual design, layout, and user interface components, ensuring a cohesive and professional look across the entire application.
