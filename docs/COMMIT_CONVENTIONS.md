# Commit Conventions

This project uses [Conventional Commits](https://www.conventionalcommits.org/) specification enforced by [Commitlint](https://commitlint.js.org/) and [Husky](https://typicode.github.io/husky/).

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Scope

The scope should be the name of the component/feature affected (optional but recommended).

Examples: `types`, `build`, `deps`, `ui`, `api`, `auth`, `config`

### Subject

- Use imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No period (.) at the end
- Maximum 100 characters for the entire header line

### Body

- Use imperative, present tense
- Include motivation for the change and contrast with previous behavior
- Must be preceded by a blank line

### Footer

- Must be preceded by a blank line
- Reference issues and pull requests
- Note breaking changes

## Examples

### Simple commit

```
feat(blog): add dark mode toggle
```

### Commit with scope and body

```
fix(auth): resolve token expiration issue

The authentication token was expiring too quickly causing users
to be logged out unexpectedly. Updated the token TTL from 1h to 24h.
```

### Commit with breaking change

```
feat(api)!: change API response format

BREAKING CHANGE: The API now returns data in a new format.
Update your client code to handle the new response structure.

Closes #123
```

### Commit with multiple changes

```
refactor(components): improve component structure

- Extract reusable logic into hooks
- Update prop types for better type safety
- Add JSDoc comments for public APIs
- Remove unused dependencies
```

## Git Hooks

This project uses Husky to run automated checks:

### Pre-commit

Before each commit, the following checks run:
- `pnpm astro check` - TypeScript and Astro type checking
- `pnpm exec biome check --write .` - Linting and auto-fixing

### Commit-msg

After writing your commit message:
- `commitlint` validates the message format
- Commit is rejected if it doesn't follow conventions

## Bypass Hooks (Not Recommended)

If absolutely necessary, you can bypass hooks with:

```bash
git commit --no-verify -m "your message"
```

**Warning**: Only use this in exceptional circumstances as it skips important checks.

## Testing Your Commit Message

You can test if your commit message is valid before committing:

```bash
echo "feat(test): add new feature" | pnpm exec commitlint
```

## Tips

1. Keep commits small and focused on a single change
2. Write clear, descriptive commit messages
3. Reference issue numbers when applicable
4. Use the body to explain "why" not "what"
5. If you make a mistake, use `git commit --amend` to fix the last commit message

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Commitlint Documentation](https://commitlint.js.org/)
- [Husky Documentation](https://typicode.github.io/husky/)