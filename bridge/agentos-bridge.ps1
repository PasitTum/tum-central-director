# TUM Sovereign AgentOS — Local Orca & Multi-Fleet Bridge
# Connects Central Director AgentOS to the local Orca runtime and agent fleet

param (
    [Parameter(Mandatory=$false)]
    [ValidateSet("status", "list-worktrees", "list-terminals", "send", "eval")]
    [string]$Action = "status",

    [Parameter(Mandatory=$false)]
    [string]$TargetTerminal = "",

    [Parameter(Mandatory=$false)]
    [string]$PromptText = ""
)

$ErrorActionPreference = "Stop"

function Get-OrcaStatus {
    Write-Host "[AGENTOS-BRIDGE] Checking Orca Runtime Connection..." -ForegroundColor Cyan
    try {
        $worktrees = orca worktree list
        Write-Host "[AGENTOS-BRIDGE] Connected to Orca successfully! Found worktrees:" -ForegroundColor Green
        $worktrees
    }
    catch {
        Write-Warning "[AGENTOS-BRIDGE] Could not connect directly to Orca: $_"
    }
}

function List-FleetTerminals {
    Write-Host "[AGENTOS-BRIDGE] Enumerating active agent terminals..." -ForegroundColor Cyan
    orca terminal list
}

function Send-AgentCommand {
    if (-not $TargetTerminal -or -not $PromptText) {
        Write-Error "Please specify both -TargetTerminal and -PromptText to send command."
        return
    }
    Write-Host "[AGENTOS-BRIDGE] Dispatching command to terminal: $TargetTerminal" -ForegroundColor Yellow
    orca terminal send --terminal $TargetTerminal --text $PromptText --enter
    Write-Host "[AGENTOS-BRIDGE] Command dispatched successfully." -ForegroundColor Green
}

switch ($Action) {
    "status" {
        Get-OrcaStatus
    }
    "list-worktrees" {
        orca worktree list
    }
    "list-terminals" {
        List-FleetTerminals
    }
    "send" {
        Send-AgentCommand
    }
    "eval" {
        Write-Host "[AGENTOS-BRIDGE] Running Sovereign Agent Evaluation Test Suite..." -ForegroundColor Cyan
        dotnet test D:\TUM\tum-trust-security\Tests\Tum.Trust.Security.Tests.csproj -f net8.0
        dotnet test D:\TUM\tum-socs\Tum.Socs.sln
        dotnet test D:\TUM\tum-quantum\Tum.Quantum.sln
    }
}
