import Link from 'next/link';

export default function TermsOfUsePage() {
    return (
        <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
            {/* Header */}
            <div className="border-b border-white/10">
                <div className="max-w-[1400px] mx-auto px-[4vw] py-8 flex items-center justify-between">
                    <Link href="/" className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/60 hover:text-white transition-colors">
                        ← Back to Home
                    </Link>
                    <span className="font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase">Legal</span>
                </div>
            </div>

            {/* Content */}
            <article className="max-w-[800px] mx-auto px-[4vw] py-20">
                <header className="mb-16">
                    <span className="font-mono text-[10px] tracking-[0.5em] text-white/40 uppercase block mb-4">
                        Legal Document
                    </span>
                    <h1 className="text-[clamp(36px,6vw,64px)] font-light tracking-tight leading-[1.1]">
                        Terms of <span className="italic font-serif">Use.</span>
                    </h1>
                    <p className="font-mono text-[11px] text-white/40 mt-6">Last Updated: December 2025</p>
                </header>

                <div className="space-y-12 text-white/70 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-light mb-4 text-white">1. Acceptance of Terms</h2>
                        <p className="text-sm">
                            By accessing and using BeyondChats Intelligence, you agree to be bound by these Terms of Use. If you do not agree to these terms, please discontinue use of our services immediately.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-light mb-4 text-white">2. Description of Service</h2>
                        <p className="text-sm">
                            BeyondChats Intelligence provides automated content scraping, AI-powered article enhancement, competitive analysis, and interactive chat functionality. These services are provided for informational and productivity purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-light mb-4 text-white">3. User Responsibilities</h2>
                        <p className="text-sm">
                            Users are responsible for ensuring they have the right to scrape and process content from external sources. You agree not to use our services for any unlawful purpose or in violation of any applicable laws or regulations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-light mb-4 text-white">4. Intellectual Property</h2>
                        <p className="text-sm">
                            All content, features, and functionality of BeyondChats Intelligence are owned by us and protected by international copyright, trademark, and other intellectual property laws. Enhanced content remains subject to original source licensing.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-light mb-4 text-white">5. Limitation of Liability</h2>
                        <p className="text-sm">
                            BeyondChats Intelligence is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-light mb-4 text-white">6. Modifications</h2>
                        <p className="text-sm">
                            We reserve the right to modify these terms at any time. Continued use of the service after modifications constitutes acceptance of the updated terms. We encourage regular review of this document.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-light mb-4 text-white">7. Governing Law</h2>
                        <p className="text-sm">
                            These terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles. Any disputes shall be resolved in the appropriate jurisdiction.
                        </p>
                    </section>
                </div>

                {/* Footer Navigation */}
                <div className="mt-20 pt-8 border-t border-white/10 flex items-center justify-between">
                    <Link href="/privacy-policy" className="font-mono text-[11px] tracking-[0.15em] uppercase text-white/50 hover:text-white transition-colors">
                        ← Privacy Policy
                    </Link>
                    <Link href="/" className="font-mono text-[11px] tracking-[0.15em] uppercase text-white/50 hover:text-white transition-colors">
                        Home
                    </Link>
                </div>
            </article>
        </main>
    );
}
