import Link from 'next/link';

export default function PrivacyPolicyPage() {
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
                        Privacy <span className="italic font-serif">Policy.</span>
                    </h1>
                    <p className="font-mono text-[11px] text-white/40 mt-6">Last Updated: December 2025</p>
                </header>

                <div className="space-y-12 text-white/70 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-light mb-4 text-white">1. Information We Collect</h2>
                        <p className="text-sm">
                            BeyondChats Intelligence collects information you provide directly, including but not limited to URLs for article scraping, interaction data with enhanced content, and chat queries. We may also collect technical data such as browser type, device information, and usage patterns to improve our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-light mb-4 text-white">2. How We Use Your Information</h2>
                        <p className="text-sm">
                            We use collected information to provide and improve our content intelligence services, personalize your experience, analyze usage patterns, and develop new features. Your data helps us enhance article processing algorithms and chat functionality.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-light mb-4 text-white">3. Data Storage & Security</h2>
                        <p className="text-sm">
                            All data is stored securely using industry-standard encryption. We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-light mb-4 text-white">4. Third-Party Services</h2>
                        <p className="text-sm">
                            We utilize third-party services including AI providers for content enhancement and database services for storage. These providers are bound by confidentiality agreements and process data only as instructed.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-light mb-4 text-white">5. Your Rights</h2>
                        <p className="text-sm">
                            You have the right to access, correct, or delete your personal data. You may also request data portability or restrict processing. To exercise these rights, contact us through the provided channels.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-light mb-4 text-white">6. Contact</h2>
                        <p className="text-sm">
                            For privacy-related inquiries, please reach out to our data protection team. We are committed to addressing your concerns and ensuring compliance with applicable privacy regulations.
                        </p>
                    </section>
                </div>

                {/* Footer Navigation */}
                <div className="mt-20 pt-8 border-t border-white/10 flex items-center justify-between">
                    <Link href="/terms-of-use" className="font-mono text-[11px] tracking-[0.15em] uppercase text-white/50 hover:text-white transition-colors">
                        Terms of Use →
                    </Link>
                    <Link href="/" className="font-mono text-[11px] tracking-[0.15em] uppercase text-white/50 hover:text-white transition-colors">
                        Home
                    </Link>
                </div>
            </article>
        </main>
    );
}
