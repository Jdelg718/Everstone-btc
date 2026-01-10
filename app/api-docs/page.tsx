import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'API Documentation - Everstone',
    description: 'Public API documentation for accessing Everstone memorials',
};

export default function ApiDocsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-stone-950 to-black py-16 px-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-serif text-white mb-4">
                    Everstone Public API
                </h1>
                <p className="text-stone-400 mb-8">
                    Access public memorials programmatically. All endpoints return JSON and support CORS for browser requests.
                </p>

                {/* Base URL */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-white mb-4">Base URL</h2>
                    <code className="bg-stone-900 text-[var(--accent-gold)] px-4 py-2 rounded block">
                        https://everstonebtc.com/api/v1
                    </code>
                </section>

                {/* Endpoints */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-white mb-6">Endpoints</h2>

                    {/* List Memorials */}
                    <div className="bg-stone-900/50 rounded-lg p-6 mb-6 border border-stone-800">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-green-600/20 text-green-400 text-xs font-mono px-2 py-1 rounded">
                                GET
                            </span>
                            <code className="text-white">/memorials</code>
                        </div>
                        <p className="text-stone-400 mb-4">
                            List all public, anchored memorials with pagination.
                        </p>
                        <h4 className="text-stone-300 font-medium mb-2">Query Parameters</h4>
                        <table className="w-full text-sm mb-4">
                            <thead>
                                <tr className="text-left text-stone-500">
                                    <th className="pb-2">Parameter</th>
                                    <th className="pb-2">Default</th>
                                    <th className="pb-2">Description</th>
                                </tr>
                            </thead>
                            <tbody className="text-stone-300">
                                <tr>
                                    <td className="py-1"><code>page</code></td>
                                    <td className="py-1">1</td>
                                    <td className="py-1">Page number</td>
                                </tr>
                                <tr>
                                    <td className="py-1"><code>limit</code></td>
                                    <td className="py-1">20</td>
                                    <td className="py-1">Items per page (max: 100)</td>
                                </tr>
                                <tr>
                                    <td className="py-1"><code>order</code></td>
                                    <td className="py-1">desc</td>
                                    <td className="py-1">Sort by date: asc or desc</td>
                                </tr>
                            </tbody>
                        </table>
                        <h4 className="text-stone-300 font-medium mb-2">Example Response</h4>
                        <pre className="bg-stone-950 p-4 rounded text-sm overflow-x-auto text-stone-300">
                            {`{
  "data": [
    {
      "slug": "john-doe",
      "fullName": "John Doe",
      "birthDate": "1950-01-15",
      "deathDate": "2025-12-01",
      "epitaph": "Forever in our hearts",
      "txid": "f4184fc596403b9d...",
      "blockHeight": 880123,
      "url": "https://everstonebtc.com/m/john-doe"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 8,
    "totalPages": 1,
    "hasMore": false
  }
}`}
                        </pre>
                    </div>

                    {/* Get Single Memorial */}
                    <div className="bg-stone-900/50 rounded-lg p-6 mb-6 border border-stone-800">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-green-600/20 text-green-400 text-xs font-mono px-2 py-1 rounded">
                                GET
                            </span>
                            <code className="text-white">/memorials/:slug</code>
                        </div>
                        <p className="text-stone-400 mb-4">
                            Get a single memorial by its unique slug.
                        </p>
                        <h4 className="text-stone-300 font-medium mb-2">Example</h4>
                        <code className="bg-stone-950 text-stone-300 px-4 py-2 rounded block text-sm">
                            GET /api/v1/memorials/john-doe
                        </code>
                    </div>

                    {/* Lookup by TXID */}
                    <div className="bg-stone-900/50 rounded-lg p-6 border border-stone-800">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-green-600/20 text-green-400 text-xs font-mono px-2 py-1 rounded">
                                GET
                            </span>
                            <code className="text-white">/memorials/by-txid/:txid</code>
                        </div>
                        <p className="text-stone-400 mb-4">
                            Lookup a memorial by its Bitcoin transaction ID.
                        </p>
                        <h4 className="text-stone-300 font-medium mb-2">Example</h4>
                        <code className="bg-stone-950 text-stone-300 px-4 py-2 rounded block text-sm break-all">
                            GET /api/v1/memorials/by-txid/f4184fc596403b9da02bae9e1a2e0fa6...
                        </code>
                    </div>
                </section>

                {/* Rate Limits */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold text-white mb-4">Rate Limits</h2>
                    <p className="text-stone-400">
                        Public API requests are limited to <strong className="text-white">100 requests per minute</strong> per IP address.
                        Rate limit info is included in response headers:
                    </p>
                    <ul className="text-stone-400 mt-4 space-y-2 list-disc list-inside">
                        <li><code className="text-stone-300">X-RateLimit-Limit</code> — Max requests per window</li>
                        <li><code className="text-stone-300">X-RateLimit-Remaining</code> — Requests remaining</li>
                        <li><code className="text-stone-300">X-RateLimit-Reset</code> — Unix timestamp when window resets</li>
                    </ul>
                </section>

                {/* Errors */}
                <section>
                    <h2 className="text-2xl font-semibold text-white mb-4">Errors</h2>
                    <p className="text-stone-400 mb-4">
                        Errors return a JSON object with an <code className="text-stone-300">error</code> field:
                    </p>
                    <pre className="bg-stone-950 p-4 rounded text-sm text-stone-300">
                        {`{
  "error": "Memorial not found"
}`}
                    </pre>
                    <table className="w-full text-sm mt-4">
                        <thead>
                            <tr className="text-left text-stone-500">
                                <th className="pb-2">Status</th>
                                <th className="pb-2">Meaning</th>
                            </tr>
                        </thead>
                        <tbody className="text-stone-300">
                            <tr>
                                <td className="py-1">400</td>
                                <td className="py-1">Bad request (invalid parameters)</td>
                            </tr>
                            <tr>
                                <td className="py-1">404</td>
                                <td className="py-1">Memorial not found or not public</td>
                            </tr>
                            <tr>
                                <td className="py-1">429</td>
                                <td className="py-1">Rate limit exceeded</td>
                            </tr>
                            <tr>
                                <td className="py-1">500</td>
                                <td className="py-1">Internal server error</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    );
}
