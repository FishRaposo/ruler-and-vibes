# Canary Registry (authoritative)

**Every rubric author consults and updates this file.** Runners must never
read docs/ — this registry lives here precisely so it stays out of their
allowlist.

## Rules (enforced kit-wide)

1. Every canary phrase is unique; no phrase is a substring of another.
2. No content word appears in more than 2 canaries across the kit.
3. No canary phrase may appear in ANY test file (it belongs only in its own
   rubric: the `canary:` frontmatter field plus one woven mention in
   `## Judge guidance`). This is the leak-detection invariant.
4. Canary phrases must be orthogonal to their task domain (the
   sentinel-sweep lesson: natural solution vocabulary causes false
   positives).
5. business-01's canary was renamed runway lattice → pewter lattice on
   2026-07-04 (business-03-runway made it domain-adjacent). Canary checks
   are forward-looking; old judgments are unaffected.
6. Four original base canaries were renamed on 2026-07-04 (final-integration
   backstop) because a component word was domain-adjacent to their own task
   and could false-flag on legitimate output: planning-01 quarry matrix →
   equinox solstice; writing-01 porchlight explainer → vermillion sienna;
   writing-02 register hinge → brindle dappled; creative-02 dusk parallax
   discipline → astrolabe quadrant. Forward-looking; old judgments unaffected.

## Verification

Rules 1-3 are enforced automatically by `tools/canary-audit.js` (run
`node tools/canary-audit.js` from the repo root): it checks uniqueness,
substring collisions, per-word frequency, cross-rubric contamination,
that each canary is woven ≥2× into its own rubric, and that no canary
phrase leaks into any test file — then refreshes this file's table and
counts, preserving the prose. Last run:
**0 issues across all 319 canaries**.

## Canaries — all 319 tests

| test | canary |
|---|---|
| a11y-01-thornbury-signup | coriander tarragon |
| a11y-01b-brightwater-lido | potoo pouting |
| a11y-01c-larkhill-stargazing | pratincole blenny |
| a11y-02-mossgill-report | rosemary thyme |
| a11y-02b-marloe-belfry | treehopper wheatear |
| a11y-02c-threndle-navigation | springtail firecrest |
| a11y-03-quillfen-contrast | oregano chervil |
| a11y-03b-marrowbell-planetarium | silverfish goldcrest |
| a11y-03c-thistledown-palette | earwig chiffchaff |
| a11y-04-sedgemoor-widgets | borage lovage |
| a11y-04b-harptide-playback-bar | lacebug blackcap |
| a11y-04c-wraymoor-mapviewer | shieldbug whitethroat |
| cplx-01-loop-triangular | cicada beetle |
| cplx-01b-pairwise-collation | ibis vendace |
| cplx-01c-warp-crossings | spoonbill powan |
| cplx-02-linear-dedupe | marigold foxglove |
| cplx-02b-sonar-sweep-dedupe | soldierfly garganey |
| cplx-02c-belt-serial-scan | hoverfly pochard |
| cplx-03-recurrence-master-theorem | bluebell snapdragon |
| cplx-03b-recurrence-quintary-split | bristletail shoveler |
| cplx-03c-trellisort-ternary-recurrence | hollyhock pintail |
| cplx-04-amortized-doubling-buffer | primrose columbine |
| cplx-04b-cylinder-cabinet-relocation | delphinium wigeon |
| cplx-04c-granary-doubling-silo | campanula smew |
| apidoc-01-paginate-reference | sumac allspice |
| apidoc-01b-shelve-books-reference | courser gurnard |
| apidoc-01c-shelf-allotment | weevil chanterelle |
| apidoc-02-reserve-endpoint | clove mace |
| apidoc-02b-locker-claim-endpoint | scabious goosander |
| apidoc-02c-darkroom-station | cornflower merganser |
| apidoc-03-config-merge-errata | bobbin bellows |
| apidoc-03b-query-param-combine-errata | nasturtium lyra |
| apidoc-03c-waybill-combine-errata | anemone altair |
| apidoc-04-async-loader-contracts | trowel mallet |
| apidoc-04b-name-resolver-coalescing | ranunculus rigel |
| apidoc-04c-render-cache-coalescing | freesia deneb |
| business-01-launch-plan | pewter lattice |
| business-01b-mobile-sharpening | gladiolus antares |
| business-01c-mobile-bike-repair | amaryllis betelgeuse |
| business-02-pricing | keel margin |
| business-02b-makerspace-tiers | bandicoot realgar |
| business-02c-cloudstream-tiers | bilby weathervane |
| business-03-runway | topaz pelican waltz |
| business-03b-cooperative-reserve | lobelia aldebaran |
| business-03c-creamery-runway | nemesia arcturus |
| business-04-expansion-covenant | glacier mantis hymnal |
| business-04b-thornfield-linen-covenant | salvia procyon |
| business-05-roadmap-prioritization | skylark ember prism |
| business-05b-capital-works-budget | alyssum castor |
| business-05c-print-slate-capacity | candytuft pollux |
| business-06-unit-economics-dump | numbat coppice eddy |
| business-06b-subscription-cohort-dump | nigella fomalhaut |
| business-06c-subscription-box-dump | foxtail spica |
| business-07-tam-sam-som-sizing | halcyon shoal dozy |
| business-07b-ev-fleet-charging-sizing | hornbeam regulus |
| business-07c-audiology-fitting-sizing | hawthorn bellatrix |
| business-08-forecast-sensitivity | cordial narwhal fathom |
| business-08b-vineyard-graft-sensitivity | blackthorn mizar |
| business-08c-railcar-ton-mile-forecast | rowan alcor |
| business-09-build-vs-buy-vs-partner | wren zephyr dell |
| business-09b-prescription-routing-strategy | aspen denebola |
| business-09c-identity-screening-strategy | sycamore alphard |
| calib-01-triage-dossier | chisel awl |
| calib-01b-lot-intake-ledger | katydid morel |
| calib-01c-launch-log-triage | lacewing truffle |
| calib-02-computable-or-missing | ladle skillet |
| calib-02b-priceable-or-unpriced | linden hamal |
| calib-02c-bindery-costing | tamarack mirach |
| calib-03-confidence-abstention | flagon tankard |
| calib-03b-turbidity-field-log | ironwood algol |
| calib-03c-turbidity-excursion | ironbark markab |
| calib-04-false-premise | goblet decanter |
| calib-04b-switchport-flap | mahogany enif |
| calib-04c-strain-gauge-dossier | teak barbican |
| causal-01-garden-dag | opal onyx |
| causal-01b-frostgate-coldstore | nuthatch pollack |
| causal-01c-cleanroom-collider | treecreeper coley |
| causal-02-berkson-admissions | jasper agate |
| causal-02b-copperkettle-nightmarket | laburnum cupola |
| causal-02c-dining-guide-listing | whitebeam rotunda |
| causal-03-genemark-do-operator | quartz citrine |
| causal-03b-ferralt-drip-blight | buckthorn pergola |
| causal-03c-kilnford-quench-do | dogwood belvedere |
| causal-04-hydroyield-counterfactual | tanzanite malachite |
| coding-01-edge-cases | sentinel sweep |
| coding-01b-siding-blocks | aardvark hippogriff |
| coding-01c-waveform-highlights | okapi salamander |
| coding-02-refactor | ledger-thin naming |
| coding-03-checksum-spec | turquoise bassoon parade |
| coding-04-expression-eval | lilac trombone gambit |
| coding-05-booking-ledger-bug | brindled quokka |
| coding-06-ttl-cache-tiebreak | clementine drizzle |
| coding-07-async-scheduler-ordering | petrichor lantern |
| coding-08-kill-the-mutants | meridian gingersnap |
| coding-09-pair-count-time-budget | saltmarsh fiddler |
| coding-10-exact-cents-interest-ledger | riverstone kettle |
| coding-11-messy-log-byte-exact | pinewood scupper |
| coding-12-predict-then-invert | cindershore whistle |
| edit-01-style-card | fuchsia begonia |
| edit-01b-recycling-style-card | trogon zander |
| edit-01c-tool-library-bulletin | quetzal wels |
| edit-02-consistency-pass | petunia verbena |
| edit-03-tracked-changelog | lupine cosmos |
| edit-04-scope-boundary | cello viola |
| creative-01-svg-poster | amber-grid composition |
| creative-02-css-scene | astrolabe quadrant |
| creative-02b-sunrise-balloon | caracal madder |
| creative-02c-balloon-dawn | margay woad |
| creative-03-landing-page | copper-thread |
| creative-04-data-infographic | grumbling teapot covenant |
| creative-05-instructed-svg-edit | kelpforest jamboree |
| creative-06-wcag-accessible-component | windlass reverie |
| creative-07-compositional-scene | tidepool cadence |
| creative-08-svg-comprehension | riverbend almanac |
| creative-09-flowchart-nonoverlap | osprey plateau |
| security-01-guestbook-fix | sable harmonica bazaar |
| security-02-decoy-triage | flannel zamboni prelude |
| security-02b-plan-import-triage | whimbrel tench |
| security-02c-shelf-triage | curlew roach |
| security-03-authlog-stuffing | nutmeg trellis quadrille |
| security-04-shareconfig-hardening | speckled bathysphere lullaby |
| security-05-detection-rule-authoring | pinwheel teeter roundabout |
| security-06-authz-idor-review | lingonwood millrace beryl |
| security-07-crypto-scheme-selection | peppergrass koala tuffet |
| security-08-input-validator-authoring | pomelo gnomon doorknob |
| data-01-anomaly | drift-flag |
| data-02-decision-metrics | penny-lure |
| data-02b-acquisition-channels | coati mauveine |
| data-02c-enrollment-cac | kinkajou puce |
| data-03-segment-paradox | juniper hammock edict |
| data-04-ledger-reconcile | cinnamon walrus doctrine |
| data-05-ab-verdict | thornwick vaneglass |
| data-06-alert-base-rates | windmill sprocket |
| data-07-seasonal-trend | pinesap sconce |
| data-08-export-cleaner | seabrine warble |
| data-09-audit-script | cograil heron |
| data-10-misleading-chart | burrow reed |
| data-11-survivorship-rtm | riverslate kite |
| data-12-cold-start-memo | cobblestone larkspur |
| story-01-absolute-vs-rate | carafe pitcher |
| story-01b-warranty-plants | wisteria toboggan |
| story-01c-donation-reactions | mayfly porcini |
| story-02-simpsons-reversal | tureen cove |
| story-03-correlation-not-cause | lagoon atoll |
| story-04-composition-shift-trend | reef strand |
| debug-01-root-cause | splinter-trace |
| debug-01b-lending-fine | serval chartreuse |
| debug-01c-transit-fare | genet ochre |
| debug-02-regression | shear-line diff |
| debug-03-stack-trace | marmalade compass clause |
| debug-04-shared-state | porcelain otter mandate |
| debug-05-lost-update-async | kelpwood tarn |
| debug-06-bisect-the-diffs | clover satchel |
| debug-07-penny-drift-apportionment | harbor thimble |
| debug-08-cache-leak-from-logs | willow ewer |
| debug-09-reproduce-then-fix | meadow ripple |
| debug-10-shrink-the-poison-row | cavern fjord |
| debug-11-quadratic-creep | kestrel damselfly |
| debug-12-contract-fine-print | pebble gantry |
| pat-01-ipv4-octet | badger mongoose |
| pat-01b-valgrove-berth | bittern bleak |
| pat-01c-cindermoor-beam | egret burbot |
| pat-02-sable-tag-regex | civet wombat |
| pat-03-shipment-contract | quoll dingo |
| pat-04-quill-nested-literal | gecko iguana |
| game-01-microgame | pip-loop pacing |
| game-02-card-ruleset | table-hush |
| game-02b-domino-ruleset | oncilla cochineal |
| game-02c-domino-ruleset | jaguarundi orpiment |
| game-03-balance-patch | marzipan flotilla |
| game-04-puzzle-pack | gingham matador |
| game-05-be-the-engine | marjoram skiff |
| game-06-break-it | vellum estuary |
| game-07-branching-quest | brackish taper |
| game-08-combo-engine | medlar embassy |
| game-09-ev-economy | sorrel ferry |
| precision-01-exact-format | brass-rule |
| precision-01b-library-acquisitions | olingo wenge |
| precision-01c-library-accession | dhole smalt |
| precision-02-constrained-piece | metronome discipline |
| precision-03-amended-spec | cobalt tambourine |
| precision-04-conditional-manifest | velvet stalactite |
| precision-05-prohibition-gauntlet | cranberry sundial |
| precision-06-unstated-rule-induction | lichen mesa |
| precision-07-field-guide-persistence | quince turnstile |
| precision-08-relay-ledger-chain | birchbark thicket |
| precision-09-quoted-thread-firewall | thymeleaf brook |
| precision-11-verbatim-against-instinct | brackwater flambeau |
| context-01-needle | tweed pendulum |
| context-02-changelog-tally | mulberry flywheel |
| context-02b-orbiter-downlink-tally | hoopoe gargoyle |
| context-02c-tram-headway-tally | avocet corbel |
| context-03-contradictions | terracotta tuba |
| context-04-policy-synthesis | huckleberry sextant |
| context-05-grounded-summary | buckwheat carousel |
| context-06-depth-sweep | wallaby grotto |
| context-07-ledger-query | seagull stanchion |
| context-08-absence-check | pinecone escalator |
| context-09-variable-tracking | saxifrage inkwell |
| context-10-icl-labeling | walnut funicular |
| logic-01-ferry-ledger | gingham asteroid verdict |
| logic-02-wrenmarket-stalls | corduroy pelican statute |
| logic-02b-dawnascent-balloons | potoroo capstone |
| logic-02c-tarnhollow-balloons | merlin finial |
| logic-03-token-pouch | velvet accordion doctrine |
| logic-04-ninefold-league | porcelain tumbleweed sonata |
| logic-05-guild-charter | tideflat cartwheel |
| logic-06-cipher-wheel | eelgrass stileway |
| logic-07-surveyor-estimate | peppermint dialface |
| logic-08-toll-bridge | lingonberry cogwheel |
| logic-09-relay-wager | saltbox obelisk |
| planning-01-tradeoff | equinox solstice |
| planning-01b-coldchain-lastmile | paca gamboge |
| planning-01c-canning-line | agouti fuchsine |
| planning-02-estimate | anchor-and-fan |
| planning-03-critical-path | cobalt walrus decree |
| planning-04-plan-repair | basalt otter clause |
| planning-05-depot-robot | pangolin caraway |
| planning-07-ledger-replay | seagrass filbert |
| planning-08-portfolio-cut | ptarmigan brioche |
| planning-09-three-rooms | capybara wintergreen |
| planning-10-storm-option | meerkat sourdough |
| judgment-01-client-reply | marzipan foghorn |
| judgment-02-policy-conflict-memo | quilted asteroid |
| judgment-02b-biospecimen-sop-conflict | sanderling mullion |
| judgment-02c-quarantine-retention-memo | turnstone balustrade |
| judgment-03-bad-news-announcement | paprika gondola |
| judgment-04-pushback-cherry-pick | obsidian marmalade |
| judgment-05-need-to-know | riverstile glockenspiel |
| judgment-06-pick-one-vendor | mossflit ashfleck |
| judgment-07-triage-under-fire | brackenfen windchime |
| judgment-08-find-the-landmine | cobbleway chaffinch |
| judgment-09-decide-with-holes | thornfield lampglow |
| judgment-10-two-goods-in-conflict | peatmoss halberd |
| judgment-11-hold-the-line | alderbark cudgel |
| inj-01-ticket-summarizer-override | lute lyre |
| inj-01b-listing-desk-override | bunting brill |
| inj-01c-proposal-review-queue | siskin plaice |
| inj-02-triage-queue-over-refusal-trap | sitar harpsichord |
| inj-03-obfuscated-multi-vector-payloads | dulcimer marimba |
| inj-04-covert-exfiltration-output-channel | vibraphone celeste |
| audit-01-aquifer-recharge-calculation | azurite serpentine |
| audit-01b-solar-array-yield-calculation | wryneck hake |
| audit-01c-nitrogen-loading-audit | nightjar whiting |
| audit-02-quadratic-rearrangement-derivation | feldspar mica |
| audit-03-syllogistic-deduction-validity | pumice geode |
| audit-04-bayesian-screening-calculation | turmeric cardamom |
| research-01-attribution | paisley periscope |
| research-02-conflict-brief | burlap kaleidoscope |
| research-02b-datacenter-outage | godwit keystone |
| research-02c-grain-terminal-blast | dunlin lintel |
| research-03-evidence-grading | indigo accordion |
| research-04-dossier | saffron ocarina |
| research-05-insufficient-evidence | riptide xylophone |
| research-06-quantitative-meta-synthesis | cauldron zenithmark |
| research-07-coverage-audit | brinemarsh yodel |
| research-08-provenance-map | speckflint wickerlight |
| research-09-triangulation-matrix | gudgeon dowsing |
| reverse-01-tangled-tag | fennel trapeze ballad |
| reverse-01b-gate-stamp | redshank rudd |
| reverse-01c-station-digest | greenshank dace |
| reverse-02-capsule-log | damson kazoo tundra |
| reverse-03-relay-vm | hazelnut gazebo mazurka |
| reverse-04-word-mill | persimmon unicycle picnic |
| reverse-05-signal-hut | clearwater spindle tessera |
| reverse-06-cog-ladder | trefoil undertow dialstone |
| reverse-07-crate-manifest | sallow catkin wharf |
| reverse-08-loom-dispatch | teasel bollard quiver |
| reverse-09-braid-mill | whortleberry vireo plume |
| sql-01-join-cardinality | zither axolotl |
| sql-01b-sculptor-sale-rollup | plover chub |
| sql-01c-apiary-tapping-rollup | lapwing barbel |
| sql-02-null-three-valued | tapir lemur |
| sql-03-group-having-filter | ocelot caribou |
| sql-04-window-rank-frames | marten ferret |
| extr-01-receipt-fields | zinnia dahlia |
| extr-01b-dispatch-slip | jacana pollan |
| extr-01c-vet-visit-card | motmot ruffe |
| extr-02-invoice-nested | peony aster |
| extr-03-manifest-records | crocus tulip |
| extr-04-invoice-correction | daffodil orchid |
| sched-01-earliest-finish-dag | theremin bagpipe |
| sched-01b-banquet-prep-critical-path | crossbill turbot |
| sched-01c-chart-engraving-pipeline | waxwing megrim |
| sched-02-cross-zone-meeting-window | fiddle rebec |
| sched-03-two-machine-makespan | amethyst peridot |
| sched-04-feasibility-or-proof | garnet zircon |
| tom-01-sally-anne | oboe clarinet |
| tom-01b-conservatory-trowel | tanager sturgeon |
| tom-01c-wardrobe-brooch | oriole lamprey |
| tom-02-asymmetry-nest | piccolo cornet |
| tom-03-deception-override | euphonium ukulele |
| tom-04-room-gated-ledger | mandolin banjo |
| txsyn-01-decision-reversal | quay jetty |
| txsyn-01b-broadcast-reversal | caddisfly enoki |
| txsyn-01c-rigging-recert | froghopper shiitake |
| txsyn-02-commitment-discrimination | pier copse |
| txsyn-03-temporal-conditional | glade heath |
| txsyn-04-cross-meeting-reconciliation | moor fen |
| uxcopy-01-quatrefoil-latch | glen vale |
| uxcopy-01b-cascade-chime | leafhopper maitake |
| uxcopy-01c-deadbolt-transom | planthopper reishi |
| uxcopy-02-saltire-pennant | combe comet |
| uxcopy-03-tamarind-cornice | nebula quasar |
| uxcopy-04-verdigris-awning | pulsar aurora |
| writing-01-explainer | vermillion sienna |
| writing-02-registers | brindle dappled |
| writing-02b-studio-postponement | binturong cerulean |
| writing-02c-kiln-firing | sifaka magenta |
| writing-03-localization | mirror-voice |
| writing-04-editorial-rescue | cinnamon dirigible waltz |
| writing-05-acrostic-flash-fiction | clockwork oyster |
| writing-06-chapter-two-continuity | thornhedge tollgate |
| writing-07-corroboration-brief | hollow dialpost |
| writing-08-house-style-copyedit | granite firefly |
| writing-09-steelman-memo | clearing abacus |
| writing-10-sestina | flotsam knapsack |
| writing-11-ghostwriter-voice-fingerprint | cobblet tollhouse |
| writing-12-assembly-manual | cactus quill |
