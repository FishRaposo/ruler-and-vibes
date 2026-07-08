## Decision Matrix

| Criterion | Weight | SaaS ($400/mo) | Custom Build ($30k + $500/mo) | Self-Hosted OSS ($6k + $150/mo) |
|---|---|---|---|---|
| Upfront cost | 25% | Low (score 5) | Very high (score 1) | Moderate (score 4) |
| Time to deliver | 20% | 1 week (score 5) | 4 months (score 2) | 3 weeks (score 4) |
| Ongoing cost at 8 seats | 25% | $400/mo (score 3) | $500/mo (score 2) | $150/mo (score 5) |
| Scalability risk | 15% | Jumps at 15 seats (score 2) | Full control (score 5) | Single-person dependency (score 2) |
| Data ownership | 15% | Vendor holds data (score 1) | Full ownership (score 5) | Full ownership (score 5) |

Weighted: SaaS = 3.1, Custom = 2.8, OSS = 4.15

## Recommendation

Adopt the self-hosted open-source option. It delivers the best weighted score with low recurring costs and full data ownership. The $6,000 setup is a one-time expense the agency can absorb.

## Risks and Mitigations

1. **Single-point-of-failure on tech-savvy employee**: if they leave, maintenance knowledge walks out the door. Mitigation: document setup and routine procedures; budget for occasional paid support from the OSS community or a freelancer.
2. **Hidden complexity**: the $6,000 estimate may grow if unplanned integration work surfaces. Mitigation: contract a fixed-scope Statement of Work, not an open-ended engagement.
3. **No vendor SLA**: unlike SaaS, there is no guaranteed uptime. Mitigation: the $150/month hosting includes standard cloud-provider uptime; the agency's needs do not require 99.99% availability.

## Assumptions

- The agency does not plan to grow beyond 15 employees within two years, making the SaaS per-seat jump less immediately relevant.
- The tech-savvy employee is willing and able to handle routine maintenance.
- The $6,000 setup quote is firm and covers full deployment.
