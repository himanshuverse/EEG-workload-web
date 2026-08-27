# EEG Workload Analysis

A web application for EEG-based mental workload analysis using Next.js, TypeScript, and Tailwind CSS.

## 🛠️ Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Git & GitHub

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/himanshuverse/EEG-workload-web.git 
cd EEG-workload-web
```

## 2. Check Node.js

```bash
node -v
npm -v
```

If Node.js is not installed, install it from:

https://nodejs.org/

## 3. Install Dependencies

```bash
npm install
```

## 4. Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 📁 Project Structure

```text
eeg-workload-web/
│
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── public/
│
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md

basic structure 
```

---

# 🌿 Git Workflow

## ⚠️ Important

**Do NOT directly work on the `main` branch.**

Every task should have its own branch.

---

## 1. Get the Latest Code

Before starting a task:

```bash
git checkout main
git pull origin main
```

## 2. Create Your Branch

For a feature:

```bash
git checkout -b feature/your-feature
```

Example:

```bash
git checkout -b feature/dashboard
```

For a bug fix:

```bash
git checkout -b fix/navbar
```

---

# 📝 Branch Naming

### Features

```text
feature/dashboard
feature/login
feature/upload-page
feature/authentication
```

### Bug Fixes

```text
fix/navbar
fix/upload-error
fix/mobile-layout
```

### Refactoring

```text
refactor/components
refactor/api-client
```

---

# 💻 Work on Your Task

Open the project in VS Code:

```bash
code .
```

Start the development server:

```bash
npm run dev
```

Make your changes and test them locally.

---

# 📦 Check Your Changes

```bash
git status
```

To see exactly what changed:

```bash
git diff
```

---

# 💾 Commit Your Changes

```bash
git add .
```

Then:

```bash
git commit -m "feat: add dashboard"
```

## Commit Message Format

```text
feat:     New feature
fix:      Bug fix
style:    Styling changes
refactor: Code restructuring
docs:     Documentation
chore:    Maintenance
```

Examples:

```bash
git commit -m "feat: add EEG upload page"
git commit -m "fix: fix mobile navbar"
git commit -m "style: improve landing page"
git commit -m "docs: update README"
```

---

# ☁️ Push Your Branch

```bash
git push -u origin feature/your-feature
```

Then go to GitHub and create a **Pull Request**.

Example:

```text
feature/dashboard → main
```

---

# 🔀 Pull Request

In your Pull Request, mention:

### What did you change?

Example:

```text
Added the initial dashboard layout.
```

### What did you test?

Example:

```text
- Tested locally
- Checked responsive layout
- npm run build passes
```

---

# 👀 Code Review

Before merging:

1. Another team member should review your code.
2. Fix requested changes.
3. Test the application again.
4. Merge the Pull Request into `main`.

**Do not merge without review unless the team agrees.**

---

# 🔄 After Your PR Is Merged

Delete your old branch:

```bash
git branch -d feature/your-feature
```

Update main:

```bash
git checkout main
git pull origin main
```

Create a new branch for your next task:

```bash
git checkout -b feature/new-feature
```

---

# ⚠️ Important Rules

## 1. Don't Push Directly to Main

❌ Don't do:

```bash
git checkout main
git add .
git commit
git push
```

✅ Instead:

```bash
git checkout main
git pull origin main
git checkout -b feature/my-feature
```

---

## 2. Don't Commit Secrets

Never commit:

```text
.env
.env.local
API keys
passwords
tokens
database credentials
```

Use environment variables instead.

Example:

```env
NEXT_PUBLIC_API_URL=
DATABASE_URL=
```

Keep real values inside `.env.local`.

---

## 3. Don't Commit These Files

```text
node_modules/
.next/
.env.local
```

These should be ignored by `.gitignore`.

---

# 🧩 Team Work

```

Each person should work on their own branch.

---

# 🔥 Before Starting Any Task

Always run:

```bash
git checkout main
git pull origin main
git checkout -b feature/your-task
```

Then start working.

---

# 🔥 Before Creating a Pull Request

Run:

```bash
npm run dev
```

Test your changes.

Then:

```bash
git status
git add .
git commit -m "feat: describe your change"
git push -u origin feature/your-task
```

Create the Pull Request on GitHub.

---

# 🆘 Merge Conflicts

If your branch has conflicts with `main`:

```bash
git checkout main
git pull origin main
```

Then:

```bash
git checkout feature/your-task
git merge main
```

Resolve the conflicts in VS Code.

Then:

```bash
git add .
git commit -m "fix: resolve merge conflicts"
git push
```

---


# 🎯 Project Goal

The application will eventually provide:

- EEG file upload
- EEG analysis
- Mental workload prediction
- Signal quality information
- Workload visualization
- Session history
- Dashboard
- User authentication

The ML inference service will be maintained separately from this repository.

---

# 👥 Contribution Process

```text
1. Pull latest main
       ↓
2. Create feature branch
       ↓
3. Implement your task
       ↓
4. Test locally
       ↓
5. Commit changes
       ↓
6. Push branch
       ↓
7. Create Pull Request
       ↓
8. Code review
       ↓
9. Merge into main
```

---

## 🤝 Team Rule

> **One task → One branch → One Pull Request**

Keep `main` stable and always deployable.
