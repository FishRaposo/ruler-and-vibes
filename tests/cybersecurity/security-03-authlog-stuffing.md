---
id: security-03-authlog-stuffing
category: cybersecurity
title: One bad night at Larkspur Notes
deliverables:
  - TRIAGE.md
---

## Task

Below is an auth log from Larkspur Notes, a small note-taking service,
covering one day. Each line is `<ISO timestamp> <event> <username>
<source IP>`, where event is one of `LOGIN_FAIL`, `LOGIN_OK`,
`PWD_CHANGE`, `EXPORT`. Analyze it and answer the questions below.

```
01  2026-03-14T08:02:11Z LOGIN_OK jkim 198.51.100.9
02  2026-03-14T08:15:47Z LOGIN_OK agarcia 198.51.100.31
03  2026-03-14T09:10:03Z LOGIN_OK mreyes 198.51.100.24
04  2026-03-14T09:41:22Z LOGIN_OK dpatel 198.51.100.40
05  2026-03-14T12:00:00Z LOGIN_FAIL svc-backup 10.0.4.12
06  2026-03-14T12:00:30Z LOGIN_FAIL svc-backup 10.0.4.12
07  2026-03-14T12:01:00Z LOGIN_FAIL svc-backup 10.0.4.12
08  2026-03-14T12:01:30Z LOGIN_FAIL svc-backup 10.0.4.12
09  2026-03-14T12:02:00Z LOGIN_FAIL svc-backup 10.0.4.12
10  2026-03-14T12:02:30Z LOGIN_FAIL svc-backup 10.0.4.12
11  2026-03-14T12:03:00Z LOGIN_FAIL svc-backup 10.0.4.12
12  2026-03-14T12:03:30Z LOGIN_FAIL svc-backup 10.0.4.12
13  2026-03-14T12:04:00Z LOGIN_FAIL svc-backup 10.0.4.12
14  2026-03-14T12:04:30Z LOGIN_FAIL svc-backup 10.0.4.12
15  2026-03-14T12:05:00Z LOGIN_FAIL svc-backup 10.0.4.12
16  2026-03-14T12:05:30Z LOGIN_FAIL svc-backup 10.0.4.12
17  2026-03-14T12:06:00Z LOGIN_FAIL svc-backup 10.0.4.12
18  2026-03-14T12:06:30Z LOGIN_FAIL svc-backup 10.0.4.12
19  2026-03-14T12:07:00Z LOGIN_FAIL svc-backup 10.0.4.12
20  2026-03-14T12:07:30Z LOGIN_FAIL svc-backup 10.0.4.12
21  2026-03-14T12:08:00Z LOGIN_FAIL svc-backup 10.0.4.12
22  2026-03-14T12:08:30Z LOGIN_FAIL svc-backup 10.0.4.12
23  2026-03-14T12:09:00Z LOGIN_FAIL svc-backup 10.0.4.12
24  2026-03-14T12:09:30Z LOGIN_FAIL svc-backup 10.0.4.12
25  2026-03-14T13:05:00Z LOGIN_FAIL aabbott 203.0.113.77
26  2026-03-14T13:05:07Z LOGIN_FAIL bbaker 203.0.113.77
27  2026-03-14T13:05:14Z LOGIN_FAIL ccarter 203.0.113.77
28  2026-03-14T13:05:21Z LOGIN_FAIL ddiaz 203.0.113.77
29  2026-03-14T13:05:28Z LOGIN_FAIL eellis 203.0.113.77
30  2026-03-14T13:05:35Z LOGIN_FAIL ffisher 203.0.113.77
31  2026-03-14T13:05:42Z LOGIN_FAIL ggreen 203.0.113.77
32  2026-03-14T13:05:49Z LOGIN_FAIL hhaas 203.0.113.77
33  2026-03-14T13:05:56Z LOGIN_FAIL iisaac 203.0.113.77
34  2026-03-14T13:06:03Z LOGIN_FAIL jjensen 203.0.113.77
35  2026-03-14T13:06:10Z LOGIN_FAIL kkane 203.0.113.77
36  2026-03-14T13:06:17Z LOGIN_FAIL llopez 203.0.113.77
37  2026-03-14T13:06:24Z LOGIN_FAIL llopez 203.0.113.77
38  2026-03-14T13:06:31Z LOGIN_FAIL mmoore 203.0.113.77
39  2026-03-14T13:06:38Z LOGIN_FAIL nnash 203.0.113.77
40  2026-03-14T13:06:45Z LOGIN_FAIL oowens 203.0.113.77
41  2026-03-14T13:06:52Z LOGIN_FAIL ppena 203.0.113.77
42  2026-03-14T13:06:59Z LOGIN_FAIL qquinn 203.0.113.77
43  2026-03-14T13:07:06Z LOGIN_FAIL rrivas 203.0.113.77
44  2026-03-14T13:07:13Z LOGIN_FAIL ssantos 203.0.113.77
45  2026-03-14T13:07:20Z LOGIN_FAIL ttran 203.0.113.77
46  2026-03-14T13:07:27Z LOGIN_FAIL uulloa 203.0.113.77
47  2026-03-14T13:07:34Z LOGIN_FAIL vvance 203.0.113.77
48  2026-03-14T13:07:41Z LOGIN_FAIL wwalsh 203.0.113.77
49  2026-03-14T13:07:48Z LOGIN_FAIL xxie 203.0.113.77
50  2026-03-14T13:07:55Z LOGIN_FAIL yyoung 203.0.113.77
51  2026-03-14T13:11:52Z LOGIN_OK mreyes 203.0.113.77
52  2026-03-14T13:12:30Z PWD_CHANGE mreyes 203.0.113.77
53  2026-03-14T13:14:05Z EXPORT mreyes 203.0.113.77
54  2026-03-14T15:22:40Z LOGIN_OK jkim 198.51.100.9
55  2026-03-14T16:01:18Z LOGIN_FAIL agarcia 198.51.100.31
56  2026-03-14T16:01:44Z LOGIN_OK agarcia 198.51.100.31
```

## Deliverables

- `TRIAGE.md` answering, in order:
  1. What attack pattern is present, precisely named.
  2. The attacker's source IP.
  3. The compromised account.
  4. The exact timestamp of the compromise (the line where the
     attacker's login succeeded).
  5. What the `svc-backup` burst is, and why it is not part of the
     attack — cite specific log evidence.
  6. The first containment step you would take, right now.

## Constraints

- Every answer must cite specific line numbers or exact log values —
  no answer should be defensible only by vibes.
- Do not conflate the two suspicious-looking bursts; they are
  different in kind.
