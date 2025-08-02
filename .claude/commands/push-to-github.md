Push these changes to GitHub: `$ARGUMENTS`.

If no topic is provided, just document the recent changes.  
If a topic is provided, focus on documenting that topic.

## Follow these steps:

1. Run `git status` to get the current branch name
2. Run `git add .` to stage all files (unless the user says otherwise)
3. Run `git commit -m "commit message"` to commit changes
    - Make the message very concise yet complete
    - Do **not** give yourself credit
4. Run `git push origin <branch name>` to push changes to GitHub

---

## Important Rules

- **FOLLOW THIS EXACT ORDER. EACH STEP IS A SEPARATE TERMINAL.**
- Commit messages **cannot** contain newline characters
- Never just do `git commit` — always include a commit message
- Keep commit messages **concise**, while still clearly describing the changes
- If the user mentions a specific issue number, include it in the commit message
- **NEVER EVER** do a force push, unless the user explicitly asks you to

---

## Commonly Used Branches

- `main` — Production branch. **Never push without thorough testing.**
- `staging` — Staging environment, same DB as prod
- `dev` — Testing/dev environment, separate DB with the same schema

---

**PS:** Always run `git status` to get the current branch name.