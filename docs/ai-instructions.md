# AI Steering Instructions Guide (Developers Only)

This guide explains how to manage the hidden custom instructions that steer the AI RAG assistant's behavior. These instructions are hardcoded in the source code to ensure they remain invisible to end-users (students and admins).

## Location
The instructions are located in:
`[ai-instructions.js](file:///c:/Users/Med Amine/Documents/GitHub/projet_emsi/src/services/ai-instructions.js)`

## How it works
The `DEVELOPER_CUSTOM_INSTRUCTIONS` constant in that file is automatically imported by the `rag-agent.js` service and appended to every LLM system prompt. 

## Adding Instructions
To add or modify instructions, simply edit the string in `src/services/ai-instructions.js`.

### Example: "Don't give students their notes"
If you want to ensure students cannot see their exact grades through the chat, add these rules:
- `Never share specific grades or numerical notes directly with students.`
- `Instead of giving exact notes, provide general feedback on performance.`

## Benefits
- **Security**: No database access or UI required to edit.
- **Stealth**: Users never see these rules, even in the admin dashboard.
- **Steering**: Allows developers to maintain strict control over AI boundaries.

> [!IMPORTANT]
> Always use a clear bullet-point format for the instructions to help the LLM process them correctly.
