import Groq from "groq-sdk";
import * as vscode from "vscode";

const groq = new Groq({
  apiKey: "",
});

async function fetchExplanation(code) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `Explain the following code:\n\n${code}`,
        },
      ],
      model: "mixtral-8x7b-32768",
    });

    return (
      completion.choices[0]?.message?.content || "No explanation available"
    );
  } catch (error) {
    throw new Error("Error fetching code explanation: " + error.message);
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "code-explainer" is now active!'
  );

  let disposable = vscode.commands.registerCommand(
    "extension.explainCode",
    async () => {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        if (selectedText) {
          try {
            const explanation = await fetchExplanation(selectedText);

            vscode.window.showInformationMessage(
              "Code Explanation: " + explanation
            );
          } catch (error) {
            vscode.window.showErrorMessage(error.message);
          }
        } else {
          vscode.window.showWarningMessage("No code selected!");
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
