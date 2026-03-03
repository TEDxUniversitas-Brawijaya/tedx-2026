# Team Workflow Guidelines

This document outlines the conventions and workflow practices for contributing to the TEDxUniversitas Brawijaya 2026 project.

## Code Conventions

### Language
- **Use English** for all code, comments, commit messages, PR descriptions, and documentation
- This ensures consistency and makes the codebase accessible to a wider audience

### Naming Conventions
- **File and folder names**: Use `kebab-case`
  - ✅ Good: `user-profile.tsx`, `api-utils.ts`, `hero-section/`
  - ❌ Bad: `UserProfile.tsx`, `api_utils.ts`, `HeroSection/`

### Asset Naming Guidelines

When adding assets (images, videos, fonts, etc.):

1. **Be descriptive**: Name should clearly describe the asset's content
   - ✅ Good: `speaker-podium.jpg`, `tedx-logo.svg`
   - ❌ Bad: `img1.jpg`, `photo.png`

2. **Keep it general**: Don't tie names to specific features or pages
   - ✅ Good: `conference-hall.jpg` (can be reused anywhere)
   - ❌ Bad: `homepage-hero-conference.jpg` (tied to homepage)

3. **Number similar assets**: When you have multiple similar assets, append numbers
   - ✅ Good: `team-photo-1.jpg`, `team-photo-2.jpg`, `team-photo-3.jpg`
   - ✅ Good: `background-pattern-1.svg`, `background-pattern-2.svg`

4. **Use kebab-case**: Consistent with code naming conventions
   - ✅ Good: `event-banner.png`
   - ❌ Bad: `Event_Banner.png`, `eventBanner.png`

## Commit Message Convention

Use **Conventional Commits** format for all commit messages:

### Format
```
<type>: <description>

[optional body]

[optional footer]
```

### Types
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code refactoring without changing functionality
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks (dependency updates, build config, etc.)

### Examples
```
feat: add speaker registration form

fix: resolve navbar dropdown on mobile devices

docs: update API documentation for event endpoints

refactor: simplify user authentication logic
```

### With Issue References
When working on an issue, reference it in the commit message:
```
feat: implement footer component (#17)

fix: navbar not showing on propaganda page (#19)
```

## Branch Naming Convention

Use a clear, descriptive format for branch names:

### Format
```
<type>/<description>
```
or
```
<type>/<issue-number>-<description>
```

### Types
- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `chore/` - Maintenance tasks

### Examples
```
feat/user-authentication
feat/17-implement-footer
fix/navbar-dropdown
fix/19-propaganda-page-navbar
docs/update-contributing-guide
refactor/simplify-api-calls
```

## Pull Request Workflow

### Creating a Pull Request

1. **Push your branch** to the remote repository
2. **Open a Pull Request** on GitHub targeting the `main` branch
3. **Write a clear description** of what the PR does
   - Explain the changes and why they were made
   - Reference related issues (e.g., "Closes #17")
   - **Do NOT include screenshots** - deploy previews are automatically generated

### Requesting Reviews

- **Use GitHub's "Request Review" feature** - don't notify reviewers via WhatsApp or private messages
- **For `apps/www` changes**: Share the PR link in the group chat for UI/UX team review
- **Rationale**: Maintainers subscribe to all PRs and get notified automatically. External messages create notification spam and can be forgotten.

### Deploy Previews

- Every push to a PR branch **automatically triggers a deploy preview** via GitHub Actions
- Check the "Checks" section of your PR to find the preview URL
- No need to manually take screenshots or screen recordings

### Working with AI Assistants

If you're still iterating on your code with AI tools (Copilot, Claude, etc.):

1. **Convert your PR to Draft** to signal it's not ready for review
2. **Cancel the preview deployment workflow** to save resources
   - Go to the "Actions" tab → Find the workflow run → "Cancel workflow"
3. **Don't request reviews yet** until you're confident the code is ready

Once you're done iterating:
1. Mark the PR as "Ready for review"
2. Request reviews as needed

### Handling Review Comments

- **Resolve conversations** when addressed - just click "Resolve"
- **Don't comment "done"** or similar acknowledgments - it creates noise
- **Ask questions by tagging reviewers** in the PR conversation
  - ✅ Good: "@reviewer What approach would you prefer here?"
  - ❌ Bad: Asking in WhatsApp or private messages
- **Rationale**: Keeps all context in one place, prevents information loss

### Communication Best Practices

**Use the PR conversation for ALL PR-related communication:**
- Questions about implementation
- Discussion about approach
- Requests for clarification
- Design feedback

**Why?**
- Maintainers subscribe to PRs and are automatically notified
- Keeps all context documented in one place
- Prevents information from being lost in chat apps
- Reduces notification spam from multiple channels

## Code Quality Standards

This project enforces strict code quality standards. See [`.claude/CLAUDE.md`](../.claude/CLAUDE.md) for detailed guidelines on:

- Type safety and TypeScript best practices
- React and JSX patterns
- Code organization and maintainability
- Accessibility standards
- Performance considerations

Before committing, always run:
```bash
bun run lint:fix
```

Git hooks will automatically check your code on commit, but running it manually helps catch issues early.

## Questions?

If you have questions about these guidelines or need clarification:
1. Check existing PRs for examples
2. Ask in the project's group chat (for general workflow questions)
3. Tag maintainers in your PR (for PR-specific questions)

---

For development setup and commands, see [`development.md`](./development.md).
