import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ParticleBackground } from "@/components/particle-background"
import Image from "next/image"

export default async function HomePage() {
  const session = await getSession()

  if (session) {
    redirect(session.isAdmin ? "/admin" : "/dashboard")
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#005DAA] text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/royale-bank-logo.jpg"
              alt="RoyaleBank Logo"
              width={120}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#accounts" className="hover:text-[#FFD200] transition-colors">
              Accounts
            </Link>
            <Link href="#services" className="hover:text-[#FFD200] transition-colors">
              Services
            </Link>
            <Link href="#about" className="hover:text-[#FFD200] transition-colors">
              About
            </Link>
            <Button asChild className="bg-[#FFD200] text-slate-900 hover:bg-[#FFD200]/90 font-semibold">
              <Link href="/login">Sign In</Link>
            </Button>
          </nav>
        </div>
      </header>

      <section className="relative bg-black text-white py-20 overflow-hidden">
        <ParticleBackground />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-6">
              WELCOME TO ROYALEBANK
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">Banking Made Simple and Secure</h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Experience modern banking with instant transfers, secure transactions, and complete control over your
              finances. Join thousands of satisfied customers today.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="bg-red-600 text-white hover:bg-red-700 font-semibold">
                <Link href="/register">Open an Account</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 font-semibold bg-transparent"
              >
                <Link href="#learn-more">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block bg-red-600 text-white px-4 py-1 rounded-full text-sm font-semibold mb-4">
              SPECIAL OFFER
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Limited Time Promotions</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Take advantage of our exclusive offers designed to help you save more and bank better.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-red-100 hover:border-red-300 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="bg-[#FFD200] text-slate-900 px-3 py-1 rounded-full text-xs font-bold">
                  NEW CUSTOMERS
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Zero Fees for 6 Months</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Open a new RoyaleBank account and enjoy zero monthly fees for the first 6 months. Plus, get instant
                access to all premium features.
              </p>
              <Button asChild className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold">
                <Link href="/register">Claim Offer</Link>
              </Button>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-blue-100 hover:border-blue-300 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#005DAA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <span className="bg-[#005DAA] text-white px-3 py-1 rounded-full text-xs font-bold">PREMIUM</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Premium Card Benefits</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Upgrade to our premium card and enjoy cashback on all purchases, travel insurance, and exclusive
                rewards. No annual fee for the first year.
              </p>
              <Button
                asChild
                variant="outline"
                className="w-full border-[#005DAA] text-[#005DAA] hover:bg-[#005DAA] hover:text-white font-semibold bg-transparent"
              >
                <Link href="/register">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#00205B] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Why Choose RoyaleBank?</h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              We offer a range of banking services tailored to meet your needs. From savings accounts to loans, we have
              got you covered.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-[#005DAA]/10 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-[#005DAA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Open a Bank Account</h3>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  Get started with a secure checking account featuring no monthly fees and instant access to your funds.
                </p>
                <Link href="/register" className="text-[#005DAA] font-semibold hover:underline">
                  Learn More →
                </Link>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-[#005DAA]/10 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-[#005DAA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Transfers</h3>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  Send money to anyone instantly with our secure transfer system. Available 24/7 with real-time
                  processing.
                </p>
                <Link href="/register" className="text-[#005DAA] font-semibold hover:underline">
                  Learn More →
                </Link>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-[#005DAA]/10 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-7 h-7 text-[#005DAA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Banking</h3>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  Bank with confidence using our advanced security features including encryption and two-factor
                  authentication.
                </p>
                <Link href="/register" className="text-[#005DAA] font-semibold hover:underline">
                  Learn More →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50" id="services">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">RoyaleBank Products and Services</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Whatever you need, we've got you covered with comprehensive banking solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#005DAA]/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#005DAA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Open a Bank Account</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Get started with a secure checking account featuring no monthly fees and instant access to your funds.
              </p>
              <Link href="/register" className="text-[#005DAA] font-semibold hover:underline">
                Learn More →
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#005DAA]/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#005DAA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Transfers</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Send money to anyone instantly with our secure transfer system. Available 24/7 with real-time
                processing.
              </p>
              <Link href="/register" className="text-[#005DAA] font-semibold hover:underline">
                Learn More →
              </Link>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#005DAA]/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#005DAA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Banking</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">
                Bank with confidence using our advanced security features including encryption and two-factor
                authentication.
              </p>
              <Link href="/register" className="text-[#005DAA] font-semibold hover:underline">
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Trusted by Thousands</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Join a growing community of satisfied customers who trust RoyaleBank for their financial needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-red-500 mb-2">50K+</div>
              <div className="text-slate-400">Active Customers</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-red-500 mb-2">$2B+</div>
              <div className="text-slate-400">Transactions Processed</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-red-500 mb-2">99.9%</div>
              <div className="text-slate-400">Uptime Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-red-500 mb-2">24/7</div>
              <div className="text-slate-400">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what real customers have to say about their RoyaleBank experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="flex text-[#FFD200]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-slate-700 mb-4 leading-relaxed">
                "RoyaleBank has completely transformed how I manage my finances. The instant transfers are a
                game-changer!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#005DAA] rounded-full flex items-center justify-center text-white font-bold">
                  MR
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-slate-900">Maria Rodriguez</div>
                  <div className="text-sm text-slate-500">Small Business Owner</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="flex text-[#FFD200]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-slate-700 mb-4 leading-relaxed">
                "The security features give me peace of mind. I feel confident knowing my money is safe with
                RoyaleBank."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#005DAA] rounded-full flex items-center justify-center text-white font-bold">
                  JC
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-slate-900">James Chen</div>
                  <div className="text-sm text-slate-500">Software Engineer</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="flex text-[#FFD200]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-slate-700 mb-4 leading-relaxed">
                "Best banking experience I've ever had. The app is intuitive and customer service is always helpful."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#005DAA] rounded-full flex items-center justify-center text-white font-bold">
                  SP
                </div>
                <div className="ml-3">
                  <div className="font-semibold text-slate-900">Sarah Patel</div>
                  <div className="text-sm text-slate-500">Marketing Director</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#005DAA] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Open your RoyaleBank account today and experience modern banking at its finest.
          </p>
          <Button asChild size="lg" className="bg-[#FFD200] text-slate-900 hover:bg-[#FFD200]/90 font-semibold">
            <Link href="/register">Create Your Account</Link>
          </Button>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">About RoyaleBank</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Personal Banking
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Business Banking
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Investments
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <p className="text-sm text-slate-400 mb-4">Follow us on social media for updates and news.</p>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-400">
            <p>© 2025 RoyaleBank. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
