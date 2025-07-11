import * as vscode from 'vscode';
import { BitBakeFormatter } from './formatter';

export function activate(context: vscode.ExtensionContext) {
    // Register the document formatter
    const formatter = new BitBakeFormatter();
    
    const disposables = [
        vscode.languages.registerDocumentFormattingEditProvider('bitbake', formatter),
        vscode.languages.registerDocumentRangeFormattingEditProvider('bitbake', formatter),
        vscode.commands.registerCommand('yocto-formatter.formatDocument', () => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const document = editor.document;
                if (document.languageId === 'bitbake') {
                    vscode.commands.executeCommand('editor.action.formatDocument');
                }
            }
        })
    ];

    context.subscriptions.push(...disposables);
    
    console.log('Yocto BitBake Formatter is now active!');
}

export function deactivate() {}