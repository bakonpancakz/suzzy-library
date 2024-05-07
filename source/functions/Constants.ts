import { config } from 'dotenv';
import path from 'path';
config();

export const WEB_ADDR = process.env.WEB_ADDR || '127.0.0.1'
export const WEB_PORT = process.env.WEB_PORT || '80'
export const DIR_VERSION = process.env.COMMIT_ID || Date.now()
export const DIR_DOCS = path.join(process.cwd(), 'docs')
export const DIR_ASSETS = path.join(process.cwd(), 'assets')

export function Log(service: string, message: string) {
    process.stdout.write(`${new Date().toISOString()} | ${service}: ${message}\n`)
}

export function NormalizeString(someString: string): string {
    return someString
        .trim()
        .toLowerCase()
        .replace(/[^A-Za-z0-9 ]/g, '')
        .replace(/\s+/g, '-')
}