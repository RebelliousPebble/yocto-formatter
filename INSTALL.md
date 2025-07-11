# Installation and Usage Guide

## Installation Options

### Option 1: Install from VSIX file
1. Download the `yocto-formatter-1.0.0.vsix` file
2. Open VS Code
3. Go to Extensions view (Ctrl+Shift+X)
4. Click the "..." menu and select "Install from VSIX..."
5. Select the downloaded VSIX file

### Option 2: Install from source
1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run compile` to build the extension
4. Run `vsce package` to create the VSIX file (optional)

## Usage

1. **Open a BitBake file** (`.bb`, `.bbappend`, or `.inc`)
2. **Format the document** using one of these methods:
   - **Keyboard shortcut**: `Shift+Alt+F` (Windows/Linux) or `Shift+Option+F` (macOS)
   - **Right-click menu**: Select "Format Document"
   - **Command palette**: `Ctrl+Shift+P` → "Format Document"
   - **Custom command**: `Ctrl+Shift+P` → "Format BitBake Document"

## Features

- ✅ **Variable assignments** with consistent spacing
- ✅ **Function definitions** with proper formatting
- ✅ **Indentation** of function bodies
- ✅ **Comment preservation**
- ✅ **Multi-line string handling**
- ✅ **Task statements** (addtask, deltask)
- ✅ **Syntax highlighting** for BitBake files
- ✅ **Language configuration** with auto-closing pairs

## Example Before/After

### Before:
```bitbake
DESCRIPTION="Example recipe with poor formatting"
HOMEPAGE   =    "https://example.com"
LICENSE="MIT"

do_configure(){
./configure ${EXTRA_OECONF}
}

addtask custom_task after do_compile before do_install
```

### After:
```bitbake
DESCRIPTION = "Example recipe with poor formatting"
HOMEPAGE = "https://example.com"
LICENSE = "MIT"

do_configure() {
    ./configure ${EXTRA_OECONF}
}

addtask custom_task after do_compile before do_install
```

## Development

### Building
```bash
npm install
npm run compile
```

### Testing
```bash
npm test
```

### Packaging
```bash
vsce package
```

## File Structure

```
yocto-formatter/
├── src/
│   ├── extension.ts          # Main extension entry point
│   ├── formatter.ts          # BitBake formatter implementation
│   └── test/                 # Test files
├── syntaxes/
│   └── bitbake.tmLanguage.json  # Syntax highlighting
├── package.json              # Extension manifest
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Documentation
```