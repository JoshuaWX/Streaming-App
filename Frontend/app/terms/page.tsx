import Header from '@/components/header'
import Footer from '@/components/footer'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="bg-card border-b border-border py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: February 2024</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">1. Agreement to Terms</h2>
            <p className="leading-relaxed">
              By accessing and using FlixStream, you agree to be bound by these Terms of Service. If you do not 
              agree to any part of these terms, you may not use the Service. We reserve the right to modify these 
              terms at any time. Your continued use of the Service following any changes constitutes your acceptance 
              of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">2. Use License</h2>
            <p className="mb-3 leading-relaxed">
              Permission is granted to temporarily download one copy of the materials (information or software) on 
              FlixStream for personal, non-commercial transitory viewing only. This is the grant of a license, not 
              a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Modifying or copying the materials</li>
              <li>Using the materials for any commercial purpose or for any public display</li>
              <li>Attempting to decompile or reverse engineer any software</li>
              <li>Removing any copyright or other proprietary notations</li>
              <li>Transferring the materials to another person or "mirroring" on any other server</li>
              <li>Violating any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">3. Disclaimer of Warranties</h2>
            <p className="leading-relaxed">
              The materials on FlixStream are provided on an 'as is' basis. We make no warranties, expressed or 
              implied, and hereby disclaim and negate all other warranties including, without limitation, implied 
              warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement 
              of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">4. Limitations of Liability</h2>
            <p className="leading-relaxed">
              In no event shall FlixStream or its suppliers be liable for any damages (including, without limitation, 
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
              to use the materials on FlixStream, even if we or our authorized representative has been notified orally 
              or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">5. Accuracy of Materials</h2>
            <p className="leading-relaxed">
              The materials appearing on FlixStream could include technical, typographical, or photographic errors. 
              We do not warrant that any of the materials on the Service are accurate, complete, or current. We may 
              make changes to the materials contained on the Service at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">6. Materials and Content</h2>
            <p className="mb-3 leading-relaxed">
              Unless otherwise stated, we own the intellectual property rights for all material on FlixStream. All 
              intellectual property rights are reserved. You may access this from the Service for your personal use, 
              subject to restrictions set in these terms and conditions.
            </p>
            <p className="leading-relaxed">
              You must not:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>Republish material from FlixStream</li>
              <li>Sell, rent, or sub-license material from FlixStream</li>
              <li>Reproduce, duplicate, or copy material for commercial purposes</li>
              <li>Redistribute content unless content is specifically made for redistribution</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">7. User Accounts</h2>
            <p className="leading-relaxed">
              When you create an account on FlixStream, you must provide accurate and complete information. You are 
              responsible for maintaining the confidentiality of your account information and password, and for 
              restricting access to your account. You agree to accept responsibility for all activities that occur 
              under your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">8. Prohibited Conduct</h2>
            <p className="mb-3 leading-relaxed">
              You agree not to engage in any conduct that:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Violates any applicable law or regulation</li>
              <li>Infringes upon intellectual property rights</li>
              <li>Is abusive, threatening, defamatory, obscene, or otherwise objectionable</li>
              <li>Constitutes spam or unsolicited communications</li>
              <li>Disrupts the normal flow of dialogue in the Service</li>
              <li>Attempts to gain unauthorized access to systems or networks</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">9. Subscription and Billing</h2>
            <p className="leading-relaxed">
              Subscriptions renew automatically unless canceled. You agree to pay all charges that are incurred by your 
              account, including any applicable taxes. We reserve the right to change subscription prices with notice. 
              Cancellations are effective at the end of your current billing period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">10. Termination</h2>
            <p className="leading-relaxed">
              We may suspend or terminate your account and access to the Service at any time, in our sole discretion, 
              with or without cause, and with or without notice. Cause for termination may include, but is not limited 
              to, breach of these Terms, engaging in unlawful or harmful conduct, or abuse of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">11. Contact Information</h2>
            <p className="mb-3 leading-relaxed">
              If you have questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-card border border-border rounded-lg p-6 text-foreground">
              <p className="mb-2">FlixStream Legal Team</p>
              <p className="mb-2">Email: legal@flixstream.com</p>
              <p>Address: 123 Entertainment Lane, Los Angeles, CA 90001</p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  )
}
