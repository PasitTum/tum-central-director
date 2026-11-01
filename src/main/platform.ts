/**
 * TUM Sovereign Agent IDE — Cross-Platform OS & Shell Abstraction
 * Supports Windows, macOS, and Linux without platform lock-in.
 */

import os from 'os';
import path from 'path';

export interface PlatformInfo {
  isWindows: boolean;
  isMac: boolean;
  isLinux: boolean;
  platform: NodeJS.Platform;
  defaultShell: string;
  defaultShellArgs: string[];
  homeDir: string;
}

export class PlatformAdapter {
  private static _info: PlatformInfo | null = null;

  public static getInfo(): PlatformInfo {
    if (!this._info) {
      const plat = process.platform;
      const isWin = plat === 'win32';
      const isMac = plat === 'darwin';
      const isLin = plat === 'linux';

      let defaultShell = 'bash';
      let defaultShellArgs = ['-c'];

      if (isWin) {
        defaultShell = process.env.COMSPEC || 'cmd.exe';
        if (process.env.PSModulePath) {
          defaultShell = 'powershell.exe';
          defaultShellArgs = ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command'];
        } else {
          defaultShellArgs = ['/d', '/s', '/c'];
        }
      }

      this._info = {
        isWindows: isWin,
        isMac: isMac,
        isLinux: isLin,
        platform: plat,
        defaultShell,
        defaultShellArgs,
        homeDir: os.homedir()
      };
    }
    return this._info;
  }

  /**
   * Normalizes a path to POSIX style (forward slashes) for consistent cross-platform representation
   */
  public static normalizePath(targetPath: string): string {
    return targetPath.replace(/\\/g, '/');
  }

  /**
   * Resolves a cross-platform path relative to a base directory
   */
  public static resolve(base: string, ...segments: string[]): string {
    return this.normalizePath(path.resolve(base, ...segments));
  }

  /**
   * Opens a file or URL in the default browser/viewer cross-platform
   */
  public static async openInBrowser(targetPath: string): Promise<boolean> {
    const info = this.getInfo();
    let cmd = '';
    if (info.isWindows) {
      cmd = `start "" "${targetPath}"`;
    } else if (info.isMac) {
      cmd = `open "${targetPath}"`;
    } else {
      cmd = `xdg-open "${targetPath}"`;
    }
    const { exec } = await import('child_process');
    return new Promise((resolve) => {
      exec(cmd, (err) => resolve(!err));
    });
  }
}
