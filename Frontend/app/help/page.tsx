'use client'

import { useState } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface FAQItem {
  id: string
  category: string
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    id: '1',
    category: 'Accounts',
    question: 'How do I create a FlixStream account?',
    answer: 'Click the "Sign Up" button on the homepage and enter your email address, password, and basic information. You can also sign up using your Google or GitHub account for faster registration.',
  },
  {
    id: '2',
    category: 'Accounts',
    question: 'How do I reset my password?',
    answer: 'Click "Forgot Password" on the login page, enter your email address, and follow the instructions sent to your email to reset your password.',
  },
  {
    id: '3',
    category: 'Accounts',
    question: 'Can I change my email address?',
    answer: 'Yes, you can change your email address in your account settings. Go to Settings > Account Information and update your email.',
  },
  {
    id: '4',
    category: 'Subscriptions',
    question: 'How much does FlixStream cost?',
    answer: 'FlixStream offers several subscription plans to fit your needs. Visit our pricing page to see all available options and features.',
  },
  {
    id: '5',
    category: 'Subscriptions',
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period. Go to Settings > Subscriptions to manage your plan.',
  },
  {
    id: '6',
    category: 'Subscriptions',
    question: 'Do you offer a free trial?',
    answer: 'We occasionally offer free trial periods. Check your account or visit our promotions page to see if you are eligible for a current trial offer.',
  },
  {
    id: '7',
    category: 'Streaming',
    question: 'What devices can I use to watch FlixStream?',
    answer: 'You can watch FlixStream on smart TVs, computers, tablets, and smartphones using our apps or web browser. Check our devices page for a complete list of compatible devices.',
  },
  {
    id: '8',
    category: 'Streaming',
    question: 'Can I download content to watch offline?',
    answer: 'Yes, with premium subscriptions, you can download movies and shows to your device to watch later without an internet connection.',
  },
  {
    id: '9',
    category: 'Streaming',
    question: 'What video quality options are available?',
    answer: 'Video quality depends on your subscription tier and internet speed. We offer SD, HD, and 4K Ultra HD quality. Your device and browser also affect the available quality.',
  },
  {
    id: '10',
    category: 'Content',
    question: 'How often is new content added?',
    answer: 'We add new movies and shows to our library regularly. New releases are typically added monthly, and we continuously update our catalog.',
  },
  {
    id: '11',
    category: 'Content',
    question: 'Can I request specific content?',
    answer: 'Yes, we love hearing from our users! Submit your content requests through Settings > Send Feedback, and our team will review your suggestions.',
  },
  {
    id: '12',
    category: 'Technical',
    question: 'Why is my video buffering?',
    answer: 'Buffering is usually caused by internet connection issues. Try restarting your router, closing other applications using bandwidth, or checking your internet speed.',
  },
]

type CategoryType = 'all' | 'Accounts' | 'Subscriptions' | 'Streaming' | 'Content' | 'Technical'

export default function HelpPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const categories: { value: CategoryType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'Accounts', label: 'Accounts' },
    { value: 'Subscriptions', label: 'Subscriptions' },
    { value: 'Streaming', label: 'Streaming' },
    { value: 'Content', label: 'Content' },
    { value: 'Technical', label: 'Technical' },
  ]

  const filteredFAQ = faqItems.filter((item) => {
    const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory
    const searchMatch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return categoryMatch && searchMatch
  })

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="bg-card border-b border-border py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Help & Support</h1>
          <p className="text-xl text-muted-foreground mb-6">Find answers to common questions</p>

          {/* Search */}
          <div className="flex gap-2 max-w-2xl mx-auto">
            <Input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.value}
              onClick={() => setSelectedCategory(category.value)}
              variant={selectedCategory === category.value ? 'default' : 'outline'}
              className={`${
                selectedCategory === category.value
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-input border-border text-foreground hover:bg-input/80'
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* FAQ List */}
        {filteredFAQ.length > 0 ? (
          <div className="space-y-3">
            {filteredFAQ.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-input/50 transition-colors text-left"
                >
                  <h3 className="font-semibold text-foreground pr-4">{item.question}</h3>
                  <div className="flex-shrink-0 text-accent">
                    {expandedId === item.id ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7-7m0 0L5 14m7-7v12" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7 7 7-7" />
                      </svg>
                    )}
                  </div>
                </button>

                {/* Answer */}
                {expandedId === item.id && (
                  <div className="px-6 py-4 bg-input/30 border-t border-border">
                    <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No results found for your search.</p>
            <Button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Clear Search
            </Button>
          </div>
        )}

        {/* Contact Support */}
        <div className="mt-16 bg-card border border-border rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">Still need help?</h2>
          <p className="text-muted-foreground mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Contact Support
            </Button>
            <Button variant="outline" className="bg-input border-border text-foreground hover:bg-input/80">
              Email Us
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
