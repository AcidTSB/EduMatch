package com.example.edumatch_androi.data.repository.pricing

import com.example.edumatch_androi.data.model.pricing.Faq

class FaqRespository {
    fun getFaqList(): List<Faq> = listOf(
        Faq("How does the AI matching work?", "Our AI analyzes your academic background, interests, achievements, and goals to find scholarships that best match your profile. The more information you provide, the more accurate the matches becomes."),
        Faq("Can I cancel my subscription anytime?", "Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your current billing period."),
        Faq("Is there a free trial for premium plans?", "Yes, we offer a 14-day free trial for our Premium plan. No credit card required to start."),
        Faq("What happens if I don't get accepted to any scholarships?", "Our Pro plan includes a success guarantee. If you follow our recommendations and don't receive any scholarship offers within 6 months, we'll provide additional support or a partial refund."),
        Faq("Do you offer student discounts?", "Yes, we offer additional discounts for students from underrepresented backgrounds. Contact our support team to learn more about available programs.")
    )
}