---
name: ATLWEB Redesign
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#705a4d'
  on-secondary: '#ffffff'
  secondary-container: '#f8dac9'
  on-secondary-container: '#755e51'
  tertiary: '#46566c'
  on-tertiary: '#ffffff'
  tertiary-container: '#5e6e85'
  on-tertiary-container: '#e9f0ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#fbdccc'
  secondary-fixed-dim: '#dec1b1'
  on-secondary-fixed: '#28180e'
  on-secondary-fixed-variant: '#574236'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Lexend
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Lexend
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Lexend
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Lexend
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
  code-sm:
    fontFamily: monospace
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-page: 40px
  section-gap: 80px
  container-max: 1280px
---

## Brand & Style

The design system for this educational platform is built on the pillars of clarity, focus, and intellectual momentum. The brand personality is that of an expert mentor—highly professional and technically proficient, yet warm and encouraging. It targets aspiring developers who need a structured environment that minimizes cognitive load while maximizing engagement.

The visual style follows a **Corporate / Modern** aesthetic with subtle **Minimalist** influences. It prioritizes content hierarchy and functional interactivity over decorative flourish. The interface feels light and expansive, utilizing generous whitespace to separate complex technical concepts, while interactive elements respond with tactile precision to reinforce a sense of progress.

## Colors

The palette is anchored by a high-energy Primary Blue (`#2563EB`), chosen to symbolize logic, reliability, and the digital nature of web programming. This is balanced by a Secondary Warm Sand (`#D9BCAC`), which softens the technical edge of the platform, making the learning experience feel more approachable and less intimidating.

Neutral tones are pulled from a Deep Slate (`#0F172A`) for maximum text legibility and a sense of authority, while the background utilizes a clean Off-White (`#F8F9FA`) to reduce eye strain during long coding sessions. Functional accents use the Tertiary Gray (`#64748B`) for metadata and secondary information, ensuring the primary path remains visually dominant.

## Typography

This design system utilizes **Lexend** for headlines and UI labels. Lexend was specifically designed to improve reading proficiency, making it the ideal choice for an educational platform where information absorption is the primary goal. Its geometric yet open character provides an optimistic and modern feel.

For body text and dense instructional content, **Inter** is employed. Inter's exceptional legibility at small sizes and neutral tone ensures that the student can focus on the technical details of the curriculum without distraction. A monospaced font is reserved for code snippets, ensuring clear differentiation between instructional prose and executable syntax.

## Layout & Spacing

The layout utilizes a **fixed grid** model for primary content blocks to ensure a focused, readable line length for educational material, transitioning to a fluid behavior for responsive breakpoints. A 12-column grid provides the structural foundation, with 24px gutters to allow the UI to breathe.

The spacing rhythm is based on a 4px baseline grid. Section gaps are kept wide (80px) to distinguish between different modules of a course, while internal card padding is tightened to maintain a cohesive relationship between related pieces of information.

## Elevation & Depth

This design system conveys hierarchy through **tonal layers** and **ambient shadows**. Surfaces are stacked logically: the primary background is the lowest level, with content "cards" sitting slightly above using a very soft, diffused shadow (10% opacity of the Neutral color) to indicate interactivity.

Depth is also used to signify state. Interactive elements like buttons or lesson cards may transition from a flat state to a slightly elevated state on hover. High-contrast outlines are used for code editors and input fields to ground them within the page, creating a "workspace" feel that is distinct from the surrounding educational content.

## Shapes

The shape language is consistently **Rounded**, using a 0.5rem (8px) base radius. This level of roundedness strikes a balance between the precision of a technical tool and the friendliness of a learning platform. Larger components like hero sections or featured course cards use the `rounded-xl` (1.5rem) value to create a welcoming, modern container. Smaller elements like tags and checkboxes use the base `rounded` value to maintain structural integrity and a professional finish.

## Components

### Buttons
Primary buttons use the Primary Blue with white text, featuring a subtle 2px vertical offset shadow that disappears on click to mimic a physical press. Secondary buttons utilize a ghost style with a Primary Blue border or the Warm Sand background for softer calls to action.

### Cards
Lesson and course cards are the primary vehicle for content. They feature a white background, a 1px border in a light version of the Tertiary color, and a soft ambient shadow. On hover, the border color shifts to Primary Blue to signal interactivity.

### Code Snippets & Editors
Code containers should use a dark theme (Neutral Slate) even in light mode to provide high contrast for syntax highlighting. They feature rounded corners and a "copy" action consistently placed in the top-right corner.

### Progress Indicators
Educational progress is tracked via thin, horizontal bars using the Primary Blue. Completed sections are marked with a Secondary Warm Sand checkmark to provide a "reward" sensation that is distinct from the primary action color.

### Inputs & Form Fields
Input fields use a solid 1px border that thickens and changes to Primary Blue on focus. Labels are always placed above the field in Lexend Medium to ensure they remain legible even when the field is populated.