/* Style: « Code éditorial bilingue » — ivoire, violet signal, annotation mono et fenêtre de code. */
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  ChevronDown,
  Code2,
  Github,
  Linkedin,
  Mail,
  Menu,
  Moon,
  Send,
  Sun,
  X,
} from "lucide-react";

type Language = "fr" | "en" | "ar";

const languageMeta: Record<Language, { short: string; label: string; dir: "ltr" | "rtl" }> = {
  fr: { short: "FR", label: "Français", dir: "ltr" },
  en: { short: "EN", label: "English", dir: "ltr" },
  ar: { short: "ع", label: "العربية", dir: "rtl" },
};

const content = {
  fr: {
    metaTitle: "Hamza — Développeur Full-Stack",
    nav: ["accueil", "à propos", "projets", "contact"],
    language: "Langue",
    requestCv: "Demander le CV",
    menu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    hero: {
      eyebrow: "bienvenue sur mon portfolio",
      titleLead: "Salut, moi c’est",
      roles: ["Développeur Full-Stack", "React & Laravel", "Freelance sur Fiverr"],
      description:
        "Étudiant ingénieur (cycle MUS IIIA) et développeur full-stack basé au Maroc. Je conçois des applications web modernes avec React, Laravel et FastAPI, du prototype à la mise en production.",
      projects: "Voir mes projets",
      contact: "Me contacter",
      scroll: "Défiler vers la section à propos",
      codeComments: ["profil développeur", "disponible pour collaborer"],
      codeLocation: "Maroc",
    },
    about: {
      eyebrow: "à propos",
      title: "Qui suis-je ?",
      description:
        "Je suis étudiant ingénieur au Maroc, actuellement en cycle MUS IIIA — Business Intelligence, Big Data, Blockchain et Deep Learning. En parallèle, je développe des applications web complètes en freelance, de l’interface React à l’API Laravel ou FastAPI. J’aime transformer un besoin concret en produit utilisable, propre et maintenable.",
      skills: "Compétences",
      journey: "Parcours",
    },
    skills: {
      groups: ["Frontend", "Backend", "Data & autres"],
      tagsTitle: "Outils de travail",
    },
    timeline: {
      items: [
        ["2020-2021", "Baccalauréat", "Maroc"],
        ["2024", "Technicien spécialisé — Développement Web Full Stack", "OFPPT"],
        ["2024-2025", "Licence en Ingénierie Informatique", "Université Ibn Tofail"],
        ["2025-2027 — en cours", "Master Cycle d’ingénieur — MUS IIIA"],
      ],
    },
    projects: {
      eyebrow: "projets",
      title: "Ce que j’ai construit",
      filters: ["Tous", "Web", "Design"],
      source: "Code",
      demo: "Démo",
      items: {
        gym: ["GymPro", "Web", "Une plateforme de gestion et de réservation pensée pour une expérience sportive fluide."],
        bi: ["Dashboard Business Intelligence", "Design", "Un tableau de bord clair pour rendre les données utiles aux décisions."],
        freelance: ["Projet Freelance", "Web", "Une réalisation sur mesure, de l’interface responsive à la logique métier."],
        nutri: ["NutriTrack", "Web", "Une application de suivi calorique : journal alimentaire, objectifs calculés automatiquement, macros et eau, avec graphique de progression."],
      },
    },
    contact: {
      eyebrow: "contact",
      title: "Donnons une forme claire à votre prochaine idée.",
      description: "Un projet, une mission freelance ou une question ? Écrivez-moi et parlons-en.",
      name: "Nom",
      email: "Email",
      message: "Message",
      send: "Envoyer le message",
      sent: "Votre application email va s’ouvrir.",
      required: "Veuillez compléter ce champ.",
      follow: "Me retrouver ailleurs",
    },
    footer: "Tous droits réservés.",
    backToTop: "Retour en haut",
  },
  en: {
    metaTitle: "Hamza — Full-Stack Developer",
    nav: ["home", "about", "projects", "contact"],
    language: "Language",
    requestCv: "Request CV",
    menu: "Open menu",
    closeMenu: "Close menu",
    hero: {
      eyebrow: "welcome to my portfolio",
      titleLead: "Hi, I’m",
      roles: ["Full-Stack Developer", "React & Laravel", "Freelancer on Fiverr"],
      description:
        "Engineering student (MUS IIIA program) and full-stack developer based in Morocco. I build modern web applications with React, Laravel and FastAPI, from prototype to production.",
      projects: "View my projects",
      contact: "Contact me",
      scroll: "Scroll to the about section",
      codeComments: ["developer profile", "available to collaborate"],
      codeLocation: "Morocco",
    },
    about: {
      eyebrow: "about",
      title: "Who am I?",
      description:
        "I am an engineering student in Morocco, currently enrolled in the MUS IIIA program — Business Intelligence, Big Data, Blockchain and Deep Learning. Alongside my studies, I build complete freelance web applications, from the React interface to the Laravel or FastAPI API behind it. I enjoy turning a concrete need into a clean, usable and maintainable product.",
      skills: "Skills",
      journey: "Journey",
    },
    skills: { groups: ["Frontend", "Backend", "Data & more"], tagsTitle: "Working tools" },
    timeline: {
      items: [
        ["2020-2021", "High School Diploma", "Morocco"],
        ["2024", "Specialized Technician — Full-Stack Web Development", "OFPPT"],
        ["2024-2025", "Bachelor’s Degree in Computer Engineering", "Ibn Tofail University"],
        ["2025-2027 — Present", "Master’s Engineering Program — MUS IIIA", "Business Intelligence, Big Data, Blockchain & Deep Learning"],
      ],
    },
    projects: {
      eyebrow: "projects",
      title: "What I’ve built",
      filters: ["All", "Web", "Design"],
      source: "Code",
      demo: "Demo",
      items: {
        gym: ["GymPro", "Web", "A management and booking platform designed for a frictionless fitness experience."],
        bi: ["Business Intelligence Dashboard", "Design", "A clear dashboard that turns data into useful decisions."],
        freelance: ["Freelance project", "Web", "A tailored build, from responsive interface to business logic."],
        nutri: ["NutriTrack", "Web", "A calorie-tracking app: food diary, automatically calculated goals, macros and water tracking, with a progress chart."],
      },
    },
    contact: {
      eyebrow: "contact",
      title: "Let’s give your next idea a clear shape.",
      description: "Have a project, a freelance brief or a question? Write to me and let’s talk.",
      name: "Name",
      email: "Email",
      message: "Message",
      send: "Send message",
      sent: "Your email app is about to open.",
      required: "Please complete this field.",
      follow: "Find me elsewhere",
    },
    footer: "All rights reserved.",
    backToTop: "Back to top",
  },
  ar: {
    metaTitle: "حمزة — مطوّر ويب متكامل",
    nav: ["الرئيسية", "من أنا", "المشاريع", "تواصل"],
    language: "اللغة",
    requestCv: "طلب السيرة الذاتية",
    menu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    hero: {
      eyebrow: "مرحباً بك في معرض أعمالي",
      titleLead: "مرحباً، أنا",
      roles: ["مطوّر ويب متكامل", "React و Laravel", "مستقل على Fiverr"],
      description:
        "طالب مهندس في مسار MUS IIIA ومطوّر ويب متكامل مقيم في المغرب. أبني تطبيقات ويب حديثة باستخدام React وLaravel وFastAPI، من النموذج الأولي إلى الإطلاق.",
      projects: "شاهد مشاريعي",
      contact: "تواصل معي",
      scroll: "الانتقال إلى قسم من أنا",
      codeComments: ["ملف المطوّر", "متاح للتعاون"],
      codeLocation: "المغرب",
    },
    about: {
      eyebrow: "من أنا",
      title: "من أنا؟",
      description:
        "أنا طالب مهندس في المغرب، أتابع حالياً مسار MUS IIIA في ذكاء الأعمال والبيانات الضخمة والبلوك تشين والتعلّم العميق. إلى جانب دراستي، أطور تطبيقات ويب متكاملة بشكل مستقل، من واجهة React إلى واجهة Laravel أو FastAPI الخلفية. أستمتع بتحويل الحاجة العملية إلى منتج واضح وقابل للاستخدام والصيانة.",
      skills: "المهارات",
      journey: "المسار",
    },
    skills: { groups: ["الواجهة الأمامية", "الواجهة الخلفية", "البيانات والمزيد"], tagsTitle: "أدوات العمل" },
    timeline: {
      items: [
        ["2020-2021", "شهادة البكالوريا", "المغرب"],
        ["2024", "تقني متخصص — تطوير الويب المتكامل", "مكتب التكوين المهني وإنعاش الشغل"],
        ["2024-2025", "الإجازة في هندسة المعلوماتية", "جامعة ابن طفيل"],
        ["2025-2027 — مستمر", "ماستر سلك المهندس — MUS IIIA", "ذكاء الأعمال، البيانات الضخمة، البلوك تشين والتعلم العميق"],
      ],
    },
    projects: {
      eyebrow: "المشاريع",
      title: "ما الذي أنجزته",
      filters: ["الكل", "ويب", "تصميم"],
      source: "الكود",
      demo: "عرض",
      items: {
        gym: ["GymPro", "ويب", "منصة للإدارة والحجوزات صُممت لتمنح تجربة رياضية سلسة."],
        bi: ["لوحة ذكاء الأعمال", "تصميم", "لوحة واضحة تحوّل البيانات إلى قرارات عملية."],
        freelance: ["مشروع مستقل", "ويب", "حل مصمم خصيصاً، من واجهة متجاوبة إلى منطق الأعمال."],
        nutri: ["NutriTrack", "ويب", "تطبيق لتتبع السعرات: يومية غذائية، أهداف تُحسب تلقائياً، متابعة المغذيات والماء، مع رسم بياني للتقدم."],
      },
    },
    contact: {
      eyebrow: "تواصل",
      title: "لنمنح فكرتك القادمة شكلاً واضحاً.",
      description: "لديك مشروع أو مهمة مستقلة أو سؤال؟ راسلني لنتحدث.",
      name: "الاسم",
      email: "البريد الإلكتروني",
      message: "الرسالة",
      send: "إرسال الرسالة",
      sent: "سيتم فتح تطبيق البريد الإلكتروني لديك.",
      required: "يرجى ملء هذه الخانة.",
      follow: "تابعني على",
    },
    footer: "جميع الحقوق محفوظة.",
    backToTop: "العودة إلى الأعلى",
  },
} as const;

const skillGroups = [
  [["React", 85], ["JavaScript (ES6+)", 85], ["Tailwind CSS", 80], ["HTML / CSS", 90]],
  [["Laravel", 85], ["FastAPI", 75], ["PHP", 80], ["Python", 75]],
  [["Power BI", 70], ["Big Data", 60], ["Deep Learning", 55], ["Blockchain", 50]],
] as const;

const toolTags = ["React", "Laravel", "FastAPI", "JavaScript", "PHP", "Python", "MySQL", "Tailwind CSS", "Power BI", "Git / GitHub"];

const NUTRITRACK_URL = "https://calorie-tracker-phi-nine.vercel.app";

const projectData = [
  { id: "nutri", category: "web", image: "", gradient: "green", href: NUTRITRACK_URL, stack: ["React", "Laravel", "MySQL"] },
  { id: "gym", category: "web", image: "", gradient: "violet", href: "", stack: ["React", "Laravel", "FastAPI"] },
  { id: "bi", category: "design", image: "", gradient: "blue", href: "", stack: ["React", "Laravel", "FastAPI"] },
  { id: "freelance", category: "web", image: "", gradient: "ink", href: "", stack: ["React", "Laravel", "FastAPI"] },
] as const;

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = window.localStorage.getItem("portfolio-language");
    return stored === "en" || stored === "ar" || stored === "fr" ? stored : "fr";
  });
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [roleText, setRoleText] = useState("");
  const [isDeletingRole, setIsDeletingRole] = useState(false);
  const [filter, setFilter] = useState<"all" | "web" | "design">("all");
  const [formSent, setFormSent] = useState(false);

  const t = content[language];
  const meta = languageMeta[language];
  const isRtl = meta.dir === "rtl";
  const sectionIds = ["accueil", "apropos", "projets", "contact"];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = meta.dir;
    document.title = t.metaTitle;
    window.localStorage.setItem("portfolio-language", language);
    setRoleIndex(0);
    setLanguageOpen(false);
  }, [language, meta.dir, t.metaTitle]);

  useEffect(() => {
  const currentRole = t.hero.roles[roleIndex] ?? "";

  // كتابة حرف بحرف
  if (!isDeletingRole && roleText.length < currentRole.length) {
    const timer = window.setTimeout(() => {
      setRoleText(currentRole.slice(0, roleText.length + 1));
    }, 75);

    return () => window.clearTimeout(timer);
  }

  // نخلي الجملة كاملة شوية
  if (!isDeletingRole && roleText === currentRole) {
    const timer = window.setTimeout(() => {
      setIsDeletingRole(true);
    }, 1800);

    return () => window.clearTimeout(timer);
  }

  // مسح حرف بحرف
  if (isDeletingRole && roleText.length > 0) {
    const timer = window.setTimeout(() => {
      setRoleText(currentRole.slice(0, roleText.length - 1));
    }, 45);

    return () => window.clearTimeout(timer);
  }

  // منين تمسحات كاملة، نمشيو للجملة التالية
  if (isDeletingRole && roleText.length === 0) {
    const timer = window.setTimeout(() => {
      setRoleIndex((current) => (current + 1) % t.hero.roles.length);
      setIsDeletingRole(false);
    }, 300);

    return () => window.clearTimeout(timer);
  }
}, [roleIndex, roleText, isDeletingRole, t.hero.roles]);
  function chooseLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage);
  }

  function submitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Portfolio — ${form.get("name") || "Contact"}`);
    const body = encodeURIComponent(`${form.get("message") || ""}\n\n${form.get("name") || ""}\n${form.get("email") || ""}`);
    window.location.href = `mailto:hamzatahiri669@gmail.com?subject=${subject}&body=${body}`;
    setFormSent(true);
  }

  const visibleProjects = filter === "all" ? projectData : projectData.filter((project) => project.category === filter);

  return (
    <div className={`portfolio-shell ${isRtl ? "is-rtl" : ""}`} data-theme={theme} dir={meta.dir}>
      <header className="site-header">
        <nav className="site-nav" aria-label="Main navigation">
          <button className="brand" onClick={() => scrollTo("accueil")} aria-label="Hamza">
            <span className="brand-mark" aria-hidden="true">HZ</span>
            <span className="brand-name"><i>&lt;</i>Hamza<i>/&gt;</i></span>
          </button>

          <div className="desktop-navigation">
            {t.nav.map((label, index) => (
              <button key={sectionIds[index]} className="nav-link" onClick={() => scrollTo(sectionIds[index])}>
                <span>//</span>{label}
              </button>
            ))}
          </div>

          <div className="nav-actions">
            <div className="language-wrapper">
              <button
                className="language-trigger"
                aria-label={t.language}
                aria-haspopup="menu"
                aria-expanded={languageOpen}
                onClick={() => setLanguageOpen((open) => !open)}
              >
                <span>{meta.short}</span><ChevronDown size={15} aria-hidden="true" />
              </button>
              {languageOpen && (
                <div className="language-menu" role="menu" aria-label={t.language}>
                  {(Object.keys(languageMeta) as Language[]).map((key) => (
                    <button key={key} role="menuitem" className={language === key ? "active" : ""} onClick={() => chooseLanguage(key)}>
                      <span>{languageMeta[key].label}</span>{language === key && <Check size={14} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="theme-button" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={theme === "light" ? "Dark mode" : "Light mode"}>
              {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            <a className="cv-link" href="mailto:hamzatahiri669@gmail.com?subject=CV%20request"><span>{t.requestCv}</span><ArrowUpRight size={15} /></a>
            <button className="mobile-menu-button" aria-label={menuOpen ? t.closeMenu : t.menu} onClick={() => setMenuOpen((open) => !open)}>
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </nav>
        {menuOpen && (
          <div className="mobile-navigation">
            {t.nav.map((label, index) => (
              <button key={sectionIds[index]} onClick={() => { scrollTo(sectionIds[index]); setMenuOpen(false); }}><span>//</span>{label}</button>
            ))}
          </div>
        )}
      </header>

      <main>
        <section className="hero section-anchor" id="accueil">
          <div className="hero-grid">
            <div className="hero-copy enter-content">
              <p className="eyebrow"><span>//</span>{t.hero.eyebrow}</p>
              <h1>{t.hero.titleLead} <em>Hamza.</em></h1>
              <p className="role-line" aria-live="polite">
                 {roleText}<b>|</b>
              </p>
              <p className="hero-description">{t.hero.description}</p>
              <div className="hero-ctas">
                <button className="primary-button" onClick={() => scrollTo("projets")}>{t.hero.projects}<ArrowDown size={16} /></button>
                <button className="secondary-button" onClick={() => scrollTo("contact")}>{t.hero.contact}</button>
              </div>
              <div className="social-links" aria-label="Social links">
                <a href="https://github.com/hamzathr03" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={20} /></a>
                <a href="https://linkedin.com/in/ton-pseudo" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={20} /></a>
                <a href="mailto:hamzatahiri669@gmail.com" aria-label="Email"><Mail size={20} /></a>
              </div>
            </div>

            <div className="code-window enter-code" aria-label="Hamza JSX code profile">
              <div className="code-window-bar"><span className="dot red" /><span className="dot yellow" /><span className="dot green" /><span className="file-label">hamza.jsx</span></div>
              <div className="code-body">
                <p><b>const</b> <strong>Hamza</strong> = () =&gt; {'{'}</p>
                <div className="code-indent">
                  <div className="profile-token"><span className="profile-mark" aria-hidden="true">HZ</span><div><span>// {t.hero.codeComments[0]}</span><span>// {t.hero.codeComments[1]}</span></div></div>
                  <p><i>return</i> (</p>
                  <p className="code-indent">&lt;<strong>Developer</strong></p>
                  <p className="code-indent-2">name=<i>"Hamza"</i></p>
                  <p className="code-indent-2">stack=<i>{'{["React", "Laravel", "FastAPI"]}'}</i></p>
                  <p className="code-indent-2">basedIn=<i>"{t.hero.codeLocation}"</i></p>
                  <p className="code-indent">/&gt;</p>
                  <p>)</p>
                </div>
                <p>{'}'}</p>
              </div>
            </div>
          </div>
          <button className="scroll-cue" onClick={() => scrollTo("apropos")} aria-label={t.hero.scroll}><ArrowDown size={20} /></button>
        </section>

        <section className="about section-anchor" id="apropos">
          <div className="section-intro">
            <p className="eyebrow"><span>//</span>{t.about.eyebrow}</p>
            <h2>{t.about.title}</h2>
            <p>{t.about.description}</p>
          </div>
          <div className="about-grid">
            <article className="skill-panel">
              <h3>{t.about.skills}</h3>
              {skillGroups.map((group, groupIndex) => (
                <div className="skill-group" key={t.skills.groups[groupIndex]}>
                  <p>{t.skills.groups[groupIndex]}</p>
                  {group.map(([name, level]) => <div className="skill-row" key={name}><span>{name}</span><div className="skill-track"><i style={{ width: `${level}%` }} /></div><b>{level}%</b></div>)}
                </div>
              ))}
              <div className="tool-tags"><p>{t.skills.tagsTitle}</p><div>{toolTags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
            </article>
            <article className="timeline-panel">
              <h3>{t.about.journey}</h3>
              <ol className="timeline">
                {t.timeline.items.map(([year, title, place]) => <li key={`${year}-${title}`}><span className="timeline-dot" /><p>{year}</p><h4>{title}</h4><small>{place}</small></li>)}
              </ol>
            </article>
          </div>
        </section>

        <section className="projects section-anchor" id="projets">
          <div className="projects-heading"><div><p className="eyebrow"><span>//</span>{t.projects.eyebrow}</p><h2>{t.projects.title}</h2></div><div className="filters" aria-label="Project filters">{(["all", "web", "design"] as const).map((key, index) => <button key={key} className={filter === key ? "active" : ""} onClick={() => setFilter(key)}>{t.projects.filters[index]}</button>)}</div></div>
          <div className="project-grid">
            {visibleProjects.map((project) => {
              const item = t.projects.items[project.id];
              return <article key={project.id} className={`project-card ${project.gradient}${project.href ? " is-link" : ""}`}>
                <div className={`project-visual ${project.id === "gym" ? "gym-art" : project.id === "nutri" ? "gym-art nutri-art" : project.id === "bi" ? "bi-art" : ""}`}>
                  {project.id === "gym" ? (
                    <div className="project-art-content"><span className="art-kicker">GYM / APP</span><strong>GymPro</strong><small>Booking · Members · Training</small></div>
                  ) : project.id === "nutri" ? (
                    <div className="project-art-content"><span className="art-kicker">FOOD / TRACKER</span><strong>NutriTrack</strong><small>Calories · Macros · Water</small></div>
                  ) : project.id === "bi" ? (
                    <div className="project-art-content"><span className="art-kicker">DATA / BI</span><strong>Insights</strong><div className="art-bars"><i /><i /><i /><i /><i /></div></div>
                  ) : (
                    <div className="code-ornament"><Code2 size={52} /><span>01</span><span>10</span><span>01</span></div>
                  )}
                </div>
                <div className="project-content"><div className="project-meta"><span>{item[1]}</span><span>2026</span></div><h3>{item[0]}</h3><p>{item[2]}</p><div className="project-footer"><div className="stack-list">{project.stack.map((tech) => <span key={tech}>{tech}</span>)}</div>{project.href ? (
                  <a className="stretched-link" href={project.href} target="_blank" rel="noreferrer" aria-label={`${t.projects.demo}: ${item[0]}`}><ArrowUpRight size={18} /></a>
                ) : (
                  <a href="mailto:hamzatahiri669@gmail.com?subject=Project%20inquiry" aria-label={`${t.projects.demo}: ${item[0]}`}><ArrowUpRight size={18} /></a>
                )}</div></div>
              </article>;
            })}
          </div>
        </section>

        <section className="contact section-anchor" id="contact">
          <div className="contact-copy"><p className="eyebrow"><span>//</span>{t.contact.eyebrow}</p><h2>{t.contact.title}</h2><p>{t.contact.description}</p><div className="contact-direct"><a href="mailto:hamzatahiri669@gmail.com"><Mail size={18} />hamzatahiri669@gmail.com</a><div><p>{t.contact.follow}</p><span><a href="https://linkedin.com/in/ton-pseudo" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://github.com/hamzathr03" target="_blank" rel="noreferrer">GitHub</a></span></div></div></div>
          <form className="contact-form" onSubmit={submitContact}>
            <label>{t.contact.name}<input name="name" required placeholder={t.contact.name} /></label>
            <label>{t.contact.email}<input type="email" name="email" required placeholder="you@example.com" /></label>
            <label>{t.contact.message}<textarea name="message" required rows={5} placeholder={t.contact.message} /></label>
            <button type="submit" className="primary-button">{t.contact.send}<Send size={16} /></button>
            {formSent && <p className="form-success"><Check size={16} />{t.contact.sent}</p>}
          </form>
        </section>
      </main>

      <footer className="site-footer"><button className="brand footer-brand" onClick={() => scrollTo("accueil")}><span className="brand-mark" aria-hidden="true">HZ</span><span className="brand-name"><i>&lt;</i>Hamza<i>/&gt;</i></span></button><p>© {new Date().getFullYear()} Hamza. {t.footer}</p><button className="to-top" onClick={() => scrollTo("accueil")} aria-label={t.backToTop}><ArrowDown size={18} /></button></footer>
    </div>
  );
}
