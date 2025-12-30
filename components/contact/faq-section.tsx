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
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
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
                  className="bg-background border border-border rounded-xl px-6 data-[state=open]:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
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
