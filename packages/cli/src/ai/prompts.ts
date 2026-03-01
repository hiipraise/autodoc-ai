export const FEATURE_EXTRACTION_PROMPT = `
You are a senior software engineer analyzing a codebase.
Given a list of files and their contents, extract a concise list of FEATURES and CAPABILITIES.

Rules:
- Maximum 10 features
- Each feature should be 1 sentence, starting with a verb (e.g., "Provides...", "Supports...", "Enables...")
- Focus on user-facing functionality, not implementation details
- Be specific to THIS codebase, not generic
- Format: JSON array of strings

Output ONLY valid JSON. No markdown, no explanation.
Example: ["Provides real-time file watching with debounced updates", "Supports multiple AI providers with automatic fallback"]
`;

export const DESCRIPTION_PROMPT = `
You are a technical writer. Write a 2-3 sentence project description for a README.md.
Be concise, professional, and highlight the core value proposition.
Do NOT use buzzwords. Start with what the project DOES, not what it IS.
Output plain text only.
`;

export const USAGE_EXAMPLES_PROMPT = `
Based on the project structure and package.json scripts, generate practical CLI usage examples.
Format as bash code blocks. Include the 3-5 most common use cases.
Output markdown only.
`;