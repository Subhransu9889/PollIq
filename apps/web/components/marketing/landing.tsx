"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  CheckCheck,
  ChevronDown,
  Layers3,
  Menu,
  Palette,
  Plus,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";

const palettes = [
  { name: "Midnight", color: "#c2b0ff", background: "#211b37", glow: "#7253b5" },
  { name: "Sakura", color: "#ffc3d7", background: "#35202f", glow: "#b95582" },
  { name: "Ocean", color: "#a0e6de", background: "#153235", glow: "#329c9b" },
] as const;
const questions = ["What are you here to create?", "Who is it for?", "What matters most to you?"];
const choices = [
  ["A little feedback", "My next big launch", "A community moment"],
  ["My customers", "My community", "My team"],
  ["Beautiful design", "Clear answers", "A simple workflow"],
];
const faqs = [
  [
    "What can I build with PollIQ?",
    "Build feedback forms, event registrations, waitlists, applications, and surveys. Start from a template or combine nine question types in the form builder.",
  ],
  [
    "Can I match a form to my brand?",
    "Yes. Choose from nine themes, customize your questions, and preview your form at desktop, tablet, and mobile sizes before publishing.",
  ],
  [
    "How do I share my form?",
    "Save your form, choose Public or Unlisted visibility, then publish it. Copy its unique link from your workspace and share it with your audience.",
  ],
  [
    "Where do my responses go?",
    "Submitted answers are saved to your form. Sign in to your workspace to review responses and export them for your own analysis.",
  ],
] as const;

export function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const palette = palettes[paletteIndex]!;
  const complete = step === questions.length;
  const reset = () => {
    setStep(0);
    setAnswer(null);
  };

  return (
    <div className="marketing">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="marketing-header">
        <Link href="/" className="brand" aria-label="PollIQ home">
          <span className="brand-symbol">
            <BarChart3 size={20} />
          </span>
          polliq<span className="brand-dot">®</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a>
          <a href="#themes">Made for you</a>
          <a href="#faq">FAQs</a>
        </nav>
        <div className="header-actions">
          <Link className="sign-in-link" href="/sign-in">
            Log in <ArrowUpRight size={14} />
          </Link>
          <Link className="m-button m-button-small" href="/sign-up">
            Get started <ArrowRight size={15} />
          </Link>
          <button
            className="menu-toggle"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation">
            {[
              ["How it works", "#how-it-works"],
              ["Made for you", "#themes"],
              ["FAQs", "#faq"],
              ["Log in", "/sign-in"],
            ].map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                {label}
                <ArrowUpRight size={16} />
              </a>
            ))}
          </nav>
        )}
      </header>

      <main id="main">
        <section className="marketing-hero">
          <div className="hero-copy m-enter">
            <span className="m-eyebrow">
              <span className="status-dot" /> SMALL FORMS. BIG POSSIBILITIES.
            </span>
            <h1>
              Good questions.
              <br />
              Great connections.
              <br />
              <span>A little more you.</span>
            </h1>
            <p>
              Turn a simple form into a conversation worth having. Beautiful to share. Easy to
              answer. Unmistakably yours.
            </p>
            <div className="hero-actions">
              <Link href="/sign-up" className="m-button">
                Create your first form <ArrowUpRight size={18} />
              </Link>
              <a href="#playground" className="m-text-link">
                Take it for a spin <ArrowDown size={16} />
              </a>
            </div>
            <div className="hero-footnote">
              <span>
                <Check size={14} /> No code needed
              </span>
              <span>
                <Check size={14} /> Your style, your questions
              </span>
            </div>
          </div>
          <div
            id="playground"
            className="demo-stage m-enter"
            style={
              {
                "--demo-accent": palette.color,
                "--demo-bg": palette.background,
                "--demo-glow": palette.glow,
              } as React.CSSProperties
            }
          >
            <div className="demo-orbit" aria-hidden="true" />
            <div className="demo-caption">
              <span className="status-dot" /> INTERACTIVE DEMO <span>Go on, try it ↘</span>
            </div>
            <div className="demo-card">
              <div className="demo-card-top">
                <span className="demo-mark">
                  <Sparkles size={20} />
                </span>
                <span>THE NEXT CHAPTER</span>
                <span>{complete ? "DONE" : `0${step + 1} / 03`}</span>
              </div>
              <div className="demo-content" key={step}>
                {complete ? (
                  <>
                    <div className="demo-success">
                      <CheckCheck size={32} />
                    </div>
                    <h2>That’s a great start.</h2>
                    <p>Now imagine this with your questions, your style, and your people.</p>
                    <Link href="/sign-up" className="demo-next">
                      Make it yours <ArrowUpRight size={18} />
                    </Link>
                    <button className="demo-reset" onClick={reset}>
                      <RotateCcw size={14} /> Try again
                    </button>
                  </>
                ) : (
                  <>
                    <span className="demo-kicker">LET’S MAKE SOMETHING GOOD.</span>
                    <h2>{questions[step]}</h2>
                    <p>Every good idea starts with a question.</p>
                    <fieldset className="demo-options">
                      <legend className="sr-only">{questions[step]}</legend>
                      {choices[step]!.map((option, index) => (
                        <label
                          key={option}
                          className={`demo-option ${answer === option ? "selected" : ""}`}
                        >
                          <input
                            type="radio"
                            name={`demo-question-${step}`}
                            value={option}
                            checked={answer === option}
                            onChange={() => setAnswer(option)}
                          />
                          <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                          {option}
                          <span className="option-check">
                            {answer === option && <Check size={16} />}
                          </span>
                        </label>
                      ))}
                    </fieldset>
                    <button
                      className="demo-next"
                      disabled={!answer}
                      onClick={() => {
                        setStep(step + 1);
                        setAnswer(null);
                      }}
                    >
                      Continue <ArrowRight size={18} />
                    </button>
                  </>
                )}
              </div>
              <div className="demo-bottom">
                <span>
                  Made with <b>polliq</b>
                </span>
                <span>Demo only · answers aren’t saved</span>
              </div>
            </div>
            <div className="demo-theme-bar">
              <span>A different mood?</span>
              <div role="group" aria-label="Demo theme">
                {palettes.map((item, index) => (
                  <button
                    key={item.name}
                    aria-label={`${item.name} theme`}
                    aria-pressed={paletteIndex === index}
                    style={{ background: item.color }}
                    onClick={() => setPaletteIndex(index)}
                  >
                    {paletteIndex === index && <Check size={13} />}
                  </button>
                ))}
              </div>
              <span>{palette.name}</span>
            </div>
            <div className="floating-note">
              <span>
                <Check size={15} />
              </span>{" "}
              A form that feels like you.
            </div>
          </div>
        </section>

        <div className="use-case-strip">
          <span>
            FOR THE THINGS
            <br />
            YOU’RE BUILDING.
          </span>
          {[
            "The next big idea",
            "A closer community",
            "A better experience",
            "Something entirely new",
          ].map((text) => (
            <span key={text}>
              <Plus size={15} />
              {text}
            </span>
          ))}
        </div>

        <section id="how-it-works" className="m-section">
          <div className="section-heading">
            <div>
              <span className="m-eyebrow">LESS SETUP. MORE POSSIBILITY.</span>
              <h2>
                From “what if”
                <br />
                to “tell me more.”
              </h2>
            </div>
            <p>
              Everything you need to ask better questions.
              <br />
              Nothing standing between you and the answers.
            </p>
          </div>
          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-art builder-art" aria-hidden="true">
                <div>
                  <span>
                    <Layers3 size={15} /> Your next great form <span>Draft</span>
                  </span>
                  <p>
                    <span>01</span> What should we call you? <Check size={14} />
                  </p>
                  <p>
                    <span>02</span> What’s on your mind? <Check size={14} />
                  </p>
                  <div className="add-question">
                    <Plus size={14} /> Add a little curiosity
                  </div>
                </div>
              </div>
              <div className="feature-copy">
                <span>01 / MAKE IT</span>
                <h3>Ideas in. Beautiful forms out.</h3>
                <p>
                  Start with a template or a blank canvas. Add text, choices, ratings, and more with
                  a visual builder.
                </p>
              </div>
            </article>
            <article className="feature-card">
              <div className="feature-art theme-art" aria-hidden="true">
                <div className="mini-theme mini-one">
                  <span>Hey, you.</span>
                  <i />
                  <i />
                  <i />
                </div>
                <div className="mini-theme mini-two">
                  <Sparkles size={22} />
                  <span>
                    Your kind
                    <br />
                    of different.
                  </span>
                  <i />
                </div>
                <div className="mini-theme mini-three">
                  <span>
                    Hello,
                    <br />
                    world_
                  </span>
                  <i />
                  <i />
                </div>
              </div>
              <div className="feature-copy">
                <span>02 / MAKE IT YOURS</span>
                <h3>A personality. Not a template.</h3>
                <p>
                  Find your look across nine distinct themes. Preview every detail, on every screen,
                  before sharing.
                </p>
              </div>
            </article>
            <article className="feature-card">
              <div className="feature-art response-art" aria-hidden="true">
                <div>
                  <span>
                    <span className="status-dot" /> A LITTLE CLARITY
                  </span>
                  <div className="sample-chart">
                    {[35, 52, 43, 70, 60, 85, 100].map((height, i) => (
                      <i key={i} style={{ height: `${height}%` }} />
                    ))}
                  </div>
                  <p>
                    <CheckCheck size={15} /> Every answer, in one place <span>Sample</span>
                  </p>
                </div>
              </div>
              <div className="feature-copy">
                <span>03 / START CONNECTING</span>
                <h3>Less guessing. More listening.</h3>
                <p>
                  Publish a link and let the responses come to you. Review and export answers from
                  your workspace.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section id="themes" className="m-section showcase-section">
          <div className="showcase-copy">
            <span className="m-eyebrow">BUILT FOR YOUR NEXT THING</span>
            <h2>
              Serious questions.
              <br />
              <span>Limitless personality.</span>
            </h2>
            <p>
              A product launch. A passion project. A room full of people. Whatever you’re putting
              into the world, give it a fitting first impression.
            </p>
            <Link href="/sign-up" className="m-text-link">
              Find your starting point <ArrowUpRight size={17} />
            </Link>
            <div className="showcase-tags">
              <span>Feedback</span>
              <span>Waitlists</span>
              <span>Events</span>
              <span>Applications</span>
            </div>
          </div>
          <div className="showcase-poster">
            <div className="poster-grain" />
            <span className="poster-label">YOUR NEXT CHAPTER / STARTS HERE</span>
            <div className="poster-orb" aria-hidden="true" />
            <h3>
              Something
              <br />
              good is
              <br />
              <em>coming.</em>
            </h3>
            <Link href="/sign-up" className="poster-link">
              Build your launch waitlist <ArrowUpRight size={20} />
            </Link>
            <span className="poster-bottom">
              A LITTLE CURIOSITY GOES A LONG WAY. <Sparkles size={16} />
            </span>
          </div>
        </section>

        <section id="faq" className="m-section faq-section">
          <div>
            <span className="m-eyebrow">A FEW GOOD ANSWERS</span>
            <h2>Glad you asked.</h2>
            <p>The details, before you dive in.</p>
          </div>
          <div className="faq-list">
            {faqs.map(([question, response]) => (
              <details key={question}>
                <summary>
                  {question}
                  <ChevronDown size={18} />
                </summary>
                <p>{response}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="closing-section">
          <span className="m-eyebrow">YOUR NEXT GREAT CONVERSATION STARTS HERE</span>
          <h2>
            Ask something.
            <br />
            <span>Make a connection.</span>
          </h2>
          <Link href="/sign-up" className="m-button">
            Let’s make your first form <ArrowUpRight size={18} />
          </Link>
          <span className="closing-spark" aria-hidden="true">
            ✳
          </span>
        </section>
      </main>
      <footer className="marketing-footer">
        <Link href="/" className="brand">
          <span className="brand-symbol">
            <BarChart3 size={18} />
          </span>
          polliq
        </Link>
        <p>A little more human. A little more you.</p>
        <div>
          <a href="#how-it-works">Product</a>
          <a href="#faq">FAQs</a>
          <Link href="/sign-in">
            Log in <ArrowUpRight size={13} />
          </Link>
        </div>
        <span>© {new Date().getFullYear()} PollIQ</span>
      </footer>
    </div>
  );
}
