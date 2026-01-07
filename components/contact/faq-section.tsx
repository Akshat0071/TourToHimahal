"use client"

import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { fadeInUp, staggerContainer } from "@/lib/animation-variants"

const faqs = [
  {
    question: "How do I book a tour package?",
    answer:
      "You can book a tour package by filling out the contact form above, calling us directly, or messaging us on WhatsApp. We'll get back to you within 12 hours with a customized itinerary and quote.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Cancellations made 15+ days before the trip get a full refund. 7-14 days before: 50% refund. Less than 7 days: No refund. We recommend travel insurance for added protection.",
  },
  {
    question: "Are your taxi services available 24/7?",
    answer:
      "Yes, our taxi services are available round the clock. For early morning pickups (before 6 AM) or late-night travel (after 10 PM), please book at least 6 hours in advance to ensure availability.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept bank transfers, UPI (GPay, PhonePe, Paytm), credit/debit cards, and cash. A 30% advance is required to confirm bookings, with the balance payable before the trip starts.",
  },
  {
    question: "Do you provide travel insurance?",
    answer:
      "We can arrange comprehensive travel insurance through our partner providers. This covers trip cancellation, medical emergencies, and baggage loss. Let us know your requirements when booking.",
  },
]

export function FAQSection() {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-3xl"
        >
          <motion.div variants={fadeInUp} className="mb-12 text-center">
            <h2 className="text-foreground mb-4 font-serif text-3xl font-bold md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">Quick answers to common queries about our services</p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-background border-border rounded-xl border px-6 transition-shadow data-[state=open]:shadow-md"
                >
                  <AccordionTrigger className="py-5 text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
