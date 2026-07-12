// app/faq/page.tsx
import Link from 'next/link'

export const metadata = {
  title: 'FAQ | Mise en Place',
  description: 'Answers to common questions about importing recipes, techniques, pricing, and more.',
}

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: 'What does Mise en Place do?',
    a: 'It’s a recipe app that imports recipes from a URL, pasted text, or a photo of a recipe card, then teaches you the culinary techniques used in every recipe you save — tap any technique for a plain-language definition, step-by-step how-to, and a video from a professional culinary source.',
  },
  {
    q: 'Can I import recipes from TikTok or Instagram?',
    a: (
      <>
        Not reliably yet. TikTok in particular blocks the kind of automated fetch our importer uses, so pasting a TikTok link usually won’t work. Instagram is hit or miss depending on the post.
        <br /><br />
        The reliable workaround: open the video/post, copy the caption text (that’s usually where the ingredients and steps live), then use <Link href="/import" style={{ color: '#5C6B47', fontWeight: 500 }}>Import a recipe</Link> and choose <strong>&ldquo;Paste recipe text&rdquo;</strong> instead of pasting the URL. That works regardless of platform.
      </>
    ),
  },
  {
    q: 'How do I import a recipe?',
    a: (
      <>
        Head to <Link href="/import" style={{ color: '#5C6B47', fontWeight: 500 }}>Import a recipe</Link> and pick one of three ways: paste a URL from a recipe website, paste the recipe text directly, or take a photo of a printed recipe card. AI reads whichever you give it and fills in the ingredients, steps, timing, and tags automatically.
      </>
    ),
  },
  {
    q: 'Is Mise en Place free?',
    a: 'Yes — it’s free during the beta. Pricing for the full version hasn’t been finalized yet, and nothing will change on your account without notice.',
  },
  {
    q: 'Can I adjust how many servings a recipe makes?',
    a: 'Yes. On any recipe page, tap the serving count to change it and every ingredient quantity scales automatically. There’s also a US/Metric toggle for anyone who prefers grams and Celsius.',
  },
  {
    q: 'What are the culinary techniques for?',
    a: 'Every recipe you import gets tagged with the techniques it uses — things like braising, deglazing, or julienning. Tap any technique tag to see what it actually means, how to do it step by step, and a video demonstration from a professional culinary school.',
  },
  {
    q: 'Is my profile public?',
    a: 'You control that from your profile— you can keep it private (only visible to you) or make it public so other cooks can browse your recipes and follow your cooking style. Your saved/favorited recipes stay private either way.',
  },
  {
    q: 'Will there be an iOS or Android app?',
    a: 'One’s planned, but for now Mise en Place is a web app — it works well from your phone’s browser in the meantime, and you can add it to your home screen for quick access.',
  },
  {
    q: 'I found a bug, or have feedback — who do I tell?',
    a: (
      <>
        This is a beta, so bugs and rough edges are expected — please report them. Email{' '}
        <a href="mailto:miseenplacerecipessupport@gmail.com" style={{ color: '#5C6B47', fontWeight: 500 }}>
          miseenplacerecipessupport@gmail.com
        </a>{' '}
        with what happened and, if you can, what you were trying to do. Feedback on what’s confusing or missing is just as useful as bug reports.
      </>
    ),
  },
]

export default function FAQPage() {
  return (
    <main>
      {/* Header band — same visual language as the Techniques page */}
      <section style={{ background: '#5C6B47', padding: '64px 24px 56px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <Link href="/" style={{ fontSize: '12px', color: '#DCE0D2', textDecoration: 'none' }}>
            &lsaquo; Mise en Place
          </Link>
          <p style={{ fontSize: '11px', color: '#DCE0D2', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 500, marginTop: '20px', marginBottom: '8px' }}>
            Help
          </p>
          <h1 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '34px', color: '#F3EDE4', fontWeight: 400, marginBottom: '14px' }}>
            Frequently asked questions
          </h1>
          <p style={{ fontSize: '14px', color: '#DCE0D2', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto' }}>
            Common questions from beta testers, answered plainly. Can&apos;t find what you need? Email us — see the last question below.
          </p>
        </div>
      </section>

      {/* Q&A list */}
      <section style={{ padding: '48px 24px 80px', background: '#F3EDE4' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {FAQS.map((item, i) => (
            <div key={i} style={{ background: 'white', borderRadius: '14px', padding: '22px 24px', border: '0.5px solid #E4DACB' }}>
              <h2 style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontSize: '17px', color: '#21201D', fontWeight: 400, marginBottom: '8px' }}>
                {item.q}
              </h2>
              <p style={{ fontSize: '14px', color: '#5A564D', lineHeight: 1.7, margin: 0 }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
