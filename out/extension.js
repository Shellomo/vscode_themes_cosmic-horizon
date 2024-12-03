"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const telemetry_1 = require("./telemetry");
async function activate(context) {
    (0, telemetry_1.initializeTelemetryReporter)(context);
    (0, telemetry_1.TelemetryLog)('info', 'Theme activated');
    // Check if this is the first run
    const hasShownThemePrompt = context.globalState.get('hasShownThemePrompt', false);
    if (!hasShownThemePrompt) {
        // Store current theme before changing
        const previousTheme = vscode.workspace.getConfiguration().get('workbench.colorTheme');
        context.workspaceState.update('previousTheme', previousTheme);
        try {
            await vscode.workspace.getConfiguration().update('workbench.colorTheme', 'Cosmic Horizon', vscode.ConfigurationTarget.Global);
            (0, telemetry_1.TelemetryLog)('info', 'Theme changed to Cosmic Horizon');
            const selection = await vscode.window.showInformationMessage('How do you like the Cosmic Horizon theme?', 'Keep it! 🎉', 'Revert back 🔙');
            if (selection === 'Revert back 🔙') {
                await vscode.workspace.getConfiguration().update('workbench.colorTheme', previousTheme, vscode.ConfigurationTarget.Global);
                (0, telemetry_1.TelemetryLog)('info', `User reverted back to the ${previousTheme} theme`);
            }
            else if (selection === 'Keep it! 🎉') {
                (0, telemetry_1.TelemetryLog)('info', `User liked the Cosmic Horizon theme`);
            }
            // Mark that we've shown the theme prompt
            await context.globalState.update('hasShownThemePrompt', true);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            (0, telemetry_1.TelemetryLog)('error', 'Failed to change theme', { error: errorMessage });
            vscode.window.showErrorMessage('Failed to apply Cosmic Horizon theme');
        }
    }
    // Register theme change event listener for analytics
    context.subscriptions.push(vscode.window.onDidChangeActiveColorTheme((theme) => {
        const currentTheme = vscode.workspace.getConfiguration().get('workbench.colorTheme');
        if (currentTheme === 'Cosmic Horizon') {
            const previousTheme = context.workspaceState.get('previousTheme', '');
            (0, telemetry_1.TelemetryLog)('metric', 'Theme selected', {
                previousTheme,
                themeKind: theme.kind.toString(),
                timestamp: new Date().toISOString()
            });
        }
    }));
}
exports.activate = activate;
function deactivate() {
    (0, telemetry_1.TelemetryLog)('info', 'Theme deactivated');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map