# 📊 MicroSigma

Simplifies tracking my self-employed activity (Micro-Entreprise). It allows me to:

- Log my workdays
- Track my revenue
- Calculate social contributions and income taxes
- Helps with invoicing and revenue declaration

![screenshot](screenshot.png)

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:8888](http://localhost:8888)

## Configuration

`./src/config.ts` _(may not be up to date)_

```typescript
{
  socialContributionRate: 0.22,
  acreRate: 0.11,
  acreStartDate: dayjs('2024-06-01'),
  acreEndDate: dayjs('2025-03-31'),
  incomeTaxRate: 0.18,
  taxAbatement: 0.34,
  activityStartDate: dayjs('2024-06-01'),
  incomeLimit: 77700,
  vatLowerLimit: 36800,
  vatUpperimit: 39100,
  vatStartDate: dayjs('2024-12-01'),
}
```

## TODO

- Generate activity report PDF (CRA)
- Notify when approaching the VAT threshold
- Update the configuration file directly from the interface
