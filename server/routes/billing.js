const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const supabase = require("../config/supabase");
const { authenticate } = require("../middleware/auth");
const { sendEmail } = require("../services/email");

const router = express.Router();

// POST /api/billing/checkout — create Stripe checkout session
router.post("/checkout", authenticate, async (req, res) => {
  if (req.user.isGuest) {
    return res
      .status(401)
      .json({ error: "Please create an account to upgrade." });
  }

  const { data: user } = await supabase
    .from("users")
    .select("email, stripe_customer_id")
    .eq("id", req.user.id)
    .single();

  let customerId = user.stripe_customer_id;

  // Create Stripe customer if doesn't exist
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: req.user.id },
    });
    customerId = customer.id;

    await supabase
      .from("users")
      .update({ stripe_customer_id: customerId })
      .eq("id", req.user.id);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID, quantity: 1 }],
    success_url: `https://${process.env.TUNNEL_DOMAIN}/dashboard?upgraded=true`,
    cancel_url: `https://${process.env.TUNNEL_DOMAIN}/pricing`,
    metadata: { supabase_user_id: req.user.id },
    subscription_data: {
      metadata: { supabase_user_id: req.user.id },
    },
  });

  res.json({ url: session.url });
});

// POST /api/billing/portal — customer portal for managing subscription
router.post("/portal", authenticate, async (req, res) => {
  const { data: user } = await supabase
    .from("users")
    .select("stripe_customer_id")
    .eq("id", req.user.id)
    .single();

  if (!user?.stripe_customer_id) {
    return res.status(400).json({ error: "No billing account found." });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripe_customer_id,
    return_url: `https://${process.env.TUNNEL_DOMAIN}/dashboard/billing`,
  });

  res.json({ url: session.url });
});

// GET /api/billing/subscription — get current subscription status
router.get("/subscription", authenticate, async (req, res) => {
  const { data: user } = await supabase
    .from("users")
    .select("plan, stripe_subscription_id, plan_ends_at, stripe_customer_id")
    .eq("id", req.user.id)
    .single();

  if (!user) return res.status(404).json({ error: "User not found" });

  let subscription = null;
  if (user.stripe_subscription_id) {
    try {
      subscription = await stripe.subscriptions.retrieve(
        user.stripe_subscription_id
      );
    } catch (e) {
      console.error("Stripe subscription fetch error:", e.message);
    }
  }

  res.json({
    plan: user.plan,
    planEndsAt: user.plan_ends_at,
    subscription: subscription
      ? {
          status: subscription.status,
          currentPeriodEnd: new Date(
            subscription.current_period_end * 1000
          ).toISOString(),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
        }
      : null,
  });
});

// POST /api/billing/webhook — Stripe webhook handler
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Idempotency check
    const { data: existing } = await supabase
      .from("stripe_events")
      .select("id")
      .eq("id", event.id)
      .single();

    if (existing) return res.json({ received: true });

    await supabase
      .from("stripe_events")
      .insert({ id: event.id, type: event.type });

    const userId = event.data.object?.metadata?.supabase_user_id;

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const uid = session.metadata?.supabase_user_id;
        const subId = session.subscription;

        if (uid && subId) {
          await supabase
            .from("users")
            .update({
              plan: "pro",
              stripe_subscription_id: subId,
              plan_started_at: new Date().toISOString(),
              plan_ends_at: null,
            })
            .eq("id", uid);

          const { data: user } = await supabase
            .from("users")
            .select("email, full_name")
            .eq("id", uid)
            .single();
          if (user) {
            await sendEmail({
              to: user.email,
              subject: "Welcome to LivePreview Pro! 🚀",
              template: "welcome_pro",
              data: { name: user.full_name || "there" },
            });
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        if (userId) {
          await supabase
            .from("users")
            .update({
              plan: "free",
              stripe_subscription_id: null,
              plan_ends_at: new Date(
                sub.current_period_end * 1000
              ).toISOString(),
            })
            .eq("id", userId);
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object;
        if (userId) {
          const plan = sub.status === "active" ? "pro" : "free";
          await supabase.from("users").update({ plan }).eq("id", userId);
        }
        break;
      }

      case "invoice.payment_failed": {
        if (userId) {
          const { data: user } = await supabase
            .from("users")
            .select("email, full_name")
            .eq("id", userId)
            .single();
          if (user) {
            await sendEmail({
              to: user.email,
              subject: "Payment failed — action required",
              template: "payment_failed",
              data: { name: user.full_name || "there" },
            });
          }
        }
        break;
      }
    }

    await supabase
      .from("stripe_events")
      .update({ processed: true })
      .eq("id", event.id);
    res.json({ received: true });
  }
);

module.exports = router;
