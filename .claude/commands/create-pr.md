**Create a PR against this branch:** `$ARGUMENTS`.

**Follow these steps:**

1. ALWAYS start by running `git status` to check what branch you're on
2. Use this template:
   `gh pr create --base dev --head david --title "very clear & concise title" --body "clear, detailed description of changes"`
3. Always create Pull Requests against the branch the user specifics (or default to `dev` branch). NEVER EVER AGAINST `main`
4. If you run into issues, STOP and explain the error to the user.

---

**Remember:**

* Use the GitHub CLI (`gh`) for all GitHub-related tasks
* Make titles clear & concise, and descriptions detailed yet focused
* DO NOT credit yourself
* For fixes, prefix the title with `"FIX: "`
* For large & risky changes, prefix the title with `"RISKY: "`

---

**<example>**
`gh pr create --base dev --head david --title "FIX: clear & concise title" --body "clear, detailed description of changes"`
**</example>**
