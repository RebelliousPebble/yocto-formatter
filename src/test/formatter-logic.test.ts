// Simple test to verify the formatter logic without VSCode dependencies
import * as assert from 'assert';

// Extract the formatting logic to test it independently
function formatBitBakeText(text: string): string {
    const lines = text.split('\n');
    const formattedLines: string[] = [];
    let inMultilineString = false;
    let inFunction = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();
        
        // Skip empty lines and preserve them
        if (trimmedLine === '') {
            formattedLines.push('');
            continue;
        }
        
        // Handle multi-line strings
        if (isMultilineStringStart(trimmedLine)) {
            inMultilineString = true;
        }
        
        if (inMultilineString) {
            formattedLines.push(line); // Preserve original formatting in multiline strings
            if (isMultilineStringEnd(trimmedLine)) {
                inMultilineString = false;
            }
            continue;
        }
        
        // Handle function definitions
        if (isFunctionStart(trimmedLine)) {
            inFunction = true;
            formattedLines.push(formatLine(trimmedLine, 0));
            continue;
        }
        
        if (isFunctionEnd(trimmedLine)) {
            inFunction = false;
            formattedLines.push(formatLine(trimmedLine, 0));
            continue;
        }
        
        // Handle function body
        if (inFunction) {
            const indentLevel = getFunctionIndentLevel(trimmedLine);
            formattedLines.push(formatLine(trimmedLine, indentLevel + 1));
            continue;
        }
        
        // Handle regular lines
        formattedLines.push(formatLine(trimmedLine, 0));
    }
    
    return formattedLines.join('\n');
}

function isMultilineStringStart(line: string): boolean {
    return line.includes('"""') || line.includes("'''");
}

function isMultilineStringEnd(line: string): boolean {
    return line.includes('"""') || line.includes("'''");
}

function isFunctionStart(line: string): boolean {
    return /^(python\s+\w+\s*\(\s*\)\s*\{|do_\w+\s*\(\s*\)\s*\{|\w+\s*\(\s*\)\s*\{)/.test(line);
}

function isFunctionEnd(line: string): boolean {
    return line.trim() === '}';
}

function getFunctionIndentLevel(line: string): number {
    if (line.includes('{')) {
        return 1;
    }
    return 0;
}

function formatLine(line: string, indentLevel: number): string {
    const trimmedLine = line.trim();
    
    // Handle comments
    if (trimmedLine.startsWith('#')) {
        return '    '.repeat(indentLevel) + trimmedLine;
    }
    
    // Handle function definitions
    if (isFunctionStart(trimmedLine)) {
        return '    '.repeat(indentLevel) + formatFunctionStart(trimmedLine);
    }
    
    // Handle variable assignments
    if (isVariableAssignment(trimmedLine)) {
        return '    '.repeat(indentLevel) + formatVariableAssignment(trimmedLine);
    }
    
    // Handle inherit/include/require statements
    if (isInheritIncludeRequire(trimmedLine)) {
        return '    '.repeat(indentLevel) + formatInheritIncludeRequire(trimmedLine);
    }
    
    // Handle addtask/deltask statements
    if (isTaskStatement(trimmedLine)) {
        return '    '.repeat(indentLevel) + formatTaskStatement(trimmedLine);
    }
    
    // Default formatting
    return '    '.repeat(indentLevel) + trimmedLine;
}

function isVariableAssignment(line: string): boolean {
    return /^[A-Z_][A-Z0-9_]*\s*[+?:]?=/.test(line);
}

function formatVariableAssignment(line: string): string {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)\s*([+?:]?=)\s*(.*)$/);
    if (match) {
        const [, variable, operator, value] = match;
        return `${variable} ${operator} ${value}`;
    }
    return line;
}

function isInheritIncludeRequire(line: string): boolean {
    return /^(inherit|include|require)\s/.test(line);
}

function formatInheritIncludeRequire(line: string): string {
    const parts = line.split(/\s+/);
    return parts[0] + ' ' + parts.slice(1).join(' ');
}

function isTaskStatement(line: string): boolean {
    return /^(addtask|deltask)\s/.test(line);
}

function formatTaskStatement(line: string): string {
    const parts = line.split(/\s+/);
    return parts.join(' ');
}

function formatFunctionStart(line: string): string {
    // Format function definitions to ensure proper spacing
    const match = line.match(/^(.*?)\s*\(\s*\)\s*\{/);
    if (match) {
        return `${match[1]}() {`;
    }
    return line;
}

// Tests
describe('BitBakeFormatter', () => {
    it('should format variable assignments correctly', () => {
        const input = `DESCRIPTION="Example recipe"
HOMEPAGE   =    "https://example.com"
LICENSE="MIT"`;
        
        const result = formatBitBakeText(input);
        
        assert.ok(result.includes('DESCRIPTION = "Example recipe"'));
        assert.ok(result.includes('HOMEPAGE = "https://example.com"'));
        assert.ok(result.includes('LICENSE = "MIT"'));
    });

    it('should format function definitions correctly', () => {
        const input = `do_configure(){
./configure \${EXTRA_OECONF}
}`;
        
        const result = formatBitBakeText(input);
        
        assert.ok(result.includes('do_configure() {'));
        assert.ok(result.includes('    ./configure ${EXTRA_OECONF}'));
        assert.ok(result.includes('}'));
    });

    it('should preserve comments', () => {
        const input = `# This is a comment
DESCRIPTION = "Example recipe"
# Another comment`;
        
        const result = formatBitBakeText(input);
        
        assert.ok(result.includes('# This is a comment'));
        assert.ok(result.includes('# Another comment'));
    });

    it('should handle addtask statements', () => {
        const input = `addtask custom_task after do_compile before do_install`;
        
        const result = formatBitBakeText(input);
        
        assert.ok(result.includes('addtask custom_task after do_compile before do_install'));
    });
});