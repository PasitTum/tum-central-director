---
name: tum-quantum-provenance
description: Teaches AI agents how to bind human sovereign delegation (DAC) and sign code commits using Post-Quantum Cryptography (NIST FIPS 204 ML-DSA-65).
---

# TUM Quantum-Safe Provenance & Identity Skill

Use this skill when initializing an agent task or preparing Git commits that require post-quantum cryptographic verification.

## 1. Delegated Agent Credential (DAC)
Autonomous agents must not execute privileged operations without verifiable delegation from an authorized human sponsor (e.g. Chairman Pasit / CEO Office).

### Minting a DAC Token via MCP:
```json
{
  "tool": "tum_agentgate_mint",
  "arguments": {
    "humanSponsor": "คุณ Pasit (CEO)",
    "agentId": "agent_backend_01",
    "role": "API Systems Architect",
    "maxTokenBudgetUsd": 50.00
  }
}
```

The credential includes:
* `tokenId`: e.g. `dac_86b887f4...`
* `issuerHuman`: Name, masked citizen ID, anchor (`DOPA_THAID_OIDC_ES256_VERIFIED`)
* `cryptographicProof`: Algorithm (`NIST_FIPS_204_ML_DSA_65`), signature, public key thumbprint.

## 2. Signing Git Commits with PQC Trailers
Every commit produced by an authorized agent should include the cryptographic proof trailer:

```git
feat(auth): implement quantum-safe token validation [SCRUM-25]

---
TUM-Sovereign-Agent: agent_backend_01
TUM-Human-Sponsor: คุณ Pasit (CEO)
TUM-DAC-Token: dac_86b887f458bcdf78b9db32da
TUM-PQC-Algorithm: NIST_FIPS_204_ML_DSA_65
TUM-PQC-Signature: mldsa65_cea40e236c4a77fccd6194a88628...
```

## 3. Immediate Token Revocation
In case of anomalous agent behavior, tokens can be instantly revoked:
```bash
tum agentgate revoke dac_86b887f458bcdf78b9db32da
```
Or via MCP `tum_agentgate_verify` which will immediately return `TOKEN_REVOKED_BY_ADMIN`.
