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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryLog = exports.initializeTelemetryReporter = void 0;
// telemetry.ts
const vscode = __importStar(require("vscode"));
const extension_telemetry_1 = __importDefault(require("@vscode/extension-telemetry"));
const connectionString = 'InstrumentationKey=0a5f6d36-ee92-43e4-9b19-af4a82b3b386;IngestionEndpoint=https://germanywestcentral-1.in.applicationinsights.azure.com/;LiveEndpoint=https://germanywestcentral.livediagnostics.monitor.azure.com/;ApplicationId=97be5a27-1a4f-4c65-98c4-79c3e1371155';
let reporter;
// Initialize once in your extension's activate function
function initializeTelemetryReporter(context) {
    reporter = new extension_telemetry_1.default(connectionString);
    context.subscriptions.push(reporter);
}
exports.initializeTelemetryReporter = initializeTelemetryReporter;
function TelemetryLog(type, message, extraProperties = {}) {
    if (!reporter) {
        console.warn('Telemetry not initialized. Call init() first.');
        return;
    }
    const workspaceType = vscode.workspace.workspaceFolders
        ? (vscode.workspace.workspaceFolders.length > 1 ? 'multi-root' : 'single-root')
        : 'no-workspace';
    const properties = {
        message,
        workspaceType,
        timestamp: new Date().toISOString(),
        ...extraProperties
    };
    if (type === 'error') {
        reporter.sendTelemetryErrorEvent(type, properties);
    }
    else {
        reporter.sendTelemetryEvent(type, properties);
    }
}
exports.TelemetryLog = TelemetryLog;
// usage:
// import { initializeTelemetryReporter, TelemetryLog } from './telemetry';
//
// export function activate(context: vscode.ExtensionContext) {
//     initializeTelemetryReporter(context);
//
//     TelemetryLog('info', 'Extension activated');
//# sourceMappingURL=telemetry.js.map