# Contributing to Pokerize

Thank you for your interest in contributing to Pokerize! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- Yarn (recommended) or npm
- Git

### Setup
1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/pokerize.git
   cd pokerize
   ```
3. Install dependencies:
   ```bash
   yarn install
   ```
4. Set up environment variables:
   ```bash
   cp env.example .env
   # Edit .env with your Firebase credentials
   ```
5. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development
1. Start the development server:
   ```bash
   yarn dev
   ```
2. Make your changes
3. Run tests and linting:
   ```bash
   yarn build
   yarn eslint src --ext .ts,.tsx
   ```

## Code Style

- Use TypeScript for all new code
- Follow the existing code style and formatting
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

## Testing

- Test your changes locally before submitting
- Ensure the app builds successfully
- Test on different browsers if applicable

## Submitting Changes

1. Commit your changes with a descriptive message:
   ```bash
   git commit -m "feat: add new feature description"
   ```
2. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
3. Create a Pull Request

## Pull Request Guidelines

- Use the provided PR template
- Provide a clear description of changes
- Include screenshots for UI changes
- Ensure all CI checks pass
- Request reviews from maintainers

## Issue Reporting

- Use the provided issue templates
- Provide detailed reproduction steps
- Include browser and OS information
- Add screenshots when relevant

## Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow the project's coding standards

## Questions?

Feel free to open an issue for questions or discussions about the project.
