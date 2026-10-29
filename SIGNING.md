# Signing the FireClient installer (owner steps)

The website cannot sign anything. Signing needs a private key that only you should hold. The website only
**shows** the status from `content/signing.json` and never claims more than that file says.

## What each option really gives you
| Option | What it proves | Windows SmartScreen |
|---|---|---|
| Unsigned (today) | nothing | usually warns |
| **Self-signed** | the same key signed every build; users can compare the thumbprint | **still warns** (Windows does not trust self-signed certificates by default) |
| Certificate from a public CA, or Microsoft's Trusted Signing service | who signed it, trusted by Windows | warns less over time as the file builds reputation. Check current requirements and prices with the provider |

A signature never proves software is safe. So the site says "Self-signed" or "Signed", never "verified".
Do **not** ask users to install your self-signed certificate as a trusted root: that weakens their security.

## Self-signed, step by step (PowerShell, on a Windows PC)
```powershell
$cert = New-SelfSignedCertificate -Type CodeSigningCert -Subject "CN=FireClient" `
  -CertStoreLocation Cert:\CurrentUser\My -KeyAlgorithm RSA -KeyLength 3072 `
  -HashAlgorithm SHA256 -NotAfter (Get-Date).AddYears(3)
Set-AuthenticodeSignature -FilePath .\FireClient-Setup.exe -Certificate $cert `
  -TimestampServer "http://timestamp.digicert.com" -HashAlgorithm SHA256
$cert.Thumbprint      # note this value
Get-AuthenticodeSignature .\FireClient-Setup.exe | Format-List Status, StatusMessage, SignerCertificate
```
Expected for a self-signed build: a status about an untrusted root certificate (not `Valid`). That is normal.

Rules:
1. Keep the private key (and any `.pfx` export) **secret**. Never commit it. In GitHub Actions store it as an encrypted secret.
2. Sign the file **before** you compute its SHA-256 and before you upload it to the release. Signing changes the file's hash.
3. Re-check the final uploaded file with `Get-AuthenticodeSignature` before touching the website.

## Update the website (only after step 3 above)
Edit `content/signing.json`:
```json
{ "status": "self-signed", "subject": "CN=FireClient", "thumbprint": "THE 40 HEX CHARACTERS", "updated": "YYYY-MM-DD" }
```
Use `"trusted"` only for a certificate from a public CA. If the thumbprint is missing or malformed, the site
falls back to "Not signed yet" on purpose. Then run `node --test tools/test.mjs` and deploy.
