"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueId = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
function generateUniqueId() {
    return node_crypto_1.default.randomUUID();
}
exports.generateUniqueId = generateUniqueId;
