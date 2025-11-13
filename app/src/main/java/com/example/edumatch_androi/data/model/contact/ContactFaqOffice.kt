package com.example.edumatch_androi.data.model.contact

data class ContactFaq(
    val question: String,
    val answer: String
)

data class Office(
    val city: String,
    val title: String,
    val address: String,
    val phone: String
)

fun getMockFaqs() = listOf(
    ContactFaq("How quickly can I expect a response?", "We typically respond to inquiries within 24 hours during business days. Premium users receive priority support with faster response times."),
    ContactFaq("Do you offer phone support?", "Yes, Phone support is available Monday through Friday, 9AM-5PM PST. You can also schedule a callback through our support portal."),
    ContactFaq("Can I schedule a demo?", "Absolutely! We offer personalized demos for institutions and organizations. Use the contact form or call us directly to schedule.")
)

fun getMockOffices() = listOf(
    Office("San Francisco", "Headquarters", "123 Innovation Drive, Suite 100 San Francisco, CA 94105", "+1 (555) 123-4567"),
    Office("New York", "East Coast Office", "456 Education Avenue New York, NY 10001", "+1 (555) 887-9943"),
    Office("Austin", "Operations Center", "789 Tech Boulevard Austin, TX 78701", "+1 (555) 456-7890")
)