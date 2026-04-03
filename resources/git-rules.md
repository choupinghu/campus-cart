# Git & GitHub Rules for the Squad

Hey guys! Since there are 3 of us working on the IT5007 Finals Project, let's keep the rules relaxed but just strict enough so we don't accidentally blow up the project. 

Main reason for PR is for all developers to be aware of any changes in the project.

Always pull from main and branch out before starting any work.

Here is our cheat sheet for keeping things running smoothly.

---

## 1. The "Please Don't Break The Project" Rules
- **No Direct Pushes to Main:** The `main` branch is protected. Everything goes through a Pull Request (PR). Direct pushing to `main` is blocked, so don't even try it!
- **Always Pull Before You Push:** Before you start working or try to push, run `git pull origin main`. It saves us all from nasty merge conflicts.
- **Keep Secrets Secret:** NEVER commit `.env` files, API keys, or passwords. Check the `.gitignore` before you push.

## 2. Commit Message Cheat Sheet
Let's keep our history readable. Start your commit messages with one of these tags:

- **`feat:`** (When you add something new)
  - *Example:* `feat: add chatbot integration`
- **`fix:`** (When you fix a bug or crash)
  - *Example:* `fix: resolve crash on empty form submit`
- **`chore:`** (Setup, config, package installations)
  - *Example:* `chore: add axios to dependencies`
- **`best practice:` or `docs:`** (Refactoring messy code or updating READMEs)
  - *Example:* `best practice: clean up duplicate navbar code`

## 3. PR (Pull Request) Guidelines

### A. Keep It Bite-Sized
- Try not to dump a whole week's worth of work into one massive PR. If it's over 10-15 files or 500 lines of code, it’s going to be a headache to review. 
- Try to fix or build **one thing at a time**. (Don't mix a login bug fix with a new dashboard UI).

### B. What to put in the PR Description
Keep it simple. Just answer these questions when you open a PR. **Note: the questions change slightly depending on whether you're working solo or collaborating with someone on the same feature.**

**Option 1: Individual Feature (Playing Solo)**
1. **What program/feature changed?** (e.g., *Added the new chatbot UI component*)
2. **Why did it change?** (e.g., *User needed a way to ask questions directly from the dashboard*)
3. **How did you test it?** *(Optional)* (e.g., *Tested locally, form submits correctly and UI looks good on mobile*)

**Option 2: Collaborative Feature (Co-op Mode)**
1. **What part of the shared feature did you contribute?** (e.g., *Built the logic for the chatbot while Bob is doing the UI*)
2. **Why did it change?** (e.g., *We needed to connect to the new AI endpoint*)
3. **How did you test it?** *(Optional)* (e.g., *Ensure my function returns the right payload*)
4. **What is left for the other person?** *(Optional)* (e.g., *Bob still needs to hook this payload to the UI*)

### C. Branch Names
You **must** follow a strict naming convention when creating branches. This keeps everything organized so we know exactly what a branch does just by looking at the name.

**Format:** `prefix/branch-name` (use all lowercase, and separate words with hyphens `-` instead of spaces).

**Prefixes you must use:**
- `feat/` for adding new features (e.g., `feat/chatbot-ui`)
- `fix/` for fixing bugs or crashes (e.g., `fix/login-crash`)
- `chore/` for setup, config, or package updates (e.g., `chore/docker-setup`)
- `docs/` for documentation and refactoring (e.g., `docs/update-readme`)

*How to create your branch properly in the terminal:*
`git checkout -b feat/your-feature-name`

## 4. Quick Workflow Reminder
Forget what command to run? Here is the flow:
1. `git checkout main` (Go to main)
2. `git pull origin main` (Get the latest code)
3. `git checkout -b feat/your-feature` (Make your branch)
4. *... write your awesome code ...*
5. `git add .` (Stage it)
6. `git commit -m "feat: added the thing"` (Commit it)
7. `git push -u origin feat/your-feature` (Push it to GitHub. `-u` means upstream, to track the branch)
8. Make a PR and ask one of us to approve it!

---

## 5. GitHub Classroom Limitations & Our "Social Contract"

Because this repository is hosted on **GitHub Classroom**, we do not have access to the repository "Settings" tab. This means **we cannot turn on hard Branch Protection rules** to physically block people from pushing to `main` or merging broken code.

Therefore, we operate on a strict **Social Contract**:

1. **Honor the PR System:** Even though GitHub allows you to push directly to `main`, **do not do it**. Always create a branch and open a PR.
2. **Watch the CI Action (`analyze-ui.yml`):** When you open a PR, you will see a yellow circle/dot indicating the GitHub Action is running. **You must wait for it to finish and turn into a green checkmark (✅)**.
3. **If the CI Fails (❌):** Do not click merge. Look at the logs. It usually means you need to run `pnpm lint:fix` or `pnpm format` locally, commit, and push again.
4. **The Honor System Merge:** Once the CI is green (✅) and a teammate has reviewed your code and given a 👍, *only then* should you click the green "Merge pull request" button.
