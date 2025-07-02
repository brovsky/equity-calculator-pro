# Equity Calculator Pro

A comprehensive startup equity and valuation analysis tool built with Next.js and TypeScript. This modern web application helps founders and investors calculate valuations, model dilution scenarios, and analyze complex equity structures.

## Features

### 🧮 Core Calculators
- **Valuation Calculator**: Calculate pre-money and post-money valuations
- **SAFE Notes**: Analyze SAFE note dilution with caps and discounts
- **Convertible Notes**: Model convertible note conversions with interest and discounts
- **Dilution Scenarios**: Run multi-round funding scenarios
- **Exit Analysis**: Model liquidation preferences and exit proceeds

### 📊 Advanced Features
- Multi-round dilution modeling
- Liquidation preference analysis
- Share distribution calculations
- Anti-dilution provisions
- Participation rights modeling

### 🎨 Modern UI
- Responsive design with Tailwind CSS
- Interactive charts and visualizations
- Clean, professional interface
- Mobile-friendly layout

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: Plotly.js (ready for integration)
- **Fonts**: Montserrat, Open Sans

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd equity-calculator-pro
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── EquityCalculator.tsx       # Main calculator component
│   ├── ValuationCalculator.tsx    # Basic valuation calculator
│   ├── SAFECalculator.tsx         # SAFE notes calculator
│   ├── ConvertibleNoteCalculator.tsx # Convertible notes calculator
│   ├── DilutionScenario.tsx       # Multi-round dilution modeling
│   └── ExitAnalysis.tsx           # Exit scenario analysis
└── lib/                   # Utility functions and types
    ├── calculations.ts    # Core calculation functions
    ├── types.ts          # TypeScript type definitions
    ├── examples.ts       # Example scenarios and definitions
    └── test-calculations.ts # Test suite for calculations
```

## Key Components

### Calculations Engine (`src/lib/calculations.ts`)
Contains all the core financial calculations:
- `calculateValuations()` - Basic pre/post money calculations
- `calculateSAFEDilution()` - SAFE note conversion logic
- `calculateConvertibleNoteDilution()` - Convertible note analysis
- `runDilutionScenario()` - Multi-round dilution modeling
- `calculateExitProceeds()` - Exit waterfall analysis

### React Components
- **EquityCalculator**: Main application shell with navigation
- **ValuationCalculator**: Basic valuation calculations
- **SAFECalculator**: SAFE note analysis
- **ConvertibleNoteCalculator**: Convertible note modeling
- **DilutionScenario**: Multi-round scenario planning
- **ExitAnalysis**: Exit proceeds and liquidation preferences

## Usage Examples

### Basic Valuation
```typescript
import { calculateValuations } from '@/lib/calculations';

const result = calculateValuations(1000000, 20); // $1M at 20%
// Returns: { preMoneyValuation: 4000000, postMoneyValuation: 5000000 }
```

### SAFE Note Analysis
```typescript
import { calculateSAFEDilution } from '@/lib/calculations';

const result = calculateSAFEDilution(8000000, 500000, 5000000, 20);
// Pre-money: $8M, Investment: $500K, Cap: $5M, Discount: 20%
```

### Multi-Round Dilution
```typescript
import { runDilutionScenario } from '@/lib/calculations';

const rounds = [
  { type: 'SAFE', investment: 500000, cap: 5000000, discount: 20 },
  { type: 'Priced Round', investment: 2000000, ownership_percentage: 20 }
];

const results = runDilutionScenario(100, rounds);
```

## Features Converted from Python/Streamlit

This application is a complete rewrite of a Python Streamlit application with the following improvements:

### From Streamlit to React
- **Widgets → Form Inputs**: Streamlit inputs converted to controlled React inputs
- **Session State → React State**: `st.session_state` replaced with `useState` hooks
- **Columns → CSS Grid/Flexbox**: Layout system modernized
- **Plotly Charts → Ready for Integration**: Chart components prepared for Plotly React

### Enhanced Features
- **Type Safety**: Full TypeScript implementation
- **Component Architecture**: Modular, reusable components
- **Modern Styling**: Tailwind CSS with custom design system
- **Responsive Design**: Mobile-first responsive layout
- **Performance**: Optimized for modern browsers

## Development

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

### Type Checking
TypeScript is configured for strict type checking. All calculations are fully typed for better development experience and runtime safety.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new calculations
4. Ensure all tests pass
5. Submit a pull request

## License

Copyright © 2025 Scott Brovsky and Equity Calc Pro

## Acknowledgments

- Original Python implementation provided the calculation logic
- Design inspired by modern financial tools
- Built with Next.js and React best practices
