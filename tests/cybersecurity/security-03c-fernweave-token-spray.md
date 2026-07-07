---
id: security-03c-fernweave-token-spray
category: cybersecurity
title: Token spray at Fernweave
deliverables:
  - TRIAGE.md
---

## Task

Below is a token-issuance audit log from Fernweave, a small photo-sharing
service, covering one day. Each line is `<ISO timestamp> <event>
<username> <source IP>`, where event is one of `TOKEN_DENY`,
`TOKEN_GRANT`, `RECOVERY_SET`, `ALBUM_PULL`. `RECOVERY_SET` records a
change to an account's recovery email; `ALBUM_PULL` records a full
export of an account's albums. Analyze the log and answer the questions
below.

```
01  2026-05-09T07:48:10Z TOKEN_GRANT tobrien 198.51.100.12
02  2026-05-09T08:22:34Z TOKEN_GRANT lschmidt 198.51.100.44
03  2026-05-09T09:33:58Z TOKEN_GRANT rkhan 198.51.100.27
04  2026-05-09T10:07:19Z TOKEN_GRANT dfoster 198.51.100.51
05  2026-05-09T11:30:00Z TOKEN_DENY svc-thumbnailer 172.16.8.5
06  2026-05-09T11:30:45Z TOKEN_DENY svc-thumbnailer 172.16.8.5
07  2026-05-09T11:31:30Z TOKEN_DENY svc-thumbnailer 172.16.8.5
08  2026-05-09T11:32:15Z TOKEN_DENY svc-thumbnailer 172.16.8.5
09  2026-05-09T11:33:00Z TOKEN_DENY svc-thumbnailer 172.16.8.5
10  2026-05-09T11:33:45Z TOKEN_DENY svc-thumbnailer 172.16.8.5
11  2026-05-09T11:34:30Z TOKEN_DENY svc-thumbnailer 172.16.8.5
12  2026-05-09T11:35:15Z TOKEN_DENY svc-thumbnailer 172.16.8.5
13  2026-05-09T11:36:00Z TOKEN_DENY svc-thumbnailer 172.16.8.5
14  2026-05-09T11:36:45Z TOKEN_DENY svc-thumbnailer 172.16.8.5
15  2026-05-09T11:37:30Z TOKEN_DENY svc-thumbnailer 172.16.8.5
16  2026-05-09T11:38:15Z TOKEN_DENY svc-thumbnailer 172.16.8.5
17  2026-05-09T11:39:00Z TOKEN_DENY svc-thumbnailer 172.16.8.5
18  2026-05-09T11:39:45Z TOKEN_DENY svc-thumbnailer 172.16.8.5
19  2026-05-09T11:40:30Z TOKEN_DENY svc-thumbnailer 172.16.8.5
20  2026-05-09T11:41:15Z TOKEN_DENY svc-thumbnailer 172.16.8.5
21  2026-05-09T11:42:00Z TOKEN_DENY svc-thumbnailer 172.16.8.5
22  2026-05-09T11:42:45Z TOKEN_DENY svc-thumbnailer 172.16.8.5
23  2026-05-09T14:20:00Z TOKEN_DENY acole 192.0.2.140
24  2026-05-09T14:20:09Z TOKEN_DENY bmunoz 192.0.2.140
25  2026-05-09T14:20:18Z TOKEN_DENY cyang 192.0.2.140
26  2026-05-09T14:20:27Z TOKEN_DENY dwolfe 192.0.2.140
27  2026-05-09T14:20:36Z TOKEN_DENY efrost 192.0.2.140
28  2026-05-09T14:20:45Z TOKEN_DENY gnadeem 192.0.2.140
29  2026-05-09T14:20:54Z TOKEN_DENY hpatel 192.0.2.140
30  2026-05-09T14:21:03Z TOKEN_DENY ivano 192.0.2.140
31  2026-05-09T14:21:12Z TOKEN_DENY jkerr 192.0.2.140
32  2026-05-09T14:21:21Z TOKEN_DENY kojo 192.0.2.140
33  2026-05-09T14:21:30Z TOKEN_DENY lmarsh 192.0.2.140
34  2026-05-09T14:21:39Z TOKEN_DENY lmarsh 192.0.2.140
35  2026-05-09T14:21:48Z TOKEN_DENY mbryant 192.0.2.140
36  2026-05-09T14:21:57Z TOKEN_DENY naziz 192.0.2.140
37  2026-05-09T14:22:06Z TOKEN_DENY ophelps 192.0.2.140
38  2026-05-09T14:22:15Z TOKEN_DENY pgrant 192.0.2.140
39  2026-05-09T14:22:24Z TOKEN_DENY qromero 192.0.2.140
40  2026-05-09T14:22:33Z TOKEN_DENY rkhan 192.0.2.140
41  2026-05-09T14:22:42Z TOKEN_DENY sokafor 192.0.2.140
42  2026-05-09T14:22:51Z TOKEN_DENY tmalik 192.0.2.140
43  2026-05-09T14:23:00Z TOKEN_DENY ubarry 192.0.2.140
44  2026-05-09T14:23:09Z TOKEN_DENY vchoi 192.0.2.140
45  2026-05-09T14:23:18Z TOKEN_DENY wnasser 192.0.2.140
46  2026-05-09T14:23:27Z TOKEN_DENY xliu 192.0.2.140
47  2026-05-09T14:23:36Z TOKEN_DENY yamin 192.0.2.140
48  2026-05-09T14:26:38Z TOKEN_GRANT rkhan 192.0.2.140
49  2026-05-09T14:27:15Z RECOVERY_SET rkhan 192.0.2.140
50  2026-05-09T14:29:50Z ALBUM_PULL rkhan 192.0.2.140
51  2026-05-09T16:11:03Z TOKEN_GRANT tobrien 198.51.100.12
52  2026-05-09T17:03:22Z TOKEN_DENY dfoster 198.51.100.51
53  2026-05-09T17:03:48Z TOKEN_GRANT dfoster 198.51.100.51
```

## Deliverables

- `TRIAGE.md` answering, in order:
  1. What attack pattern is present, precisely named.
  2. The attacker's source IP.
  3. The compromised account.
  4. The exact timestamp of the compromise (the line where the
     attacker's token issuance succeeded).
  5. What the `svc-thumbnailer` burst is, and why it is not part of the
     attack — cite specific log evidence.
  6. The first containment step you would take, right now.

## Constraints

- Every answer must cite specific line numbers or exact log values —
  no answer should be defensible only by vibes.
- Do not conflate the two suspicious-looking bursts; they are
  different in kind.
