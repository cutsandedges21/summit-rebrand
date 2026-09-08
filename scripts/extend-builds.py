"""One-shot: add provenance, live URL and case-study copy to each build.

`own` records whether the site was actually built here. Five of these were
marked own:false in the old site's data and lived in a separate "Inspiration"
section; two more (handhold, laser-and-me) never appeared there at all and show
real-business signals. The flag is carried forward deliberately so the set can
be filtered before launch instead of having to be re-researched.
"""
import io
import re

P = 'src/lib/builds.js'

META = {
    'halcyon':         (True,  'https://halcyon-spa-demo.vercel.app/',                  'Design & build'),
    'elixir':          (True,  'https://elixir-hotel-demo.vercel.app',                  'Design & build'),
    'piment':          (True,  'https://piment-demo.vercel.app/',                       'Design & build'),
    'meridian':        (True,  'https://summitsites-agency.github.io/meridian-studio/', 'Design & build'),
    'sterling':        (True,  'https://sterling-motors-demo.vercel.app/',              'Design & build'),
    'brand-cosmetics': (True,  'https://brand-cosmetics.vercel.app/',                   'Design & build'),
    'lamborghini':     (True,  'https://lamborghini-centenario-showcase.vercel.app/',   'Concept exercise'),
    'drinksom':        (False, 'https://www.drinksom.eu/',                              'Study'),
    'khufus':          (False, 'https://khufus.com/',                                   'Study'),
    'monads':          (False, 'https://www.monads.ch/',                                'Study'),
    'vorszk':          (False, 'https://www.vorszk.com/',                               'Study'),
    'air-center':      (False, 'https://aircenter.space/',                              'Study'),
    'handhold':        (False, None,                                                    'Study'),
    'laser-and-me':    (False, None,                                                    'Study'),
}

CASES = {
    'halcyon': (
        "A spa sells a feeling, but a website has to sell an appointment. The two pull in opposite directions: atmosphere wants space and quiet, booking wants to be unmissable.",
        "Let the photography carry the mood with almost no copy over it, and give Book exactly one place to live - fixed, always reachable, never competing with anything else on the page.",
        "A page that feels unhurried and still puts a booking two taps away. Nothing on it asks the visitor to make a second decision.",
    ),
    'elixir': (
        "Hotel booking usually happens on a phone, often in transit, often one-handed. Most hotel sites are built as though it happens on a desktop with time to spare.",
        "Rooms, rates and availability collapse into a single vertical flow with no modals and no horizontal scroll. Every tap target is sized for a thumb rather than a cursor.",
        "A booking path that survives being used badly - in a taxi, on bad signal, with one hand - because none of it depends on precision.",
    ),
    'piment': (
        "Nearly everyone arriving at a restaurant site wants one of three things: the menu, the hours, or a table. Most restaurant sites bury all three under a photo carousel.",
        "Menu, hours and reservations sit above the fold and stay there. The atmosphere shots come after, for the people who kept scrolling because they had already decided.",
        "The three things people actually came for are answered before any scrolling happens. Everything else is a bonus rather than an obstacle.",
    ),
    'drinksom': (
        "A single-product drinks brand has the opposite problem to a catalogue: too little to say, and a whole page to say it in. Padding it out reads as insecurity.",
        "One product, one claim, and a great deal of empty space treated as confidence rather than a gap. The call to action is the only element competing for attention.",
        "A page short enough to read in full, which is rarer and more persuasive than a page long enough to seem thorough.",
    ),
    'khufus': (
        "Restaurant photography is the strongest asset most restaurants own, and the thing their websites most often shrink into thumbnails.",
        "Full-bleed imagery with type kept deliberately small and out of the way. The interface recedes until the visitor wants something from it.",
        "The food does the persuading. The site's only job is to not interrupt it, then hand over a reservation link at the right moment.",
    ),
    'meridian': (
        "A design studio's portfolio has to demonstrate taste through its own restraint. Over-designing it undermines the argument it is trying to make.",
        "An editorial grid, generous margins, and no interface flourishes at all. The work sits on the page at scale with nothing decorating it.",
        "A portfolio that gets out of the way of the work - which for a studio is the entire pitch, made structurally rather than stated.",
    ),
    'monads': (
        "Enterprise consultancies default to capability decks: long lists of acronyms that tell a visitor nothing about whether they can help.",
        "Lead with a single plain sentence about what the work actually is, then let the detail unfold for the people who need it. No jargon above the fold.",
        "A technical firm that reads as legible rather than impressive, which is the harder and more useful of the two.",
    ),
    'vorszk': (
        "A brand statement page has no product to show and no feature list to fall back on. It either establishes a tone in seconds or it fails.",
        "One line, one action, and enough space around them that the restraint reads as deliberate. Everything decorative was removed until only the tone remained.",
        "A page that communicates position rather than information - and knows that is all it is trying to do.",
    ),
    'sterling': (
        "Luxury automotive sites tend to bury the one thing a serious buyer wants: a way to reserve a specific car without a phone call.",
        "The marque, the lineup and the gallery lead, with Reserve pinned to the corner throughout so it is never more than a glance away.",
        "Browsing and buying stop competing. The visitor can spend as long as they like in the gallery without losing the thread back to the enquiry.",
    ),
    'handhold': (
        "B2B software has to explain something unfamiliar to a sceptical reader in the time it takes them to decide to leave.",
        "One promise, one demo action, and social proof doing the rest of the work instead of a feature matrix nobody reads.",
        "A page that makes the product understood before it tries to make it wanted.",
    ),
    'laser-and-me': (
        "Clinics are usually coy about price, which forces every interested visitor into a phone call before they know whether they can afford it.",
        "Treatments, prices and booking presented plainly on one page, with no gated consultation step in between.",
        "Fewer enquiries, better ones. The people who make contact have already self-selected on price.",
    ),
    'air-center': (
        "A three-letter brand with no product to show has to make an abstraction feel like a place worth enquiring about.",
        "Three letters, one line of copy, one action, and nothing else on the screen. Scale and emptiness do all the work.",
        "A teaser that reads as deliberate rather than unfinished - a distinction that rests entirely on spacing.",
    ),
    'brand-cosmetics': (
        "A cosmetics catalogue grows. A grid that looks elegant with twelve products often collapses at forty.",
        "A product grid designed against a catalogue three times the current size, so growth never forces a redesign.",
        "A layout that will still hold when the range expands, which is the cheapest thing to get right early and the most expensive to retrofit.",
    ),
    'lamborghini': (
        "A pure exercise: take a subject with no brief, no client and no constraints, and find out where the layout language actually breaks.",
        "Push scale, contrast and motion further than any real project would tolerate, then see which decisions still hold up.",
        "A useful map of the edges. Several restraint decisions elsewhere on this site came from finding out what too much looked like here.",
    ),
}


def esc(text):
    return text.replace("\\", "\\\\").replace("'", "\\'")


def add_fields(match):
    line = match.group(0)
    slug = re.search(r"slug: '([^']+)'", line).group(1)
    own, url, discipline = META[slug]
    challenge, approach, outcome = CASES[slug]
    url_literal = "'%s'" % url if url else 'null'
    extra = (
        "\n    own: %s,"
        "\n    url: %s,"
        "\n    year: '2025',"
        "\n    discipline: '%s',"
        "\n    challenge: '%s',"
        "\n    approach: '%s',"
        "\n    outcome: '%s',\n  "
    ) % (
        'true' if own else 'false',
        url_literal,
        discipline,
        esc(challenge),
        esc(approach),
        esc(outcome),
    )
    return line[:-2].rstrip() + ',' + extra + '}'


source = io.open(P, encoding='utf-8').read()
source = re.sub(r"\{ slug: '[^']+'.*?\}", add_fields, source, flags=re.S)
io.open(P, 'w', encoding='utf-8').write(source)
print('builds.js extended')
