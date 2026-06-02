import React, { useState } from 'react';
import './JwtPlayground.css';

const JwtPlayground = () => {
    // Left Half: Generator State (3 text boxes, 1 button)
    const [name, setName] = useState('Anil Kumar');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [secret, setSecret] = useState('supersecret12345678901234567890');
    const [generatedToken, setGeneratedToken] = useState('');
    
    // Right Half: Verifier State (1 text box, 1 button)
    const [tokenToVerify, setTokenToVerify] = useState('');
    const [verificationResult, setVerificationResult] = useState(null);
    const [decodedHeader, setDecodedHeader] = useState(null);
    const [decodedPayload, setDecodedPayload] = useState(null);

    // Helpers for Base64Url encoding/decoding
    const stringToBase64Url = (str) => {
        const bytes = new TextEncoder().encode(str);
        let binary = '';
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    };

    const arrayBufferToBase64Url = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    };

    const base64UrlToString = (base64url) => {
        try {
            let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
            while (base64.length % 4) {
                base64 += '=';
            }
            const binary = window.atob(base64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            return new TextDecoder().decode(bytes);
        } catch (e) {
            throw new Error("Invalid base64 encoding");
        }
    };

    // HMAC-SHA256 Signature generation using Web Crypto API
    const generateSignature = async (message, secretKey) => {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secretKey);
        const messageData = encoder.encode(message);
        
        const cryptoKey = await window.crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        
        const sigBuffer = await window.crypto.subtle.sign(
            'HMAC',
            cryptoKey,
            messageData
        );
        
        return arrayBufferToBase64Url(sigBuffer);
    };

    // Action: Generate JWT (Left Side)
    const handleGenerate = async (e) => {
        e.preventDefault();
        try {
            const header = {
                alg: "HS256",
                typ: "JWT"
            };
            const payload = {
                name: name.trim(),
                date: date.trim(),
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 86400 // 24 hours expiry
            };

            const headerB64 = stringToBase64Url(JSON.stringify(header));
            const payloadB64 = stringToBase64Url(JSON.stringify(payload));
            const message = `${headerB64}.${payloadB64}`;
            
            const signatureB64 = await generateSignature(message, secret);
            const token = `${message}.${signatureB64}`;
            
            setGeneratedToken(token);
            // Auto fill the verifier token input for ease of testing
            setTokenToVerify(token);
            setVerificationResult(null);
            setDecodedHeader(null);
            setDecodedPayload(null);
        } catch (err) {
            alert("Generation failed: " + err.message);
        }
    };

    // Action: Verify & Extract Values (Right Side)
    const handleVerify = async (e) => {
        e.preventDefault();
        if (!tokenToVerify.trim()) {
            setVerificationResult({
                status: 'error',
                message: 'Token value cannot be empty.'
            });
            return;
        }

        const parts = tokenToVerify.trim().split('.');
        if (parts.length !== 3) {
            setVerificationResult({
                status: 'error',
                message: 'Invalid JWT format. Must contain exactly 3 parts separated by dots.'
            });
            setDecodedHeader(null);
            setDecodedPayload(null);
            return;
        }

        const [headerB64, payloadB64, signatureB64] = parts;

        try {
            // Decode Header & Payload
            const headerStr = base64UrlToString(headerB64);
            const payloadStr = base64UrlToString(payloadB64);
            
            const headerObj = JSON.parse(headerStr);
            const payloadObj = JSON.parse(payloadStr);
            
            setDecodedHeader(headerObj);
            setDecodedPayload(payloadObj);

            // Recompute Signature to compare
            const message = `${headerB64}.${payloadB64}`;
            const computedSignatureB64 = await generateSignature(message, secret);

            if (computedSignatureB64 === signatureB64) {
                // Check expiry
                if (payloadObj.exp && payloadObj.exp < Math.floor(Date.now() / 1000)) {
                    setVerificationResult({
                        status: 'warning',
                        message: 'Signature is VALID, but token has expired. Value extracted successfully.'
                    });
                } else {
                    setVerificationResult({
                        status: 'success',
                        message: 'Signature is VALID! Token authenticity confirmed and values extracted.'
                    });
                }
            } else {
                setVerificationResult({
                    status: 'invalid',
                    message: 'Signature is INVALID! The token signature does not match the secret key.'
                });
            }
        } catch (err) {
            setVerificationResult({
                status: 'error',
                message: `Failed to decode/extract: ${err.message}`
            });
            setDecodedHeader(null);
            setDecodedPayload(null);
        }
    };

    // Split generated token into colored parts for visual aid
    const renderTokenParts = (t) => {
        if (!t) return null;
        const parts = t.split('.');
        if (parts.length !== 3) return <span>{t}</span>;
        return (
            <div className="jwt-colored-display">
                <span className="jwt-part-header">{parts[0]}</span>
                <span className="jwt-part-dot">.</span>
                <span className="jwt-part-payload">{parts[1]}</span>
                <span className="jwt-part-dot">.</span>
                <span className="jwt-part-signature">{parts[2]}</span>
            </div>
        );
    };

    return (
        <div className="jwt-playground">
            <div className="pg-header">
                <span className="pg-subtitle">SECURITY TOOLS</span>
                <h1 className="pg-title">JWT Token Playground</h1>
                <p className="pg-description">
                    Explore JSON Web Tokens. Generate tokens containing custom Name and Date values, and verify/extract them instantly.
                </p>
            </div>

            <div className="pg-two-columns">
                {/* LEFT HALF: GENERATOR */}
                <div className="pg-half pg-left">
                    <div className="pg-card">
                        <div className="pg-card-header">
                            <span className="badge">01</span>
                            <h2>Token Generator</h2>
                        </div>
                        
                        <form onSubmit={handleGenerate} className="pg-form">
                            <div className="form-group">
                                <label className="form-label">Name Section</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Secret Key</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Secret key for signing"
                                    value={secret}
                                    onChange={(e) => setSecret(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn-action">
                                <span>Generate JWT Token</span>
                            </button>
                        </form>

                        {generatedToken && (
                            <div className="token-output-section">
                                <span className="section-label">Generated JWT Token:</span>
                                <div className="token-box">
                                    {renderTokenParts(generatedToken)}
                                </div>
                                <button 
                                    className="btn-copy"
                                    onClick={() => {
                                        navigator.clipboard.writeText(generatedToken);
                                        alert("Token copied to clipboard!");
                                    }}
                                >
                                    Copy Token
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT HALF: VERIFIER */}
                <div className="pg-half pg-right">
                    <div className="pg-card">
                        <div className="pg-card-header">
                            <span className="badge">02</span>
                            <h2>Token Extractor</h2>
                        </div>

                        <form onSubmit={handleVerify} className="pg-form">
                            <div className="form-group">
                                <label className="form-label">JWT Token Value</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Paste JWT token value here..."
                                    value={tokenToVerify}
                                    onChange={(e) => setTokenToVerify(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn-action btn-secondary">
                                <span>Extract the Value</span>
                            </button>
                        </form>

                        {verificationResult && (
                            <div className="verification-output">
                                <div className={`verify-banner banner-${verificationResult.status}`}>
                                    <span className="banner-icon">
                                        {verificationResult.status === 'success' ? '✓' : '✗'}
                                    </span>
                                    <span className="banner-text">{verificationResult.message}</span>
                                </div>

                                {decodedPayload && (
                                    <div className="decoded-data">
                                        <div className="extracted-values-box">
                                            <h3 className="section-label">Extracted Data Claims</h3>
                                            <div className="extracted-fields-grid">
                                                <div className="extracted-field">
                                                    <span className="extracted-label">Name:</span>
                                                    <span className="extracted-value font-highlight">{decodedPayload.name || 'N/A'}</span>
                                                </div>
                                                <div className="extracted-field">
                                                    <span className="extracted-label">Date:</span>
                                                    <span className="extracted-value font-highlight">{decodedPayload.date || 'N/A'}</span>
                                                </div>
                                                <div className="extracted-field">
                                                    <span className="extracted-label">Issued At (iat):</span>
                                                    <span className="extracted-value">{decodedPayload.iat ? new Date(decodedPayload.iat * 1000).toLocaleString() : 'N/A'}</span>
                                                </div>
                                                <div className="extracted-field">
                                                    <span className="extracted-label">Expires At (exp):</span>
                                                    <span className="extracted-value">{decodedPayload.exp ? new Date(decodedPayload.exp * 1000).toLocaleString() : 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="decoded-block">
                                            <span className="section-label jwt-header-color">Decoded Header (ALGORITHM & TYPE)</span>
                                            <pre className="json-pre">{JSON.stringify(decodedHeader, null, 2)}</pre>
                                        </div>
                                        <div className="decoded-block">
                                            <span className="section-label jwt-payload-color">Decoded Payload JSON</span>
                                            <pre className="json-pre">{JSON.stringify(decodedPayload, null, 2)}</pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JwtPlayground;
