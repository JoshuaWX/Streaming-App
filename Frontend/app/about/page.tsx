import Header from '@/components/header'
import Footer from '@/components/footer'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="bg-card border-b border-border py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">About FlixStream</h1>
          <p className="text-xl text-muted-foreground">
            Your gateway to unlimited entertainment
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        <div className="space-y-12">
          {/* Our Mission */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              FlixStream is committed to bringing the world's best entertainment directly to your home. 
              We believe everyone deserves access to high-quality content, regardless of where they are 
              or what they're interested in.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our platform combines cutting-edge technology with a vast library of movies and TV shows 
              to create the ultimate streaming experience.
            </p>
          </section>

          {/* What We Offer */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Unlimited Library',
                  description: 'Access thousands of movies and TV shows, updated constantly with new releases.',
                },
                {
                  title: 'Multiple Devices',
                  description: 'Watch on your TV, computer, phone, or tablet. Your progress syncs seamlessly across all devices.',
                },
                {
                  title: 'Personalized Recommendations',
                  description: 'Our advanced algorithm learns your preferences and suggests content you\'ll love.',
                },
                {
                  title: '4K Ultra HD',
                  description: 'Experience crystal-clear streaming in up to 4K resolution with premium subscriptions.',
                },
                {
                  title: 'Offline Viewing',
                  description: 'Download your favorite shows and movies to watch anytime, anywhere without internet.',
                },
                {
                  title: 'Family Profiles',
                  description: 'Create separate profiles for family members with personalized recommendations and parental controls.',
                },
              ].map((item) => (
                <div key={item.title} className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Our Story */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Founded in 2024, FlixStream emerged from a simple belief: streaming entertainment should be 
              accessible, affordable, and exceptional. What started as a vision to disrupt the streaming 
              industry has grown into a global platform serving millions of users.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, we continue to innovate and expand our library, always keeping our users' satisfaction 
              at the forefront of everything we do.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-3xl font-bold text-foreground mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-6">
              Have questions? We'd love to hear from you. Contact our support team.
            </p>
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-foreground mb-2">
                <strong>Email:</strong> support@flixstream.com
              </p>
              <p className="text-foreground mb-2">
                <strong>Phone:</strong> 1-800-FLIX-STREAM
              </p>
              <p className="text-foreground">
                <strong>Hours:</strong> Available 24/7 for your convenience
              </p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  )
}
