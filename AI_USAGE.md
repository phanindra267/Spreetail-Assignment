# AI_USAGE.md

---

## AI Tools Used
- **ChatGPT-4o**: Primary AI assistant for code generation and problem-solving
- **GitHub Copilot**: Code completion and suggestions in IDE

---

## Key Prompts
1. "Generate a shared expenses app schema with group membership tracking over time"
2. "How to detect and handle common CSV import anomalies for expense data"
3. "Build a React frontend for a shared expenses app with balance calculation"

---

## AI Missteps & Corrections
1. **Misstep 1**: AI suggested storing all amounts in INR, ignoring original currency
   - **Caught**: Remembered Priya's request about dollar-rupee conversion
   - **Correction**: Changed to store original currency and amount, convert on display
2. **Misstep 2**: AI didn't include join/leave dates in group membership schema
   - **Caught**: Remembered Sam's request about moving in mid-April
   - **Correction**: Added joined_at and left_at columns to group_memberships
3. **Misstep 3**: AI suggested auto-removing duplicates without user approval
   - **Caught**: Remembered Meera's request to approve all deletions/changes
   - **Correction**: Changed to flag duplicates for user approval
