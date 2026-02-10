import Header from '@/components/header'
import Footer from '@/components/footer'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="bg-card border-b border-border py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: February 2024</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="space-y-8 text-muted-foreground">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Introduction</h2>
            <p className="leading-relaxed">
              FlixStream ("we," "our," "us," or "Company") is committed to protecting your privacy. This 
              Privacy Policy explains how we collect, use, disclose, and otherwise handle your information when 
              you use our website, mobile application, and related services (collectively, the "Service").
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Information We Collect</h2>
            <p className="mb-3 leading-relaxed">
              We may collect information about you in various ways:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Information you provide directly (name, email, payment information)</li>
              <li>Information collected automatically (IP address, browsing behavior, device information)</li>
              <li>Information from cookies and similar tracking technologies</li>
              <li>Information from third-party sources (analytics providers, advertising partners)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">How We Use Your Information</h2>
            <p className="mb-3 leading-relaxed">
              We use the information we collect for various purposes:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>To provide, maintain, and improve the Service</li>
              <li>To process transactions and send related information</li>
              <li>To personalize your experience and deliver tailored content</li>
              <li>To communicate with you about updates and promotional offers</li>
              <li>To monitor and analyze usage patterns and trends</li>
              <li>To detect, prevent, and address fraudulent activity</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Sharing of Information</h2>
            <p className="leading-relaxed">
              We do not sell your personal information. However, we may share your information with:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>Service providers who assist us in operating the Service</li>
              <li>Business partners for joint marketing initiatives</li>
              <li>Law enforcement when required by law</li>
              <li>Other parties with your explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Your Privacy Rights</h2>
            <p className="mb-3 leading-relaxed">
              Depending on your location, you may have certain rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Right to access your personal information</li>
              <li>Right to correct inaccurate information</li>
              <li>Right to request deletion of your information</li>
              <li>Right to opt-out of marketing communications</li>
              <li>Right to data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Security</h2>
            <p className="leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission 
              over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Cookies and Tracking Technologies</h2>
            <p className="leading-relaxed">
              We use cookies, web beacons, and similar technologies to enhance your experience, analyze usage patterns, 
              and remember your preferences. You can control cookie settings through your browser, though this may 
              affect your ability to use certain features of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Contact Us</h2>
            <p className="mb-3 leading-relaxed">
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="bg-card border border-border rounded-lg p-6 text-foreground">
              <p className="mb-2">FlixStream Privacy Team</p>
              <p className="mb-2">Email: privacy@flixstream.com</p>
              <p>Address: 123 Entertainment Lane, Los Angeles, CA 90001</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-3">Changes to This Policy</h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
              the new Privacy Policy on the Service and updating the "Last updated" date above.
            </p>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  )
}
