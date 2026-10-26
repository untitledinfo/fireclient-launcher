/* Incremental SHA-256 for the download verifier (window.FCHash, or require() in Node tests).
   WebCrypto cannot hash in pieces, so large files would have to be read into memory at once. This file
   hashes in chunks instead: bounded memory, a progress callback and cancellation. Small files use WebCrypto.
   The file never leaves the computer; nothing here makes a network request. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.FCHash = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ]);

  function Sha256() {
    this.h = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
    this.buf = new Uint8Array(64); this.fill = 0; this.len = 0; this.w = new Uint32Array(64);
  }
  Sha256.prototype._block = function (b, o) {
    var w = this.w, h = this.h, i, t1, t2;
    for (i = 0; i < 16; i++, o += 4) w[i] = (b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3];
    for (i = 16; i < 64; i++) {
      var a = w[i - 15], c = w[i - 2];
      w[i] = (((c >>> 17) | (c << 15)) ^ ((c >>> 19) | (c << 13)) ^ (c >>> 10)) + w[i - 7] + (((a >>> 7) | (a << 25)) ^ ((a >>> 18) | (a << 14)) ^ (a >>> 3)) + w[i - 16] | 0;
    }
    var A = h[0], B = h[1], C = h[2], D = h[3], E = h[4], F = h[5], G = h[6], H = h[7];
    for (i = 0; i < 64; i++) {
      t1 = H + (((E >>> 6) | (E << 26)) ^ ((E >>> 11) | (E << 21)) ^ ((E >>> 25) | (E << 7))) + ((E & F) ^ (~E & G)) + K[i] + w[i] | 0;
      t2 = (((A >>> 2) | (A << 30)) ^ ((A >>> 13) | (A << 19)) ^ ((A >>> 22) | (A << 10))) + ((A & B) ^ (A & C) ^ (B & C)) | 0;
      H = G; G = F; F = E; E = D + t1 | 0; D = C; C = B; B = A; A = t1 + t2 | 0;
    }
    h[0] += A; h[1] += B; h[2] += C; h[3] += D; h[4] += E; h[5] += F; h[6] += G; h[7] += H;
  };
  Sha256.prototype.update = function (data) {
    var i = 0, n = data.length; this.len += n;
    if (this.fill) {
      while (i < n && this.fill < 64) this.buf[this.fill++] = data[i++];
      if (this.fill === 64) { this._block(this.buf, 0); this.fill = 0; }
    }
    for (; i + 64 <= n; i += 64) this._block(data, i);
    while (i < n) this.buf[this.fill++] = data[i++];
    return this;
  };
  Sha256.prototype.hex = function () {
    var bits = this.len * 8, pad = new Uint8Array(((this.fill < 56 ? 56 : 120) - this.fill) + 8);
    pad[0] = 0x80;
    var hi = Math.floor(bits / 4294967296), lo = bits >>> 0, e = pad.length - 8;
    pad[e] = hi >>> 24; pad[e + 1] = hi >>> 16; pad[e + 2] = hi >>> 8; pad[e + 3] = hi;
    pad[e + 4] = lo >>> 24; pad[e + 5] = lo >>> 16; pad[e + 6] = lo >>> 8; pad[e + 7] = lo;
    var saved = this.len; this.update(pad); this.len = saved;
    var out = ""; for (var i = 0; i < 8; i++) out += ("00000000" + (this.h[i] >>> 0).toString(16)).slice(-8);
    return out;
  };

  function hexOf(buf) { return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join(""); }
  function cancelled() { var e = new Error("Cancelled"); e.name = "AbortError"; return e; }

  // Hashes a File/Blob. opts: { onProgress(fraction), signal (AbortSignal), chunkSize, smallLimit }.
  // Rejects with name "AbortError" when cancelled.
  async function hashFile(file, opts) {
    opts = opts || {};
    var chunk = opts.chunkSize || 8 * 1024 * 1024, small = opts.smallLimit === undefined ? 32 * 1024 * 1024 : opts.smallLimit;
    var signal = opts.signal, tick = opts.onProgress || function () {};
    if (signal && signal.aborted) throw cancelled();
    var subtle = typeof crypto !== "undefined" && crypto.subtle;
    if (subtle && file.size <= small) {
      var d = await subtle.digest("SHA-256", await file.arrayBuffer());
      if (signal && signal.aborted) throw cancelled();
      tick(1); return hexOf(d);
    }
    var s = new Sha256(), pos = 0;
    while (pos < file.size) {
      if (signal && signal.aborted) throw cancelled();
      s.update(new Uint8Array(await file.slice(pos, pos + chunk).arrayBuffer()));
      pos += chunk; tick(Math.min(1, pos / file.size));
      await new Promise(function (r) { setTimeout(r, 0); }); // keep the page responsive and cancel clickable
    }
    if (signal && signal.aborted) throw cancelled();
    tick(1); return s.hex();
  }

  // Accepts what people paste: "SHA-256: ABC...", extra spaces, a "sha256:" prefix, or a "hash  filename" line.
  function normalizeHash(s) {
    var t = String(s || "").trim().toLowerCase().replace(/^sha-?256\s*[:=]?\s*/, "");
    var tok = t.split(/\s+/).filter(function (x) { return /^[0-9a-f]{64}$/.test(x); })[0];
    return tok || t.replace(/\s+/g, "");
  }
  function isSha256(s) { return /^[0-9a-f]{64}$/.test(s); }

  return { Sha256: Sha256, hashFile: hashFile, normalizeHash: normalizeHash, isSha256: isSha256 };
});
