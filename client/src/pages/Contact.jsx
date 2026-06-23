import { HiOutlineEnvelope, HiOutlinePhone, HiOutlineMapPin, HiOutlinePaperAirplane } from 'react-icons/hi2'

export default function Contact() {
  return (
    <div className="bg-white">
      <div className="page-container py-6 sm:py-8 lg:py-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-text-dark sm:text-3xl lg:text-4xl">Contact Us</h1>
          <p className="mt-2 text-sm text-text-muted sm:text-base">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <div className="rounded-2xl border border-neutral-border bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="mb-6 text-xl font-bold text-text-dark">Send us a message</h2>
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-text-dark">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-text-dark">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-dark">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-text-dark">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-text-dark">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full rounded-lg border border-neutral-border px-4 py-2.5 text-sm text-text-dark focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-dark sm:text-base"
              >
                <HiOutlinePaperAirplane className="h-5 w-5" />
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-neutral-border bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-text-dark">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                    <HiOutlineMapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-dark">Address</h3>
                    <p className="mt-1 text-sm text-text-muted">
                      123 Market Street<br />
                      Fresh City, FC 10001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                    <HiOutlinePhone className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-dark">Phone</h3>
                    <p className="mt-1 text-sm text-text-muted">
                      +1 (800) 123-4567<br />
                      Mon-Fri 9am-6pm
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                    <HiOutlineEnvelope className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-dark">Email</h3>
                    <p className="mt-1 text-sm text-text-muted">
                      hello@quickbasket.com<br />
                      support@quickbasket.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-border bg-primary p-6 sm:p-8 text-white">
              <h2 className="mb-4 text-xl font-bold">Need immediate help?</h2>
              <p className="mb-4 text-sm text-white/90">
                Our customer support team is available 24/7 to assist you with any questions or concerns.
              </p>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-neutral sm:text-base"
              >
                <HiOutlinePhone className="h-4 w-4" />
                Call Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
