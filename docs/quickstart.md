# OpenCode Quick Start Guide

## 📋 Overview
This guide helps you install OpenCode and get started in under 5 minutes.

## 🚀 Installation Methods

### Method 1: Install Script (Recommended)
```bash
curl -fsSL https://opencode.ai/install | bash
```

### Method 2: Package Managers

**Homebrew (macOS/Linux):**
```bash
brew install anomalyco/tap/opencode
```

**npm:**
```bash
npm install -g opencode-ai
```

**Bun:**
```bash
bun install -g opencode-ai
```

**pnpm:**
```bash
pnpm install -g opencode-ai
```

**Yarn:**
```bash
yarn global add opencode-ai
```

### Method 3: System Package Managers

**Arch Linux:**
```bash
sudo pacman -S opencode
```

**Arch Linux AUR (latest):**
```bash
paru -S opencode-bin
```

**Chocolatey (Windows):**
```bash
choco install opencode
```

**Scoop (Windows):**
```bash
scoop install opencode
```

### Method 4: Binary Download
1. Visit: https://github.com/anomalyco/opencode/releases
2. Download appropriate binary for your OS
3. Extract and add to PATH

## 🖥️ Windows Installation

### Recommended: Use WSL2 (Windows Subsystem for Linux)
```bash
# Enable WSL2
wsl --install

# Install Ubuntu or preferred distro
wsl --install -d Ubuntu

# Then use Linux installation methods above
```

### Native Windows Options:
```bash
# Using Chocolatey
choco install opencode

# Using Scoop
scoop install opencode

# Using npm
npm install -g opencode-ai

# Using Docker
docker run -it --rm ghcr.io/anomalyco/opencode
```

## ✅ Verification

After installation, verify OpenCode is working:

```bash
# Check version
opencode --version

# Start OpenCode TUI
opencode

# Or run a quick test
opencode run "Hello, what version of OpenCode am I running?"
```

## 🔧 Post-Installation Setup

### 1. First Run Configuration
```bash
# Start OpenCode
opencode

# You'll see the welcome screen
# Press Enter to continue
```

### 2. Configure Your First Provider
```bash
# In the TUI, run:
/connect

# Follow the prompts to add:
# 1. OpenCode Zen (recommended for beginners)
# 2. Or another provider (OpenAI, Anthropic, etc.)
```

### 3. Initialize a Project
```bash
# Navigate to your project
cd /path/to/your/project

# Start OpenCode in project context
opencode .

# Initialize project analysis
/init
```

## 🛠️ Troubleshooting Installation

### Common Issues:

**1. "Command not found: opencode"**
```bash
# Check installation path
which opencode

# Add to PATH if needed
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

**2. Permission Errors**
```bash
# Fix permissions for global install
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

**3. Node.js Version Issues**
```bash
# Check Node.js version
node --version

# Update if needed (using nvm)
nvm install 18
nvm use 18
```

**4. Windows WSL Setup**
```bash
# Enable WSL2
wsl --install

# Install Ubuntu or preferred distro
wsl --install -d Ubuntu

# Then use Linux installation methods
```

## 🔄 Updating OpenCode

### Update Methods:
```bash
# Using install script (re-run)
curl -fsSL https://opencode.ai/install | bash

# Using npm
npm update -g opencode-ai

# Using Homebrew
brew update
brew upgrade opencode

# Check for updates
opencode --version
# Compare with latest: https://github.com/anomalyco/opencode/releases
```

## 🗑️ Uninstallation

### Remove OpenCode:
```bash
# npm
npm uninstall -g opencode-ai

# Homebrew
brew uninstall opencode

# Remove config files (optional)
rm -rf ~/.config/opencode
rm -rf ~/.opencode
```

> **💡 Pro Tip**: Keep your config files (`~/.config/opencode/`) if you plan to reinstall, as they contain your provider configurations and customizations.

## 🎯 Next Steps

After successful installation:

1. **Configure Zen** (recommended for beginners) or your preferred provider
2. **Initialize a test project** to explore features
3. **Try basic commands** like `/help` and `/models`
4. **Explore the TUI** with Tab key for agent switching

You're now ready to dive into OpenCode's powerful features!

---

## 📚 What's Next?

- [Core Concepts](../README.md#-core-concepts-30-minutes) - Learn Zen, TUI, and Agents
- [Zen Model Router Guide](ZEN-GUIDE.md) - Deep dive into Zen
- [TUI Mastery Guide](TUI-MASTERY.md) - Master the terminal interface
- [Agents Guide](AGENTS-GUIDE.md) - Work with AI agents

---

*Last updated: February 2026*