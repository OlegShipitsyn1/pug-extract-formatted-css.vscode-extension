// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

const editor = vscode.window.activeTextEditor;

const lex = require('pug-lexer')
const clipboardy = require('clipboardy')

const getClassNames = str => {
	const lexAnalysisResult = lex(str)
	const classNames = []
	for (const lexicUnit of lexAnalysisResult) {
	  if (  lexicUnit.type === 'class' ) classNames.push(lexicUnit.val)
	}
	return classNames
  }
  
  const convertClassNamesToValidCss = classNames => classNames.reduce((acc, cn) => {
	acc += `.${cn} {}\n\n`
	return acc
  }, '')
  
  const copyResults = results => {
	clipboardy.writeSync(results)
  }
  
  const pugParserFacade = () => {
	const copiedText = editor.document.getText(editor.selection)
	const classNames = getClassNames(copiedText)
	const validsCss = convertClassNamesToValidCss(classNames)
	copyResults(validsCss)
  }

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('pug-class-extractor.extract-classes-from-pug', async function () {
		await pugParserFacade()
		vscode.window.showInformationMessage('CSS copied to clipboard!');
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
