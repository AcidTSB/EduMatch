package com.example.edumatch_androi.data.repository.pricing

import com.example.edumatch_androi.data.model.pricing.PricingPlan

class PricingPlanRespository {

    fun getPricingPlans(): List<PricingPlan> = listOf(
        PricingPlan(
            "Free", "$0", "/ forever",
            listOf("Access to 500+ scholarships", "Basic AI matching", "Application tracking", "Email notifications", "Mobile app access", "Community support"),
            listOf("5 applications per month", "Standard matching accuracy", "Basic profile features"),
            "Get Started Free", "register_route"
        ),
        PricingPlan(
            "Premium", "$9.99", "/ per month",
            listOf("Everything in Free", "Access to 2,000+ scholarships", "Advanced AI matching", "Unlimited applications", "Priority notifications", "Advanced analytics", "Personal matching score", "Application templates", "Deadline reminders", "Priority support"),
            emptyList(),
//            "Upgrade Now", "upgrade_route"
            "Upgrade Now", ""

        ),
        PricingPlan(
            "Pro", "$19.99", "/ per month",
            listOf("Everything in Premium", "Personal scholarship consultant", "Essay review service", "Interview preparation", "Custom recommendation letters", "White-glove application support", "Success guarantee program", "Exclusive scholarship opportunities", "1-on-1 mentoring sessions", "24/7 priority support"),
            emptyList(),
            "Contact Sales", "contact_sales_route"
        )
    )
}