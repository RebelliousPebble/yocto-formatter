# Yocto BitBake Formatter

A Visual Studio Code extension for formatting .bb and .bbappend files used in the Yocto project.

## Features

- **Automatic formatting** for BitBake recipe files (.bb) and append files (.bbappend)
- **Syntax highlighting** for BitBake-specific keywords and constructs
- **Proper indentation** for function bodies and nested structures
- **Variable assignment formatting** with consistent spacing
- **Comment preservation** and proper alignment
- **Multi-line string handling** to preserve original formatting

## Supported File Types

- `.bb` - BitBake recipe files
- `.bbappend` - BitBake append files  
- `.inc` - BitBake include files

## Usage

1. Open a `.bb` or `.bbappend` file in VS Code
2. Use one of the following methods to format:
   - Right-click and select "Format Document"
   - Use the keyboard shortcut `Shift+Alt+F` (or `Shift+Option+F` on macOS)
   - Run the command "Format BitBake Document" from the command palette

## Formatting Rules

The formatter applies the following formatting rules:

- **Variable assignments**: Consistent spacing around operators (`=`, `+=`, `?=`, `:=`)
- **Function definitions**: Proper indentation of function bodies
- **Comments**: Preserved and properly aligned
- **Multi-line strings**: Original formatting preserved
- **Keywords**: Proper spacing for `inherit`, `include`, `require`, `addtask`, etc.

## Example

Before formatting:
```bitbake
DESCRIPTION="Example recipe"
HOMEPAGE   =    "https://example.com"
LICENSE="MIT"

do_configure(){
./configure ${EXTRA_OECONF}
}

addtask custom_task after do_compile before do_install
```

After formatting:
```bitbake
DESCRIPTION = "Example recipe"
HOMEPAGE = "https://example.com"
LICENSE = "MIT"

do_configure() {
    ./configure ${EXTRA_OECONF}
}

addtask custom_task after do_compile before do_install
```

## Installation

1. Install the extension from the VS Code marketplace
2. Or install from VSIX file: `code --install-extension yocto-formatter.vsix`

## Development

To build from source:

```bash
npm install
npm run compile
```

To package the extension:

```bash
npm install -g vsce
vsce package
```

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT License - see LICENSE file for details.