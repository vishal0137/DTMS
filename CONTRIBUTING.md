# Contributing to DTMS

Thank you for considering contributing to the Delhi Transport Management System.

## Getting Started

| Step | Command | Description |
|------|---------|-------------|
| 1. Fork | GitHub UI | Fork the repository |
| 2. Clone | `git clone https://github.com/your-username/DTMS.git` | Clone your fork |
| 3. Branch | `git checkout -b feature/your-feature-name` | Create feature branch |
| 4. Develop | Code changes | Make your changes |
| 5. Test | Run tests | Verify functionality |
| 6. Commit | `git commit -m "Add: feature description"` | Commit changes |
| 7. Push | `git push origin feature/your-feature-name` | Push to GitHub |
| 8. PR | GitHub UI | Create Pull Request |

## Development Setup

### Backend
```bash
cd web/backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../.env.example .env  # Configure your database
python seed_data.py
uvicorn main:app --reload
```

### Frontend
```bash
cd web/frontend
npm install
cp .env.example .env
npm run dev
```

### Mobile
```bash
cd mobile
npm install
cp .env.example .env
npm start
```

## Code Style

### Python (Backend)

| Guideline | Standard |
|-----------|----------|
| Style Guide | PEP 8 |
| Type Hints | Required where possible |
| Docstrings | Required for functions/classes |
| Function Size | Small and focused |

### JavaScript/React (Frontend)

| Guideline | Standard |
|-----------|----------|
| Components | Functional with hooks |
| Best Practices | React guidelines |
| Variable Names | Meaningful, descriptive |
| Component Size | Small and reusable |

## Testing

### Backend Tests
```bash
cd web/backend
pytest tests/ -v
```

### Frontend Tests
```bash
cd web/frontend
npm test
```

### Mobile Tests
```bash
cd mobile
npm test
```

## Commit Message Guidelines

Use present tense and imperative mood. Limit first line to 72 characters.

### Commit Types

| Type | Usage | Example |
|------|-------|---------|
| Add | New feature | Add: user authentication |
| Fix | Bug fix | Fix: login validation error |
| Update | Update existing feature | Update: dashboard layout |
| Remove | Remove code/files | Remove: deprecated API |
| Refactor | Code refactoring | Refactor: database queries |
| Docs | Documentation | Docs: update API guide |
| Test | Tests | Test: add booking tests |
| Style | Code style | Style: format with prettier |

## Pull Request Process

| Step | Action |
|------|--------|
| 1 | Update documentation if needed |
| 2 | Add tests for new features |
| 3 | Ensure all tests pass |
| 4 | Update CHANGELOG.md if applicable |
| 5 | Request review from maintainers |

## Reporting Bugs

Include the following information:

| Information | Description |
|-------------|-------------|
| Description | Clear issue description |
| Steps | How to reproduce |
| Expected | Expected behavior |
| Actual | Actual behavior |
| Screenshots | If applicable |
| Environment | OS, browser, versions |

## Feature Requests

| Information | Description |
|-------------|-------------|
| Description | Clear feature description |
| Justification | Why it would be useful |
| Examples | Usage examples if possible |
