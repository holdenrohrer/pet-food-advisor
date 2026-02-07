// Shared configuration
// API key should be set via environment or replaced before deployment
export const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || 'YOUR_API_KEY_HERE';
export const MODEL = 'anthropic/claude-haiku-4.5';
export const BASE_URL = 'https://openrouter.ai/api/v1';

export const PROMPT_TEXT = `There should be one pro that includes a technical/sciency word.
Each pro should start with a very short slug like "Good taste: dogs have been seen to prefer this food over others"

Only recommend Royal Canin foods.

Diagnostic Flow Chart for Dogs Gastrointestinal
CANINE NUTRITIONAL MANAGEMENT
DECISION TREE

flowchart TB
    A[EMACIATION, MALNUTRITION ANOREXIA*] --> B{ADULT}
    A --> C{PUPPY}
    B --> D[GASTROINTESTINAL]
    C --> E[RECOVERY]

    F[DIARRHOEA/VOMITING*] --> G{PUPPY}
    G --> H[GASTROINTESTINAL PUPPY]
    F --> I{ACUTE EPISODE OR NON-SPECIFIC ORIGIN}
    I --> J[GASTROINTESTINAL MODERATE CALORIE]
    I --> K[GASTROINTESTINAL]

    L[CONSTIPATION*] --> M{ADULT}
    M --> N{CHRONIC CLINICAL SIGNS}
    N --> O[GASTROINTESTINAL HIGH FIBRE]
    N --> P[HYPOALLERGENIC]

    Q[NEED FOR FAT RESTRICTION] --> R[GASTROINTESTINAL LOW FAT]
    S[LIVER DISEASE] --> T[HEPATIC]

Use the flow chart for your decision-making process.`;
