# Workflow Design Guide

## 🎯 Overview
This guide covers proven workflows for AI-assisted development with OpenCode. Choose the workflow that best fits your task.

## 🔄 1. Explore → Plan → Code → Commit

The most versatile workflow for complex problems:

### Explore:
- Read relevant files, images, URLs
- Use subagents for verification
- Do **not** code yet - understand first

### Plan:
- Ask OpenCode to create a plan
- Review and refine the approach
- Consider alternatives and trade-offs

### Code:
- Implement the solution
- Verify reasonableness as you go
- Use tests to validate

### Commit:
- Commit results with clear messages
- Create pull requests if needed
- Update documentation

### Example:
```bash
# Explore: Understand the codebase
@explore Analyze @src/auth/ for authentication implementation

# Plan: Design the solution
[Plan] How would you add OAuth2 support to the existing authentication?

# Code: Implement
[Build] Implement OAuth2 support as planned

# Commit: Save changes
!git add .
!git commit -m "feat: Add OAuth2 authentication support"
```

## 🧪 2. Test-Driven Development (TDD)

Ideal for changes verifiable with unit/integration tests:

### Write Tests:
- Create tests based on expected behavior
- Mark as TDD to guide OpenCode
- Ensure tests fail initially (Red)

### Run & Fail Tests:
- Confirm tests fail as expected
- No implementation yet

### Write Code:
- Implement minimal code to pass tests (Green)
- Iterate with verification

### Refactor:
- Improve code while keeping tests green
- Maintain test coverage

### Commit:
- Final commit after all tests pass

### Example:
```bash
# Start TDD session
/tdd "User registration validation"

# OpenCode guides through:
# 1. Write failing test
# 2. Implement minimal solution
# 3. Refactor
# 4. Repeat for each requirement

# Complete and commit
!git add .
!git commit -m "test: Add user registration validation"
```

## 🎨 3. Visual Iteration

Perfect for UI/design work:

### Provide Visual Reference:
- Drag and drop images into terminal
- Provide screenshots or mockups
- Describe desired outcome

### Implement Code:
- Create code matching visual reference
- Take screenshots of result

### Iterate:
- Compare result with reference
- Make adjustments
- Repeat until satisfied

### Commit:
- Commit final implementation

### Example:
```bash
# Drag dashboard-mockup.png into terminal
[Image #1: dashboard-mockup.png]

# Implement based on image
Create a React dashboard component matching [Image #1]

# Iterate based on results
The spacing looks off. Adjust to match the mockup more closely.

# Finalize
!git add .
!git commit -m "feat: Add dashboard component"
```

## 🐛 4. Bug Fix Workflow

Systematic approach to debugging:

### Reproduce:
- Understand the bug report
- Reproduce the issue
- Identify error conditions

### Diagnose:
- Analyze logs and error messages
- Trace through code execution
- Identify root cause

### Fix:
- Implement solution
- Test the fix
- Ensure no regressions

### Verify:
- Run existing tests
- Add regression tests
- Confirm fix works

### Example:
```bash
# Reproduce bug
The user reports: "Registration fails with invalid email error"

# Diagnose
@debugger Analyze @src/auth/registration.ts for email validation issues

# Fix
[Build] Fix the email validation regex in @src/auth/registration.ts

# Verify
!npm test -- --testPathPattern=registration
!git add .
!git commit -m "fix: Correct email validation regex"
```

## 🚀 5. Feature Development Workflow

Complete feature implementation:

### Requirements Analysis:
- Understand feature requirements
- Identify dependencies
- Plan implementation steps

### Architecture Design:
- Design solution architecture
- Plan database schema (if needed)
- Design API endpoints

### Implementation:
- Implement backend components
- Implement frontend components
- Connect pieces together

### Testing:
- Write unit tests
- Write integration tests
- Perform user acceptance testing

### Deployment:
- Prepare for deployment
- Update documentation
- Deploy to environment

### Example:
```bash
# Multi-agent feature development
@product-manager Define requirements for user profile feature
@architect Design profile feature architecture
@backend Implement profile API endpoints
@frontend Implement profile UI components
@tester Create comprehensive test suite
@devops Prepare deployment configuration
@documentation Update user and developer docs
```

## 🧩 Workflow Customization

Create your own workflows by combining:

### Agent Chains:
```bash
# Custom workflow using agent chain
@explore → @plan → @implement → @test → @review → @deploy
```

### Skill Sequences:
```bash
# Custom workflow using skills
/analyze → /plan → /implement → /test → /review → /deploy
```

### Hybrid Approaches:
```bash
# Mix agents and skills
@explore Analyze requirements
/plan Create implementation plan
@implement Write code
/test Run tests
/review Code review
/deploy Deploy changes
```

## 🤖 The BMAD Method (AI Agent Framework)

BMAD (Brainstorm, Model, Act, Deliver) is a systematic framework for AI-assisted development.

### Phase 1: Brainstorm
**Purpose:** Explore the problem space without constraints

**Activities:**
- Research existing solutions
- Generate multiple approaches
- Consider edge cases and constraints
- Gather requirements and context

**OpenCode Commands:**
```bash
# Explore the codebase
@explore Analyze @src/ for related functionality

# Research requirements
What are the requirements for user authentication?

# Generate ideas
Brainstorm 3 different approaches to implement OAuth2

# Consider constraints
What are the security considerations for this feature?
```

**Output:**
- Problem understanding
- Multiple solution approaches
- Requirements list
- Constraints and considerations

### Phase 2: Model
**Purpose:** Create detailed, actionable plans

**Activities:**
- Select best approach from brainstorming
- Create detailed implementation plan
- Design architecture and components
- Plan testing and validation

**OpenCode Commands:**
```bash
# Create implementation plan
[Plan] Create detailed plan for OAuth2 implementation

# Design architecture
Design the authentication system architecture

# Plan testing strategy
What tests are needed for this feature?

# Create timeline
Estimate effort and create implementation timeline
```

**Output:**
- Detailed implementation plan
- Architecture diagrams
- Test plan
- Timeline and milestones

### Phase 3: Act
**Purpose:** Execute the plan with precision

**Activities:**
- Implement code according to plan
- Follow best practices and patterns
- Validate implementation continuously
- Adapt based on findings

**OpenCode Commands:**
```bash
# Switch to Build mode
[Build] Implement the authentication system as planned

# Follow implementation steps
1. Create OAuth2 configuration
2. Implement callback handler
3. Add user session management
4. Update frontend components

# Validate as you go
Test each component as it's implemented
```

**Output:**
- Working implementation
- Passing tests
- Documentation updates
- Code review feedback addressed

### Phase 4: Deliver
**Purpose:** Complete and deploy the solution

**Activities:**
- Final testing and validation
- Performance optimization
- Documentation completion
- Deployment and monitoring

**OpenCode Commands:**
```bash
# Final testing
/test --all

# Performance optimization
/analyze --focus performance

# Documentation
/docs update

# Deployment preparation
/deploy prepare
```

**Output:**
- Production-ready feature
- Comprehensive documentation
- Deployment artifacts
- Monitoring setup

### Complete BMAD Workflow Example:
```bash
# Brainstorm: Explore authentication options
@explore Analyze current authentication in @src/auth/
What OAuth2 providers should we support?
Brainstorm implementation approaches

# Model: Create detailed plan
[Plan] Create OAuth2 implementation plan including:
1. Google OAuth2 integration
2. GitHub OAuth2 integration
3. Session management
4. Frontend components
5. Testing strategy

# Act: Implement
[Build] Implement Google OAuth2 first
[Build] Implement GitHub OAuth2
[Build] Create session management
[Build] Update frontend login components
/test each component

# Deliver: Complete and deploy
/test --integration
/analyze --security
/docs --api
/deploy --staging
/monitor --setup
```

### BMAD Variations:

**Lightweight BMAD:** For small changes
```bash
# Brainstorm: Quick analysis
What's the best way to fix this null pointer?

# Model: Simple plan
[Plan] Fix by adding null check on line 45

# Act: Implement
[Build] Add null check: if (user) { ... }

# Deliver: Test and commit
/test --unit
!git commit -m "fix: Add null check for user object"
```

**Extended BMAD:** For complex projects
```bash
# Multi-phase BMAD with multiple agents
@product-manager Brainstorm feature requirements
@architect Model system architecture
@team-lead Model implementation timeline
@developers Act: Implement in parallel
@qa-engineers Act: Test implementation
@devops Deliver: Deploy and monitor
@documentation Deliver: Update all docs
```

### BMAD Benefits:
- **Consistency:** Structured approach for all tasks
- **Quality:** Each phase validates previous work
- **Efficiency:** Reduces rework and mistakes
- **Documentation:** Natural documentation through process
- **Collaboration:** Clear handoffs between phases

## ⚡ Workflow Automation

### Scheduled Tasks:
```bash
# Daily code review
0 9 * * * opencode run "/review changed --since yesterday"

# Weekly dependency audit
0 10 * * 1 opencode run "/audit dependencies"

# Monthly performance analysis
0 11 1 * * opencode run "/analyze @src/ --focus performance"
```

### Event-Triggered Workflows:
```bash
# On git push
git push && opencode run "/test && /review"

# On file change
inotifywait -m -e modify @src/ | while read; do
  opencode run "/analyze $REPLY"
done
```

### CI/CD Integration:
```yaml
# GitHub Actions workflow
name: OpenCode Review
on: [pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: anomalyco/opencode-action@v1
        with:
          command: "/review changed"
          token: ${{ secrets.OPENCODE_TOKEN }}
```

## 📊 Workflow Optimization

### Metrics to Track:
- Time from idea to implementation
- Bug rate per feature
- Test coverage changes
- Code review feedback quality
- Deployment frequency

### Optimization Strategies:
1. **Identify bottlenecks**: Which steps take longest?
2. **Parallelize**: Can steps run concurrently?
3. **Automate**: Which manual steps can be automated?
4. **Simplify**: Can workflows be made simpler?
5. **Standardize**: Create templates for common workflows

### Continuous Improvement:
```bash
# Regular workflow review
@analyzer Analyze our development workflow for improvements

# Implement improvements
[Build] Create workflow automation for repetitive tasks

# Measure impact
!opencode stats --workflow-metrics
```

## 🎯 Choosing the Right Workflow

### For New Features:
- **Complex features**: Explore → Plan → Code → Commit
- **Simple features**: Lightweight BMAD
- **Team projects**: Extended BMAD with multiple agents

### For Bug Fixes:
- **Complex bugs**: Bug Fix Workflow
- **Simple bugs**: Lightweight BMAD

### For UI/Design:
- **Visual changes**: Visual Iteration
- **Component updates**: TDD or Explore → Plan → Code → Commit

### For Refactoring:
- **Major refactoring**: Explore → Plan → Code → Commit
- **Minor improvements**: TDD

## 📋 Workflow Templates

### BMAD Template:
```markdown
# BMAD: [Feature Name]

## Brainstorm
- Requirements:
- Approaches:
- Constraints:

## Model
- Architecture:
- Implementation Plan:
- Testing Strategy:
- Timeline:

## Act
- Implementation Steps:
- Validation:
- Adjustments:

## Deliver
- Final Testing:
- Documentation:
- Deployment:
- Monitoring:
```

### Workflow Automation Template:
```bash
# .opencode/workflows/feature-development.sh
#!/bin/bash
# Feature Development Workflow

FEATURE_NAME=$1

echo "Starting feature development: $FEATURE_NAME"

# 1. Explore
@explore Analyze related code for $FEATURE_NAME

# 2. Plan
[Plan] Create implementation plan for $FEATURE_NAME

# 3. Implement
[Build] Implement $FEATURE_NAME as planned

# 4. Test
/test --feature $FEATURE_NAME

# 5. Review
/review changed

# 6. Deploy
/deploy --feature $FEATURE_NAME

echo "Feature development complete: $FEATURE_NAME"
```

By designing and optimizing your workflows, you can maximize OpenCode's potential and achieve consistent, high-quality results.

---

## 📚 What's Next?

- [FAQ & Troubleshooting](FAQ-TROUBLESHOOTING.md) - Common issues and solutions
- [Back to Main Guide](../README.md)

---

*Last updated: February 2026*