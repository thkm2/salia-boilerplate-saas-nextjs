# PostHog Dashboard Setup Guide

## 1. Create Account & Project

1. Go to [posthog.com](https://posthog.com) and create an account
2. Create a new project for your SaaS
3. Select **US Cloud** (matches our rewrite config) or EU Cloud (requires config changes)

## 2. Get API Key & Host

1. Go to **Settings > Project > Project API Key**
2. Copy the project API key (starts with `phc_`)

## 3. Configure Environment Variables

Update your `.env`:

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_your_actual_key_here
NEXT_PUBLIC_POSTHOG_HOST=/ingest
```

The `/ingest` host works because `next.config.ts` proxies requests to PostHog servers. This avoids ad-blockers.

> If using EU Cloud, update the rewrite destinations in `next.config.ts` from `us.i.posthog.com` to `eu.i.posthog.com` and `us-assets.i.posthog.com` to `eu-assets.i.posthog.com`.

## 4. Session Replay

1. Go to **Settings > Project > Session Replay**
2. Enable session replay
3. Configure sampling rate (start with 100% for low traffic, reduce as you scale)
4. Optionally enable console log recording and network request recording

No code changes needed - the PostHog JS SDK handles recording automatically.

## 5. Feature Flags

1. Go to **Feature Flags** in the sidebar
2. Click **New Feature Flag**
3. Set the key (e.g., `new-dashboard`)
4. Configure rollout:
   - Percentage rollout for gradual releases
   - User property matching (e.g., `plan = pro`)
   - Group-based targeting

Use in code:

```tsx
// Client
const enabled = useFeatureFlagEnabled("new-dashboard");

// Server
const enabled = await posthog.isFeatureEnabled("new-dashboard", userId);
```

## 6. Useful Insights for SaaS

### Recommended Dashboards

**Growth Dashboard:**
- Daily/Weekly/Monthly Active Users (DAU/WAU/MAU)
- New signups over time
- Signup-to-activation funnel
- Retention cohorts

**Revenue Dashboard:**
- Plan upgrades over time (`plan_upgraded` event)
- Plan distribution (free vs basic vs pro)
- Credits purchased (`credits_purchased` event)
- Churn events (`plan_downgraded` event)

**Product Dashboard:**
- Most used features (`feature_used` event, broken down by `feature_name`)
- Feature adoption by plan
- Page views by authenticated users
- Session duration

### Creating an Insight

1. Go to **Insights > New Insight**
2. Choose insight type:
   - **Trends** for metrics over time
   - **Funnels** for conversion flows
   - **Retention** for cohort analysis
   - **Paths** for user journey mapping
3. Select events and filters
4. Save to a dashboard

### Example: Signup-to-Activation Funnel

1. New Insight > Funnel
2. Step 1: `$pageview` where `$current_url` contains `/auth`
3. Step 2: `$pageview` where `$current_url` contains `/dashboard`
4. Step 3: `feature_used` (first time user engages with core feature)

## 7. Alerts

1. Go to an insight you want to monitor
2. Click the **...** menu > **Subscribe**
3. Configure:
   - **Threshold alerts**: Notify when a metric crosses a value
   - **Anomaly detection**: Notify on unusual changes
4. Set notification channel (email, Slack webhook)

### Recommended Alerts

| Alert | Condition |
|-------|-----------|
| Signup spike/drop | Signups deviate >50% from average |
| Error spike | Error events > threshold |
| Churn alert | Plan downgrades > X per day |
| Feature usage drop | Key feature usage drops >30% |
