import * as vscode from 'vscode';

export class BitBakeFormatter implements vscode.DocumentFormattingEditProvider, vscode.DocumentRangeFormattingEditProvider {
    
    provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
        const fullRange = new vscode.Range(0, 0, document.lineCount - 1, document.lineAt(document.lineCount - 1).text.length);
        return this.formatRange(document, fullRange);
    }

    provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range): vscode.TextEdit[] {
        return this.formatRange(document, range);
    }

    private formatRange(document: vscode.TextDocument, range: vscode.Range): vscode.TextEdit[] {
        const text = document.getText(range);
        const formattedText = this.formatBitBakeText(text);
        
        if (text !== formattedText) {
            return [vscode.TextEdit.replace(range, formattedText)];
        }
        
        return [];
    }

    private formatBitBakeText(text: string): string {
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
            if (this.isMultilineStringStart(trimmedLine)) {
                inMultilineString = true;
            }
            
            if (inMultilineString) {
                formattedLines.push(line); // Preserve original formatting in multiline strings
                if (this.isMultilineStringEnd(trimmedLine)) {
                    inMultilineString = false;
                }
                continue;
            }
            
            // Handle function definitions
            if (this.isFunctionStart(trimmedLine)) {
                inFunction = true;
                formattedLines.push(this.formatLine(trimmedLine, 0));
                continue;
            }
            
            if (this.isFunctionEnd(trimmedLine)) {
                inFunction = false;
                formattedLines.push(this.formatLine(trimmedLine, 0));
                continue;
            }
            
            // Handle function body
            if (inFunction) {
                const indentLevel = this.getFunctionIndentLevel(trimmedLine);
                formattedLines.push(this.formatLine(trimmedLine, indentLevel + 1));
                continue;
            }
            
            // Handle regular lines
            formattedLines.push(this.formatLine(trimmedLine, 0));
        }
        
        return formattedLines.join('\n');
    }

    private isMultilineStringStart(line: string): boolean {
        // Check for multiline string patterns like """
        return line.includes('"""') || line.includes("'''");
    }

    private isMultilineStringEnd(line: string): boolean {
        // Check for multiline string end patterns
        return line.includes('"""') || line.includes("'''");
    }

    private isFunctionStart(line: string): boolean {
        // Check for function definitions: python function_name(), do_task(), etc.
        return /^(python\s+\w+\s*\(\s*\)\s*\{|do_\w+\s*\(\s*\)\s*\{|\w+\s*\(\s*\)\s*\{)/.test(line);
    }

    private isFunctionEnd(line: string): boolean {
        // Check for function end
        return line.trim() === '}';
    }

    private getFunctionIndentLevel(line: string): number {
        // Simple indentation logic for function bodies
        if (line.includes('{')) {
            return 1;
        }
        return 0;
    }

    private formatLine(line: string, indentLevel: number): string {
        const trimmedLine = line.trim();
        
        // Handle comments
        if (trimmedLine.startsWith('#')) {
            return '    '.repeat(indentLevel) + trimmedLine;
        }
        
        // Handle function definitions
        if (this.isFunctionStart(trimmedLine)) {
            return '    '.repeat(indentLevel) + this.formatFunctionStart(trimmedLine);
        }
        
        // Handle variable assignments
        if (this.isVariableAssignment(trimmedLine)) {
            return '    '.repeat(indentLevel) + this.formatVariableAssignment(trimmedLine);
        }
        
        // Handle inherit/include/require statements
        if (this.isInheritIncludeRequire(trimmedLine)) {
            return '    '.repeat(indentLevel) + this.formatInheritIncludeRequire(trimmedLine);
        }
        
        // Handle addtask/deltask statements
        if (this.isTaskStatement(trimmedLine)) {
            return '    '.repeat(indentLevel) + this.formatTaskStatement(trimmedLine);
        }
        
        // Default formatting
        return '    '.repeat(indentLevel) + trimmedLine;
    }

    private isVariableAssignment(line: string): boolean {
        // Check for variable assignments: VAR = "value", VAR += "value", etc.
        return /^[A-Z_][A-Z0-9_]*\s*[+?:]?=/.test(line);
    }

    private formatVariableAssignment(line: string): string {
        // Format variable assignments with proper spacing
        const match = line.match(/^([A-Z_][A-Z0-9_]*)\s*([+?:]?=)\s*(.*)$/);
        if (match) {
            const [, variable, operator, value] = match;
            return `${variable} ${operator} ${value}`;
        }
        return line;
    }

    private isInheritIncludeRequire(line: string): boolean {
        return /^(inherit|include|require)\s/.test(line);
    }

    private formatInheritIncludeRequire(line: string): string {
        // Format inherit/include/require statements
        const parts = line.split(/\s+/);
        return parts[0] + ' ' + parts.slice(1).join(' ');
    }

    private isTaskStatement(line: string): boolean {
        return /^(addtask|deltask)\s/.test(line);
    }

    private formatTaskStatement(line: string): string {
        // Format task statements
        const parts = line.split(/\s+/);
        return parts.join(' ');
    }

    private formatFunctionStart(line: string): string {
        // Format function definitions to ensure proper spacing
        const match = line.match(/^(.*?)\s*\(\s*\)\s*\{/);
        if (match) {
            return `${match[1]}() {`;
        }
        return line;
    }
}