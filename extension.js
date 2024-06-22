const vscode = require("vscode");
const axios = require("axios");
const { XMLParser } = require("fast-xml-parser");

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  const res = await axios.get("https://blog.webdevsimplified.com/rss.xml");

  // Create an instance of XMLParser
  const parser = new XMLParser();
  let articles = parser.parse(res.data).rss.channel.item.map((article) => {
    return {
      label: article.title,
      detail: article.description,
      link: article.link,
    };
  });
  console.log(articles);

  const disposable = vscode.commands.registerCommand(
    "search-blog.shahal",
    async function () {
      const selectedArticle = await vscode.window.showQuickPick(articles, {
        matchOnDetail: true,
      });
      if (selectedArticle == null) return;
      vscode.env.openExternal(vscode.Uri.parse(String(selectedArticle.link)));
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
