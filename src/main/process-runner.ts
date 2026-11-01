/**
 * TUM Sovereign Agent IDE — Process & Subprocess Runner
 * Safely executes shell commands and streams execution output across OSes.
 */

import { spawn, exec } from 'child_process';
import { PlatformAdapter } from './platform.js';

export interface ProcessResult {
  success: boolean;
  code: number;
  stdout: string;
  stderr: string;
  durationMs: number;
}

export interface StreamCallbacks {
  onStdout?: (chunk: string) => void;
  onStderr?: (chunk: string) => void;
  onClose?: (code: number) => void;
}

export class ProcessRunner {
  /**
   * Run a command and wait for completion with a timeout
   */
  public static async execute(
    command: string,
    cwd: string = process.cwd(),
    timeoutMs: number = 30000
  ): Promise<ProcessResult> {
    const startTime = Date.now();
    return new Promise((resolve) => {
      exec(command, { cwd, timeout: timeoutMs, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
        const durationMs = Date.now() - startTime;
        resolve({
          success: !error,
          code: error ? (error.code || 1) : 0,
          stdout: stdout ? stdout.toString() : '',
          stderr: stderr ? stderr.toString() : '',
          durationMs
        });
      });
    });
  }

  /**
   * Run an executable with argument array safely (no shell escaping issues)
   */
  public static async executeArgs(
    executable: string,
    args: string[] = [],
    cwd: string = process.cwd(),
    timeoutMs: number = 45000
  ): Promise<ProcessResult> {
    const startTime = Date.now();
    return new Promise((resolve) => {
      let stdout = '';
      let stderr = '';
      let timedOut = false;

      const child = spawn(executable, args, { cwd, windowsHide: true });

      const timer = setTimeout(() => {
        timedOut = true;
        child.kill();
        resolve({
          success: false,
          code: -1,
          stdout,
          stderr: stderr ? `${stderr}\nExecution timed out after ${timeoutMs}ms.` : `Execution timed out after ${timeoutMs}ms.`,
          durationMs: Date.now() - startTime
        });
      }, timeoutMs);

      child.stdout?.on('data', (d) => { stdout += d.toString(); });
      child.stderr?.on('data', (d) => { stderr += d.toString(); });

      child.on('error', (err) => {
        if (timedOut) return;
        clearTimeout(timer);
        resolve({
          success: false,
          code: 1,
          stdout,
          stderr: err.message,
          durationMs: Date.now() - startTime
        });
      });

      child.on('close', (code) => {
        if (timedOut) return;
        clearTimeout(timer);
        resolve({
          success: code === 0,
          code: code ?? 0,
          stdout,
          stderr,
          durationMs: Date.now() - startTime
        });
      });
    });
  }

  /**
   * Spawn a streaming command session with real-time stdout/stderr handlers
   */
  public static spawnStreaming(
    command: string,
    args: string[] = [],
    cwd: string = process.cwd(),
    callbacks: StreamCallbacks = {}
  ) {
    const child = spawn(command, args, {
      cwd,
      shell: PlatformAdapter.getInfo().defaultShell,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    if (callbacks.onStdout && child.stdout) {
      child.stdout.on('data', (data) => callbacks.onStdout!(data.toString()));
    }

    if (callbacks.onStderr && child.stderr) {
      child.stderr.on('data', (data) => callbacks.onStderr!(data.toString()));
    }

    if (callbacks.onClose) {
      child.on('close', (code) => callbacks.onClose!(code || 0));
    }

    return child;
  }
}
