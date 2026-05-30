import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const COLORS = {
  obsidian: "#0A0A0F",
  deep: "#111118",
  surface: "#16161F",
  surfaceAlt: "#1C1C28",
  border: "#2A2A3A",
  borderLight: "#3A3A50",
  gold: "#C9A84C",
  goldLight: "#E8C96A",
  goldDim: "#8A6F2E",
  cream: "#F5F0E8",
  creamDim: "#C8C0B0",
  muted: "#666680",
  text: "#E8E4DC",
};

// ─── DATA ────────────────────────────────────────────────────────────────────

const QUIZ_QUESTIONS = [
  {
    id: 1,
    category: "prise_de_parole",
    text: "Avant de prendre la parole en public, vous ressentez…",
    type: "scale",
    label_low: "Rien — c'est naturel",
    label_high: "Une anxiété intense",
  },
  {
    id: 2,
    category: "camera",
    text: "Face à une caméra ou en vidéo, vous êtes…",
    type: "choice",
    options: ["À l'aise, vous oubliez qu'elle est là", "Un peu crispé(e) mais ça passe", "Bloqué(e), vous ne savez plus quoi dire", "Vous évitez la caméra au maximum"],
  },
  {
    id: 3,
    category: "structure",
    text: "Quand vous expliquez quelque chose d'important, votre discours est…",
    type: "choice",
    options: ["Clair, structuré, facile à suivre", "Assez clair mais parfois trop long", "Un peu dispersé, vous perdez le fil", "Difficile à organiser dans le feu de l'action"],
  },
  {
    id: 4,
    category: "imposteur",
    text: "Vous pensez légitimement à partager votre expertise publiquement ?",
    type: "scale",
    label_low: "Oui, pleinement",
    label_high: "Non, qui suis-je pour ça ?",
  },
  {
    id: 5,
    category: "vente",
    text: "Parler de vos offres, prix ou services en face-à-face…",
    type: "choice",
    options: ["C'est naturel, vous aimez ça", "Vous le faites mais avec un peu d'inconfort", "Vous minimisez toujours votre valeur", "Vous évitez ce moment au maximum"],
  },
  {
    id: 6,
    category: "contenu",
    text: "Créer du contenu régulier (posts, vidéos, podcasts) vous semble…",
    type: "scale",
    label_low: "Facile et motivant",
    label_high: "Épuisant et angoissant",
  },
  {
    id: 7,
    category: "voix",
    text: "En situation de stress, votre voix…",
    type: "choice",
    options: ["Reste stable et assurée", "Accélère un peu", "Se fragilise ou tremble légèrement", "Vous vous perdez dans votre débit"],
  },
  {
    id: 8,
    category: "storytelling",
    text: "Raconter votre parcours ou votre histoire pro vous paraît…",
    type: "scale",
    label_low: "Naturel et puissant",
    label_high: "Difficile et gênant",
  },
  {
    id: 9,
    category: "prise_de_parole",
    text: "Vous préparez vos interventions importantes…",
    type: "choice",
    options: ["Très peu — l'impro c'est mieux pour moi", "Un peu mais vite", "Beaucoup mais jamais assez", "Tellement que ça paralyse"],
  },
  {
    id: 10,
    category: "visibilite",
    text: "Votre visibilité en ligne reflète-t-elle vraiment votre niveau réel d'expertise ?",
    type: "scale",
    label_low: "Oui, totalement",
    label_high: "Non, je suis largement sous-représenté(e)",
  },
  {
    id: 11,
    category: "camera",
    text: "Vous avez déjà refusé ou remis à plus tard une opportunité de visibilité (interview, vidéo, podcast) à cause de l'appréhension ?",
    type: "choice",
    options: ["Jamais", "Une ou deux fois", "Plusieurs fois", "C'est une habitude"],
  },
  {
    id: 12,
    category: "imposteur",
    text: "Quand on vous complimente sur votre expertise, vous…",
    type: "choice",
    options: ["L'acceptez naturellement", "Dites merci mais minimisez intérieurement", "Pensez qu'ils ne voient pas vos lacunes", "Avez du mal à y croire"],
  },
];

const PROFILES = {
  stratege_invisible: {
    id: "stratege_invisible",
    name: "Le Stratège Invisible",
    emoji: "🧠",
    tagline: "Votre expertise mérite la lumière qu'elle n'a pas encore.",
    description: "Vous êtes profondément compétent(e). Votre expertise est réelle, reconnue par ceux qui vous côtoient. Mais votre voix ne résonne pas encore au-delà de votre cercle proche. Vous maîtrisez les coulisses, rarement le devant de la scène.",
    forces: ["Vision stratégique solide", "Expertise profonde et crédible", "Rigueur intellectuelle"],
    freins: ["Difficulté à se mettre en avant", "Inconfort face à la visibilité", "Tendance à sous-estimer son impact potentiel"],
    potentiel: "Une fois votre voix libérée, vous pouvez devenir une référence dans votre domaine. Votre fond est là. Il ne manque que la forme.",
    missions: ["Oser prendre sa place", "Développer sa visibilité", "Face caméra"],
    color: "#4A6FA5",
  },
  passionne_brouillon: {
    id: "passionne_brouillon",
    name: "Le Passionné Brouillon",
    emoji: "🔥",
    tagline: "Votre énergie est un atout. Votre structure, votre prochain levier.",
    description: "Vous avez une énergie communicative, un enthousiasme authentique que les gens sentent immédiatement. Mais votre discours part souvent dans tous les sens. Les idées fusent tellement vite que votre interlocuteur peine à suivre.",
    forces: ["Énergie et passion contagieuses", "Authenticité immédiate", "Capacité à susciter l'intérêt"],
    freins: ["Discours peu structuré", "Tendance à vouloir tout dire", "Difficulté à aller à l'essentiel"],
    potentiel: "Canalisée, votre passion devient votre signature. Avec une structure claire, vous devenez irrésistible.",
    missions: ["Structurer son message", "Pitcher son activité", "Storytelling express"],
    color: "#C9622A",
  },
  cameleon: {
    id: "cameleon",
    name: "Le Caméléon",
    emoji: "🌊",
    tagline: "Votre adaptabilité est rare. Votre affirmation, à construire.",
    description: "Vous lisez les gens avec une intelligence sociale remarquable. À l'aise dans la relation, vous savez vous adapter à votre interlocuteur. Mais parfois, à trop vouloir plaire, vous perdez votre propre point de vue.",
    forces: ["Intelligence relationnelle élevée", "Grande adaptabilité", "Empathie et écoute"],
    freins: ["Manque d'affirmation de soi", "Point de vue parfois dilué", "Difficulté à occuper l'espace"],
    potentiel: "Quand vous ajoutez l'affirmation à l'adaptation, vous devenez un communicant d'exception.",
    missions: ["Oser prendre sa place", "Gagner en impact", "Leadership vocal"],
    color: "#2A8A7A",
  },
  perfectionniste: {
    id: "perfectionniste",
    name: "Le Perfectionniste",
    emoji: "⚡",
    tagline: "L'imparfait publié vaut mieux que le parfait attendu.",
    description: "Vos standards sont élevés. Trop élevés parfois. Vous peaufinez, retravaillez, remettez à plus tard. La peur de ne pas être à la hauteur vous paralyse plus souvent qu'elle ne vous protège.",
    forces: ["Exigence de qualité", "Profondeur de réflexion", "Sérieux perçu"],
    freins: ["Paralysie par l'analyse", "Procrastination déguisée en perfectionnisme", "Peur du jugement"],
    potentiel: "Votre exigence, redirigée, devient une force de différenciation. Le monde a besoin de gens sérieux qui osent quand même.",
    missions: ["Oser prendre sa place", "Créer du contenu sans stress", "Face caméra"],
    color: "#7A4A9A",
  },
  createur_silencieux: {
    id: "createur_silencieux",
    name: "Le Créateur Silencieux",
    emoji: "✨",
    tagline: "Vous avez tant à offrir. Il est temps que le monde l'entende.",
    description: "Vous avez des idées profondes, une perspective unique, une créativité réelle. Mais vous préférez créer dans l'ombre. L'idée d'exposer votre image, votre voix, votre visage vous met mal à l'aise.",
    forces: ["Créativité et originalité", "Profondeur de pensée", "Sens du détail"],
    freins: ["Peur de l'exposition", "Dissonance entre valeur perçue et visibilité", "Résistance à l'image"],
    potentiel: "Un studio sécurisant, un accompagnement bienveillant — et vous découvrez que vous avez bien plus de présence que vous ne le croyez.",
    missions: ["Face caméra", "Créer du contenu sans stress", "Développer sa visibilité"],
    color: "#C9A84C",
  },
};

const MISSIONS = [
  {
    id: 1,
    title: "Oser prendre sa place",
    icon: "🎯",
    duration: "8 min",
    xp: 50,
    description: "La première étape n'est pas technique. C'est mentale. Découvrez ce qui vous retient et comment le dépasser.",
    lesson: "Prendre sa place, ce n'est pas écraser les autres. C'est assumer ce que vous avez à offrir. La prise de parole commence toujours avant la parole — elle commence dans la posture mentale.",
    examples: ["Oprah Winfrey a mis des années avant d'assumer sa singularité à l'antenne.", "Barack Obama répétait ses discours à voix haute des dizaines de fois avant chaque intervention majeure."],
    mistakes: ["Attendre d'être 'prêt' (on ne l'est jamais totalement)", "Confondre humilité et invisibilité", "Penser que les autres ont moins peur"],
    exercise: "Écrivez en 3 phrases pourquoi VOUS méritez d'être entendu(e) aujourd'hui. Pas demain. Maintenant.",
    challenge: "Prenez la parole dans un contexte où vous vous taisez habituellement. Une réunion, un dîner, un call. Dites une chose vraie.",
  },
  {
    id: 2,
    title: "Structurer son message",
    icon: "🗺️",
    duration: "10 min",
    xp: 60,
    description: "Un message clair n'est pas un message simplifié. C'est un message organisé. Apprenez la structure qui transforme les idées en impact.",
    lesson: "La structure PPP : Problème → Perspective → Proposition. Commencez par ce que votre interlocuteur ressent, donnez-lui un angle nouveau, puis proposez une direction claire. C'est le cœur de toute communication efficace.",
    examples: ["Steve Jobs présentait toujours un problème avant la solution.", "Les meilleurs TED talks suivent tous une courbe émotionnelle précise."],
    mistakes: ["Commencer par soi au lieu de l'autre", "Vouloir tout dire en une fois", "Confondre quantité et qualité d'information"],
    exercise: "Choisissez un message important à transmettre. Écrivez-le en utilisant la structure PPP en 150 mots maximum.",
    challenge: "Expliquez votre activité à quelqu'un qui ne vous connaît pas en 60 secondes. Enregistrez-vous.",
  },
  {
    id: 3,
    title: "Gagner en impact",
    icon: "⚡",
    duration: "7 min",
    xp: 70,
    description: "L'impact ne vient pas du volume. Il vient de la précision. Découvrez comment les communicants puissants font moins pour dire plus.",
    lesson: "L'impact naît du silence autant que de la parole. Une pause bien placée vaut dix mots de remplissage. Le regard compte davantage que le texte. La voix porte quand elle est posée.",
    examples: ["Les négociateurs professionnels utilisent le silence comme un outil puissant.", "Les acteurs de théâtre apprennent que le temps de réaction est aussi important que la réplique."],
    mistakes: ["Remplir tous les silences par peur du vide", "Parler trop vite par stress", "Perdre le contact visuel en cherchant ses mots"],
    exercise: "Lisez un texte à voix haute, enregistrez-vous. Réécoutez et identifiez 3 moments où une pause aurait renforcé votre message.",
    challenge: "Dans votre prochaine conversation importante, utilisez délibérément 3 silences. Observez l'effet.",
  },
  {
    id: 4,
    title: "Parler face caméra",
    icon: "📹",
    duration: "9 min",
    xp: 80,
    description: "La caméra révèle ce qu'un miroir ne montre pas. Apprenez à vous réconcilier avec votre image pour libérer votre présence.",
    lesson: "La caméra amplifie. Elle amplifie l'authenticité autant que le stress. La clé : ne pas jouer un rôle. Être une version concentrée de vous-même. Regardez l'objectif comme vous regarderiez un ami à qui vous expliquez quelque chose d'important.",
    examples: ["La plupart des YouTubeurs qui semblent naturels ont filmé des centaines d'heures avant d'y arriver.", "Les journalistes TV répètent leurs postures et regards pendant des mois."],
    mistakes: ["Lire ses notes au lieu de parler", "Oublier de respirer (le stress se voit)", "Se juger pendant qu'on tourne"],
    exercise: "Filmez-vous pendant 2 minutes en parlant de votre activité. Regardez la vidéo une seule fois, identifiez une force et un axe d'amélioration.",
    challenge: "Publiez une vidéo — même courte, même imparfaite. L'imperfection publiée bat le parfait non partagé.",
  },
  {
    id: 5,
    title: "Créer du contenu sans stress",
    icon: "🎨",
    duration: "8 min",
    xp: 65,
    description: "Le contenu régulier n'est pas une question de talent. C'est une question de système. Découvrez le vôtre.",
    lesson: "Un créateur régulier ne pense pas à ce qu'il va dire. Il a un système qui génère des idées en continu. La règle des 3 sources : ce que vous avez vécu cette semaine, une question de client, une erreur que vous avez faite. Toujours.",
    examples: ["Gary Vaynerchuk documente sa vie professionnelle plutôt que de créer du contenu.", "Les meilleurs podcasters planifient leurs épisodes 6 semaines à l'avance."],
    mistakes: ["Attendre l'inspiration", "Vouloir que chaque post soit parfait", "Ne pas recycler son contenu existant"],
    exercise: "Listez 10 questions que vos clients vous posent souvent. Chacune est un contenu potentiel.",
    challenge: "Créez et publiez un contenu cette semaine en utilisant l'une de ces 10 questions comme point de départ.",
  },
  {
    id: 6,
    title: "Pitcher son activité",
    icon: "🚀",
    duration: "10 min",
    xp: 90,
    description: "Un bon pitch ne vend pas. Il connecte. Apprenez à parler de ce que vous faites d'une façon qui résonne vraiment.",
    lesson: "Le pitch parfait répond à 3 questions dans l'ordre : Qui vous aidez → Quel problème vous résolvez → Comment c'est différent. En 30 secondes. Pas plus. C'est une invitation à une conversation, pas un argumentaire complet.",
    examples: ["Airbnb à ses débuts : 'Location de canapés entre voyageurs.' Simple. Mémorable. Différent.", "Les startups qui lèvent des fonds ont toujours un pitch condensé en une phrase avant d'aller dans les détails."],
    mistakes: ["Parler de soi avant de parler de l'autre", "Lister ses services au lieu de décrire une transformation", "Pitcher trop tôt sans avoir écouté"],
    exercise: "Rédigez votre pitch en 3 versions : 10 secondes, 30 secondes, 2 minutes. Testez chacune à voix haute.",
    challenge: "Utilisez votre pitch de 30 secondes dans une vraie situation cette semaine. Observez la réaction.",
  },
  {
    id: 7,
    title: "Développer sa visibilité",
    icon: "🌟",
    duration: "9 min",
    xp: 75,
    description: "La visibilité n'est pas une question d'ego. C'est une question de service. Découvrez pourquoi être visible est un acte de générosité.",
    lesson: "Si vous avez de la valeur et que personne ne le sait, vous privez des gens de votre aide. La visibilité est un acte de service. Votre présence en ligne n'est pas là pour vous promouvoir — elle est là pour permettre aux bonnes personnes de vous trouver.",
    examples: ["Les thérapeutes, coachs et experts qui publient régulièrement créent un niveau de confiance impossible à construire autrement.", "Un podcast est le format de visibilité le plus qualifiant : les auditeurs vous écoutent en moyenne 40 minutes."],
    mistakes: ["Attendre un profil parfait pour commencer", "Être partout au lieu d'être excellent quelque part", "Publier sans stratégie ni ligne éditoriale"],
    exercise: "Définissez votre ligne éditoriale en 3 mots : un thème principal, une cible, un ton.",
    challenge: "Planifiez 4 contenus pour le mois prochain. Thème, format, date. Écrit noir sur blanc.",
  },
];

const BADGES = [
  { id: "first_step", name: "Premier Pas", icon: "🎯", desc: "Vous avez commencé votre diagnostic" },
  { id: "profile_revealed", name: "Profil Révélé", icon: "🔮", desc: "Votre profil communicant a été dévoilé" },
  { id: "first_mission", name: "Première Mission", icon: "🚀", desc: "Votre première mission accomplie" },
  { id: "pitch_master", name: "Pitch Express", icon: "🎤", desc: "Exercice pitch complété" },
  { id: "camera_brave", name: "Face Caméra", icon: "📹", desc: "Mission caméra relevée" },
  { id: "creator", name: "Créateur", icon: "✨", desc: "Contenu planifié" },
  { id: "streak_3", name: "Série de 3", icon: "🔥", desc: "3 missions consécutives" },
  { id: "full_explorer", name: "Explorateur", icon: "⭐", desc: "Toutes les missions explorées" },
];

// ─── UTILITIES ────────────────────────────────────────────────────────────────

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (e) {
      console.error(e);
    }
  };
  return [storedValue, setValue];
}

function computeProfile(answers) {
  const scores = {
    prise_de_parole: 0, camera: 0, structure: 0, imposteur: 0,
    vente: 0, contenu: 0, voix: 0, storytelling: 0, visibilite: 0,
  };
  const counts = { ...scores };

  answers.forEach((a) => {
    if (!a) return;
    const q = QUIZ_QUESTIONS[a.questionIndex];
    if (!q) return;
    const cat = q.category;
    counts[cat] = (counts[cat] || 0) + 1;
    scores[cat] = (scores[cat] || 0) + a.score;
  });

  Object.keys(scores).forEach((k) => {
    if (counts[k]) scores[k] = scores[k] / counts[k];
  });

  const visibilityScore = (scores.camera + scores.visibilite + scores.contenu) / 3;
  const structureScore = (scores.structure + scores.storytelling) / 2;
  const confidenceScore = (scores.imposteur + scores.prise_de_parole) / 2;

  if (visibilityScore > 7 && confidenceScore < 5) return "stratege_invisible";
  if (structureScore > 6 && confidenceScore < 5) return "passionne_brouillon";
  if (scores.imposteur > 6 && scores.vente > 5) return "perfectionniste";
  if (scores.camera > 7 && visibilityScore > 6) return "createur_silencieux";
  return "cameleon";
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Nav({ page, setPage, user }) {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(10,10,15,0.92)", backdropFilter: "blur(16px)",
      borderBottom: `1px solid ${COLORS.border}`,
      padding: "0 2rem", height: "64px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <button onClick={() => setPage("home")} style={{
        background: "none", border: "none", cursor: "pointer",
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "1.25rem", fontWeight: 700,
        color: COLORS.gold, letterSpacing: "0.02em",
      }}>
        TODDA
      </button>
      <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
        {[
          { label: "Diagnostic", key: "quiz" },
          { label: "Missions", key: "missions" },
          { label: "Studio", key: "studio" },
        ].map((item) => (
          <button key={item.key} onClick={() => setPage(item.key)} style={{
            background: page === item.key ? `${COLORS.gold}18` : "none",
            border: "none", cursor: "pointer",
            color: page === item.key ? COLORS.gold : COLORS.creamDim,
            padding: "0.4rem 0.85rem", borderRadius: "6px",
            fontSize: "0.875rem", fontWeight: 500,
            transition: "all 0.2s",
          }}>
            {item.label}
          </button>
        ))}
        <button onClick={() => setPage(user ? "dashboard" : "auth")} style={{
          marginLeft: "0.5rem",
          background: COLORS.gold, border: "none", cursor: "pointer",
          color: COLORS.obsidian, padding: "0.45rem 1rem", borderRadius: "6px",
          fontSize: "0.875rem", fontWeight: 700, transition: "all 0.2s",
        }}>
          {user ? `${user.prenom}` : "Mon espace"}
        </button>
      </div>
    </nav>
  );
}

function HeroSection({ setPage }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <section style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "6rem 1.5rem 4rem",
      background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${COLORS.goldDim}22 0%, transparent 60%), ${COLORS.obsidian}`,
      textAlign: "center", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 59px, #fff 60px)",
        pointerEvents: "none",
      }} />
      <div style={{
        opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)",
        transition: "all 1.2s cubic-bezier(0.16,1,0.3,1)", maxWidth: "820px",
      }}>
        <div style={{
          display: "inline-block", marginBottom: "1.5rem",
          padding: "0.35rem 1rem", borderRadius: "100px",
          background: `${COLORS.gold}18`, border: `1px solid ${COLORS.gold}40`,
          color: COLORS.goldLight, fontSize: "0.8rem", letterSpacing: "0.12em",
          fontWeight: 600, textTransform: "uppercase",
        }}>
          Studio Podcast Marseille · TODDA
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
          fontWeight: 700, lineHeight: 1.1,
          color: COLORS.cream, marginBottom: "1.5rem", letterSpacing: "-0.02em",
        }}>
          Révèle<br />
          <span style={{ color: COLORS.gold }}>ta voix.</span>
        </h1>
        <p style={{
          fontSize: "clamp(1.05rem, 2.2vw, 1.3rem)",
          color: COLORS.creamDim, lineHeight: 1.7,
          maxWidth: "580px", margin: "0 auto 2.5rem",
        }}>
          On ne manque pas de talent. On manque souvent d'expression.
          Découvrez votre profil de communicant et libérez votre potentiel.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setPage("quiz")} style={{
            background: COLORS.gold, color: COLORS.obsidian,
            border: "none", padding: "1rem 2rem", borderRadius: "8px",
            fontSize: "1rem", fontWeight: 700, cursor: "pointer",
            transition: "all 0.25s", letterSpacing: "0.02em",
            boxShadow: `0 8px 32px ${COLORS.gold}40`,
          }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 12px 40px ${COLORS.gold}60`; }}
            onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = `0 8px 32px ${COLORS.gold}40`; }}
          >
            Découvrir mon profil →
          </button>
          <button onClick={() => setPage("studio")} style={{
            background: "transparent", color: COLORS.cream,
            border: `1px solid ${COLORS.border}`, padding: "1rem 2rem", borderRadius: "8px",
            fontSize: "1rem", fontWeight: 500, cursor: "pointer", transition: "all 0.25s",
          }}
            onMouseEnter={e => { e.target.style.borderColor = COLORS.gold; e.target.style.color = COLORS.gold; }}
            onMouseLeave={e => { e.target.style.borderColor = COLORS.border; e.target.style.color = COLORS.cream; }}
          >
            Le Studio
          </button>
        </div>
      </div>
      <div style={{
        position: "absolute", bottom: "3rem", left: "50%", transform: "translateX(-50%)",
        display: "flex", gap: "2rem",
        opacity: visible ? 0.6 : 0, transition: "opacity 2s 1.5s",
      }}>
        {["500+ professionnels formés", "Studio 4 caméras", "Marseille"].map((t, i) => (
          <div key={i} style={{
            color: COLORS.muted, fontSize: "0.8rem",
            borderTop: `1px solid ${COLORS.border}`, paddingTop: "0.5rem",
          }}>{t}</div>
        ))}
      </div>
    </section>
  );
}

function WhyTodda({ setPage }) {
  return (
    <section style={{
      padding: "7rem 1.5rem", background: COLORS.deep,
      borderTop: `1px solid ${COLORS.border}`,
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
          <div>
            <div style={{ color: COLORS.gold, fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: "1rem" }}>Philosophie</div>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700,
              color: COLORS.cream, lineHeight: 1.2, marginBottom: "1.5rem",
            }}>
              On n'aide pas à jouer un rôle.
              <span style={{ color: COLORS.gold }}> On aide à révéler sa voix.</span>
            </h2>
            <p style={{ color: COLORS.creamDim, lineHeight: 1.8, fontSize: "1.05rem", marginBottom: "1.25rem" }}>
              La prise de parole n'est pas une technique à acquérir. C'est une authenticité à libérer.
              Chez TODDA, nous croyons que chaque professionnel a une voix unique, un message précieux —
              souvent inexploité, toujours disponible.
            </p>
            <p style={{ color: COLORS.creamDim, lineHeight: 1.8, fontSize: "1.05rem", marginBottom: "2rem" }}>
              Notre approche ne vous transforme pas en quelqu'un d'autre. Elle amplifie qui vous êtes vraiment.
            </p>
            <button onClick={() => setPage("quiz")} style={{
              background: "none", border: `1px solid ${COLORS.gold}`,
              color: COLORS.gold, padding: "0.75rem 1.5rem", borderRadius: "7px",
              fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.target.style.background = `${COLORS.gold}15`; }}
              onMouseLeave={e => { e.target.style.background = "none"; }}
            >
              Commencer mon diagnostic
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {[
              { icon: "🎯", title: "Authenticité d'abord", text: "Nous partons de qui vous êtes, pas d'un modèle à copier." },
              { icon: "📈", title: "Progression mesurable", text: "Chaque étape est concrète, chaque progrès est visible." },
              { icon: "🤝", title: "Accompagnement humain", text: "La technologie amplifie, l'humain guide." },
              { icon: "🎙️", title: "Le studio comme terrain", text: "Un espace sécurisé pour oser, expérimenter, progresser." },
            ].map((v, i) => (
              <div key={i} style={{
                background: COLORS.surface, borderRadius: "12px",
                padding: "1.25rem 1.5rem", border: `1px solid ${COLORS.border}`,
                display: "flex", gap: "1rem", alignItems: "flex-start",
              }}>
                <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>{v.icon}</span>
                <div>
                  <div style={{ color: COLORS.cream, fontWeight: 600, marginBottom: "0.25rem" }}>{v.title}</div>
                  <div style={{ color: COLORS.muted, fontSize: "0.9rem", lineHeight: 1.6 }}>{v.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function QuizPage({ setPage, onComplete, existingAnswers }) {
  const [step, setStep] = useState("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(existingAnswers || []);
  const [scaleValue, setScaleValue] = useState(5);
  const [profile, setProfile] = useState(null);

  const totalQ = QUIZ_QUESTIONS.length;
  const q = QUIZ_QUESTIONS[current];

  function handleChoice(score) {
    const newAnswers = [...answers];
    newAnswers[current] = { questionIndex: current, score };
    setAnswers(newAnswers);
    if (current < totalQ - 1) {
      setCurrent(current + 1);
      setScaleValue(5);
    } else {
      finishQuiz(newAnswers);
    }
  }

  function finishQuiz(ans) {
    const p = computeProfile(ans);
    setProfile(p);
    setStep("result");
    onComplete(ans, p);
  }

  if (step === "intro") return (
    <div style={{ minHeight: "100vh", background: COLORS.obsidian, padding: "7rem 1.5rem 4rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: "640px", textAlign: "center" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: `${COLORS.gold}18`, border: `1px solid ${COLORS.gold}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", margin: "0 auto 2rem" }}>🔮</div>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: COLORS.cream, marginBottom: "1rem", fontWeight: 700 }}>Votre profil de communicant</h1>
        <p style={{ color: COLORS.creamDim, lineHeight: 1.8, marginBottom: "0.75rem" }}>
          12 questions. 4 à 6 minutes. Un portrait précis de votre style de communication, vos forces, vos freins et votre potentiel inexploité.
        </p>
        <p style={{ color: COLORS.muted, fontSize: "0.9rem", marginBottom: "2.5rem" }}>
          Il n'y a pas de bonne ou mauvaise réponse. Soyez honnête — c'est là que la magie opère.
        </p>
        <button onClick={() => setStep("quiz")} style={{ background: COLORS.gold, color: COLORS.obsidian, border: "none", padding: "1rem 2.5rem", borderRadius: "8px", fontSize: "1rem", fontWeight: 700, cursor: "pointer", boxShadow: `0 8px 32px ${COLORS.gold}40` }}>
          Commencer le diagnostic →
        </button>
      </div>
    </div>
  );

  if (step === "quiz") return (
    <div style={{ minHeight: "100vh", background: COLORS.obsidian, padding: "7rem 1.5rem 4rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: "640px", width: "100%" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ color: COLORS.muted, fontSize: "0.85rem" }}>Question {current + 1} / {totalQ}</span>
            <span style={{ color: COLORS.gold, fontSize: "0.85rem", fontWeight: 600 }}>{Math.round(((current) / totalQ) * 100)}%</span>
          </div>
          <div style={{ height: "4px", background: COLORS.border, borderRadius: "100px" }}>
            <div style={{ height: "100%", borderRadius: "100px", background: COLORS.gold, width: `${(current / totalQ) * 100}%`, transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)" }} />
          </div>
        </div>
        <div style={{ background: COLORS.surface, borderRadius: "16px", padding: "2.5rem", border: `1px solid ${COLORS.border}` }}>
          <p style={{ color: COLORS.muted, fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, marginBottom: "1.25rem" }}>{q.category.replace("_", " ")}</p>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.4rem", color: COLORS.cream, fontWeight: 700, lineHeight: 1.4, marginBottom: "2rem" }}>{q.text}</h2>
          {q.type === "scale" && (
            <div>
              <input type="range" min={0} max={10} value={scaleValue} onChange={e => setScaleValue(Number(e.target.value))} style={{ width: "100%", accentColor: COLORS.gold, marginBottom: "0.75rem" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: COLORS.muted, fontSize: "0.82rem" }}>{q.label_low}</span>
                <span style={{ color: COLORS.gold, fontWeight: 700 }}>{scaleValue}/10</span>
                <span style={{ color: COLORS.muted, fontSize: "0.82rem" }}>{q.label_high}</span>
              </div>
              <button onClick={() => handleChoice(scaleValue)} style={{ marginTop: "2rem", width: "100%", background: COLORS.gold, color: COLORS.obsidian, border: "none", padding: "0.9rem", borderRadius: "8px", fontSize: "1rem", fontWeight: 700, cursor: "pointer" }}>
                {current < totalQ - 1 ? "Suivant →" : "Voir mon profil →"}
              </button>
            </div>
          )}
          {q.type === "choice" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {q.options.map((opt, i) => {
                const score = [0, 3, 7, 10][i] ?? i * 3;
                return (
                  <button key={i} onClick={() => handleChoice(score)} style={{ background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`, color: COLORS.text, padding: "1rem 1.25rem", borderRadius: "10px", fontSize: "0.95rem", cursor: "pointer", textAlign: "left", transition: "all 0.18s", fontWeight: 400 }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.gold; e.currentTarget.style.color = COLORS.gold; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.text; }}
                  >{opt}</button>
                );
              })}
            </div>
          )}
        </div>
        {current > 0 && (
          <button onClick={() => setCurrent(current - 1)} style={{ marginTop: "1rem", background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: "0.9rem" }}>← Question précédente</button>
        )}
      </div>
    </div>
  );

  const prof = PROFILES[profile];
  if (!prof) return null;
  return (
    <div style={{ minHeight: "100vh", background: COLORS.obsidian, padding: "7rem 1.5rem 4rem" }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: `${prof.color}22`, border: `2px solid ${prof.color}60`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2.8rem", margin: "0 auto 1.5rem" }}>{prof.emoji}</div>
          <div style={{ color: COLORS.muted, fontSize: "0.8rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Votre profil</div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem, 4vw, 3rem)", color: COLORS.cream, fontWeight: 700, marginBottom: "0.75rem" }}>{prof.name}</h1>
          <p style={{ color: prof.color, fontWeight: 600, fontSize: "1.1rem", marginBottom: "1.25rem" }}>{prof.tagline}</p>
          <p style={{ color: COLORS.creamDim, lineHeight: 1.8, maxWidth: "580px", margin: "0 auto" }}>{prof.description}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "2rem" }}>
          <div style={{ background: COLORS.surface, borderRadius: "14px", padding: "1.5rem", border: `1px solid ${COLORS.border}` }}>
            <h3 style={{ color: COLORS.gold, fontWeight: 700, marginBottom: "1rem", fontSize: "0.95rem" }}>✦ Vos forces</h3>
            {prof.forces.map((f, i) => <div key={i} style={{ color: COLORS.text, fontSize: "0.9rem", marginBottom: "0.5rem", paddingLeft: "0.75rem", borderLeft: `2px solid ${COLORS.gold}40` }}>{f}</div>)}
          </div>
          <div style={{ background: COLORS.surface, borderRadius: "14px", padding: "1.5rem", border: `1px solid ${COLORS.border}` }}>
            <h3 style={{ color: COLORS.creamDim, fontWeight: 700, marginBottom: "1rem", fontSize: "0.95rem" }}>⚡ Vos freins</h3>
            {prof.freins.map((f, i) => <div key={i} style={{ color: COLORS.text, fontSize: "0.9rem", marginBottom: "0.5rem", paddingLeft: "0.75rem", borderLeft: `2px solid ${COLORS.border}` }}>{f}</div>)}
          </div>
        </div>
        <div style={{ background: `linear-gradient(135deg, ${prof.color}15, ${COLORS.surface})`, borderRadius: "14px", padding: "1.75rem", border: `1px solid ${prof.color}40`, marginBottom: "2.5rem" }}>
          <h3 style={{ color: COLORS.gold, fontWeight: 700, marginBottom: "0.75rem" }}>🚀 Votre potentiel</h3>
          <p style={{ color: COLORS.text, lineHeight: 1.7 }}>{prof.potentiel}</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: COLORS.muted, fontSize: "0.9rem", marginBottom: "1.5rem" }}>"Votre profil commence à se dessiner. Continuez votre progression."</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setPage("missions")} style={{ background: COLORS.gold, color: COLORS.obsidian, border: "none", padding: "0.9rem 1.75rem", borderRadius: "8px", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer" }}>Commencer mes missions →</button>
            <button onClick={() => setPage("studio")} style={{ background: "none", border: `1px solid ${COLORS.border}`, color: COLORS.creamDim, padding: "0.9rem 1.75rem", borderRadius: "8px", fontSize: "0.95rem", cursor: "pointer" }}>Découvrir le Studio</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MissionsPage({ setPage, userData, setUserData }) {
  const [selected, setSelected] = useState(null);
  const [exerciseText, setExerciseText] = useState("");
  const [exerciseSaved, setExerciseSaved] = useState(false);

  const completedMissions = userData.completedMissions || [];
  const xpTotal = completedMissions.reduce((sum, id) => {
    const m = MISSIONS.find(m => m.id === id);
    return sum + (m ? m.xp : 0);
  }, 0);

  function completeMission(missionId) {
    if (!completedMissions.includes(missionId)) {
      const newCompleted = [...completedMissions, missionId];
      const newXp = xpTotal + (MISSIONS.find(m => m.id === missionId)?.xp || 0);
      const newBadges = [...(userData.badges || [])];
      if (newCompleted.length === 1 && !newBadges.includes("first_mission")) newBadges.push("first_mission");
      if (newCompleted.length === 3 && !newBadges.includes("streak_3")) newBadges.push("streak_3");
      if (newCompleted.length === MISSIONS.length && !newBadges.includes("full_explorer")) newBadges.push("full_explorer");
      setUserData({ ...userData, completedMissions: newCompleted, xp: newXp, badges: newBadges });
    }
    setSelected(null);
  }

  if (selected !== null) {
    const m = MISSIONS[selected];
    const isDone = completedMissions.includes(m.id);
    const savedEx = userData.exercises?.[m.id] || "";
    return (
      <div style={{ minHeight: "100vh", background: COLORS.obsidian, padding: "7rem 1.5rem 4rem" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: "0.9rem", marginBottom: "2rem" }}>← Retour aux missions</button>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "2rem" }}>{m.icon}</span>
            <div>
              <div style={{ color: COLORS.gold, fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}>Mission {m.id}</div>
              <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.8rem", color: COLORS.cream, fontWeight: 700 }}>{m.title}</h1>
            </div>
          </div>
          <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
            <span style={{ background: `${COLORS.gold}18`, color: COLORS.gold, padding: "0.3rem 0.75rem", borderRadius: "100px", fontSize: "0.8rem", fontWeight: 600 }}>⏱ {m.duration}</span>
            <span style={{ background: `${COLORS.gold}18`, color: COLORS.gold, padding: "0.3rem 0.75rem", borderRadius: "100px", fontSize: "0.8rem", fontWeight: 600 }}>+{m.xp} XP</span>
            {isDone && <span style={{ background: "#1A3A2A", color: "#4CAF82", padding: "0.3rem 0.75rem", borderRadius: "100px", fontSize: "0.8rem", fontWeight: 600 }}>✓ Complétée</span>}
          </div>
          <div style={{ background: COLORS.surface, borderRadius: "14px", padding: "2rem", border: `1px solid ${COLORS.border}`, marginBottom: "1.5rem" }}>
            <h3 style={{ color: COLORS.gold, fontWeight: 700, marginBottom: "1rem" }}>📖 Le cours</h3>
            <p style={{ color: COLORS.text, lineHeight: 1.8 }}>{m.lesson}</p>
          </div>
          <div style={{ background: COLORS.surface, borderRadius: "14px", padding: "2rem", border: `1px solid ${COLORS.border}`, marginBottom: "1.5rem" }}>
            <h3 style={{ color: COLORS.creamDim, fontWeight: 700, marginBottom: "1rem" }}>⚠️ 3 erreurs fréquentes</h3>
            {m.mistakes.map((e, i) => (
              <div key={i} style={{ display: "flex", gap: "0.75rem", marginBottom: "0.75rem", color: COLORS.text, fontSize: "0.95rem" }}>
                <span style={{ color: COLORS.muted, flexShrink: 0 }}>{i + 1}.</span><span>{e}</span>
              </div>
            ))}
          </div>
          <div style={{ background: COLORS.surface, borderRadius: "14px", padding: "2rem", border: `1px solid ${COLORS.gold}30`, marginBottom: "1.5rem" }}>
            <h3 style={{ color: COLORS.gold, fontWeight: 700, marginBottom: "0.5rem" }}>✍️ Exercice pratique</h3>
            <p style={{ color: COLORS.creamDim, marginBottom: "1.25rem", lineHeight: 1.7 }}>{m.exercise}</p>
            <textarea
              defaultValue={savedEx}
              placeholder="Écrivez votre réponse ici…"
              onChange={e => setExerciseText(e.target.value)}
              style={{ width: "100%", minHeight: "120px", background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`, borderRadius: "8px", padding: "1rem", color: COLORS.text, fontSize: "0.95rem", resize: "vertical", lineHeight: 1.6, boxSizing: "border-box" }}
            />
            <button onClick={() => {
              setUserData({ ...userData, exercises: { ...(userData.exercises || {}), [m.id]: exerciseText } });
              setExerciseSaved(true);
              setTimeout(() => setExerciseSaved(false), 2000);
            }} style={{ marginTop: "0.75rem", background: "none", border: `1px solid ${COLORS.border}`, color: COLORS.creamDim, padding: "0.5rem 1.25rem", borderRadius: "6px", fontSize: "0.85rem", cursor: "pointer" }}>
              {exerciseSaved ? "✓ Sauvegardé !" : "Sauvegarder"}
            </button>
          </div>
          <div style={{ background: `linear-gradient(135deg, ${COLORS.goldDim}18, ${COLORS.surface})`, borderRadius: "14px", padding: "2rem", border: `1px solid ${COLORS.gold}30`, marginBottom: "2rem" }}>
            <h3 style={{ color: COLORS.gold, fontWeight: 700, marginBottom: "0.5rem" }}>🔥 Challenge de la mission</h3>
            <p style={{ color: COLORS.text, lineHeight: 1.7 }}>{m.challenge}</p>
          </div>
          {!isDone && (
            <button onClick={() => completeMission(m.id)} style={{ width: "100%", background: COLORS.gold, color: COLORS.obsidian, border: "none", padding: "1rem", borderRadius: "8px", fontSize: "1rem", fontWeight: 700, cursor: "pointer", boxShadow: `0 8px 32px ${COLORS.gold}30` }}>
              ✓ Marquer la mission comme complétée (+{m.xp} XP)
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.obsidian, padding: "7rem 1.5rem 4rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{ color: COLORS.gold, fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: "1rem" }}>Parcours</div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2rem,4vw,3rem)", color: COLORS.cream, fontWeight: 700, marginBottom: "0.75rem" }}>Booster ma communication</h1>
          <p style={{ color: COLORS.creamDim, maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>7 missions. Des progrès concrets. Un rythme humain.</p>
          {xpTotal > 0 && (
            <div style={{ marginTop: "1.25rem", display: "inline-flex", gap: "1.5rem", background: COLORS.surface, padding: "0.75rem 1.5rem", borderRadius: "100px", border: `1px solid ${COLORS.border}` }}>
              <span style={{ color: COLORS.gold, fontWeight: 700, fontSize: "0.95rem" }}>⚡ {xpTotal} XP</span>
              <span style={{ color: COLORS.muted, fontSize: "0.9rem" }}>{completedMissions.length}/{MISSIONS.length} missions</span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {MISSIONS.map((m, i) => {
            const done = completedMissions.includes(m.id);
            return (
              <button key={m.id} onClick={() => setSelected(i)} style={{ background: COLORS.surface, border: done ? `1px solid ${COLORS.gold}40` : `1px solid ${COLORS.border}`, borderRadius: "14px", padding: "1.5rem 2rem", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "1.5rem", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.gold; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = done ? `${COLORS.gold}40` : COLORS.border; }}
              >
                <div style={{ width: "52px", height: "52px", borderRadius: "12px", flexShrink: 0, background: done ? `${COLORS.gold}20` : COLORS.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>{done ? "✓" : m.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                    <span style={{ color: COLORS.muted, fontSize: "0.78rem", fontWeight: 600 }}>Mission {m.id}</span>
                    {done && <span style={{ background: "#1A3A2A", color: "#4CAF82", padding: "0.15rem 0.6rem", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 600 }}>Complétée</span>}
                  </div>
                  <div style={{ color: COLORS.cream, fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.25rem" }}>{m.title}</div>
                  <div style={{ color: COLORS.muted, fontSize: "0.88rem" }}>{m.description}</div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: "0.9rem" }}>+{m.xp} XP</div>
                  <div style={{ color: COLORS.muted, fontSize: "0.8rem" }}>{m.duration}</div>
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: "3.5rem", background: `linear-gradient(135deg, ${COLORS.goldDim}15, ${COLORS.surface})`, borderRadius: "16px", padding: "2.5rem", border: `1px solid ${COLORS.gold}30`, textAlign: "center" }}>
          <p style={{ color: COLORS.gold, fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.75rem" }}>"Certaines progressions vont plus vite lorsqu'on n'est pas seul."</p>
          <p style={{ color: COLORS.creamDim, marginBottom: "1.5rem", lineHeight: 1.7 }}>Le studio est un terrain d'entraînement sécurisé pour accélérer votre visibilité.</p>
          <button onClick={() => setPage("studio")} style={{ background: COLORS.gold, color: COLORS.obsidian, border: "none", padding: "0.85rem 1.75rem", borderRadius: "8px", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer" }}>Découvrir le Studio →</button>
        </div>
      </div>
    </div>
  );
}

function StudioPage({ setPage }) {
  return (
    <div style={{ minHeight: "100vh", background: COLORS.obsidian, padding: "7rem 1.5rem 4rem" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <div style={{ color: COLORS.gold, fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: "1rem" }}>Marseille</div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(2.2rem,5vw,3.5rem)", color: COLORS.cream, fontWeight: 700, marginBottom: "1rem", lineHeight: 1.2 }}>Studio Podcast Marseille</h1>
          <p style={{ color: COLORS.gold, fontWeight: 600, fontSize: "1.1rem", marginBottom: "1.25rem" }}>Pas une simple location. Un accélérateur de visibilité.</p>
          <p style={{ color: COLORS.creamDim, maxWidth: "600px", margin: "0 auto", lineHeight: 1.8 }}>Un espace conçu pour que vous soyez à votre meilleur — techniquement, visuellement, mentalement. Quatre caméras. Lumière calibrée. Accompagnement humain.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "3rem" }}>
          {[
            { icon: "🟡", title: "Studio Jaune", subtitle: "Jusqu'à 6 personnes", desc: "L'espace principal. Conçu pour les interviews croisées, les tables rondes podcast, les captations multi-sujets. Lumière chaude, fond professionnel.", features: ["4 caméras simultanées", "Jusqu'à 6 participants", "Éclairage calibré", "Mixage audio professionnel"] },
            { icon: "🟢", title: "Studio Vert", subtitle: "Intimité & profondeur", desc: "Pour les solos puissants, les interviews en tête-à-tête, les confessions de dirigeants. Une intimité qui crée la connexion.", features: ["Ambiance intimiste", "Parfait pour le solo", "Idéal coaching vidéo", "Acoustique optimisée"] },
          ].map((s, i) => (
            <div key={i} style={{ background: COLORS.surface, borderRadius: "16px", padding: "2rem", border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{s.icon}</div>
              <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.4rem", color: COLORS.cream, fontWeight: 700, marginBottom: "0.25rem" }}>{s.title}</h3>
              <div style={{ color: COLORS.gold, fontSize: "0.85rem", fontWeight: 600, marginBottom: "1rem" }}>{s.subtitle}</div>
              <p style={{ color: COLORS.creamDim, lineHeight: 1.7, marginBottom: "1.25rem" }}>{s.desc}</p>
              {s.features.map((f, j) => <div key={j} style={{ display: "flex", gap: "0.5rem", marginBottom: "0.4rem", color: COLORS.text, fontSize: "0.88rem" }}><span style={{ color: COLORS.gold }}>✓</span> {f}</div>)}
            </div>
          ))}
        </div>
        <div style={{ marginBottom: "4rem" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.8rem", color: COLORS.cream, fontWeight: 700, marginBottom: "2rem", textAlign: "center" }}>Ce qu'on crée ensemble</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            {[
              { icon: "🎙️", title: "Podcasts", desc: "Format long, engagement profond. Votre expertise en audio premium." },
              { icon: "📹", title: "Vidéos LinkedIn", desc: "Shorts, interviews, témoignages. Votre visibilité B2B." },
              { icon: "🎬", title: "Reels & Shorts", desc: "Contenus courts percutants pour vos réseaux sociaux." },
              { icon: "🎤", title: "Coaching vocal", desc: "Présence, voix, posture. Le travail de fond qui change tout." },
              { icon: "📐", title: "Pitch coaching", desc: "Structurer, affiner, délivrer votre meilleur pitch." },
              { icon: "🌐", title: "Stratégie contenu", desc: "Un plan éditorial qui vous ressemble et vous représente." },
            ].map((s, i) => (
              <div key={i} style={{ background: COLORS.surface, borderRadius: "12px", padding: "1.5rem", border: `1px solid ${COLORS.border}` }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{s.icon}</div>
                <div style={{ color: COLORS.cream, fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.4rem" }}>{s.title}</div>
                <div style={{ color: COLORS.muted, fontSize: "0.85rem", lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: `linear-gradient(135deg, ${COLORS.goldDim}20, ${COLORS.surface})`, borderRadius: "20px", padding: "3.5rem", border: `1px solid ${COLORS.gold}40`, textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.5rem,3vw,2rem)", color: COLORS.cream, fontWeight: 700, marginBottom: "1rem" }}>Et si on travaillait cela ensemble ?</h2>
          <p style={{ color: COLORS.creamDim, marginBottom: "2rem", lineHeight: 1.8, maxWidth: "500px", margin: "0 auto 2rem" }}>Une caméra révèle souvent ce qu'un miroir ne montre pas. Réservez un échange — gratuit, sans engagement.</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="mailto:contact@todda.fr" style={{ background: COLORS.gold, color: COLORS.obsidian, textDecoration: "none", padding: "1rem 2rem", borderRadius: "8px", fontSize: "1rem", fontWeight: 700, boxShadow: `0 8px 32px ${COLORS.gold}40` }}>Réserver un échange →</a>
            <a href="https://studiopodcastmarseille.fr" target="_blank" rel="noreferrer" style={{ background: "transparent", color: COLORS.cream, textDecoration: "none", border: `1px solid ${COLORS.border}`, padding: "1rem 2rem", borderRadius: "8px", fontSize: "1rem", fontWeight: 500 }}>studiopodcastmarseille.fr</a>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`,
  borderRadius: "8px", padding: "0.75rem 1rem",
  color: COLORS.text, fontSize: "0.95rem", outline: "none",
};

function AuthPage({ setPage, onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [rgpd, setRgpd] = useState(false);

  function handleSubmit() {
    if (!form.email || !form.password) { setError("Email et mot de passe requis."); return; }
    if (mode === "signup" && !form.prenom) { setError("Votre prénom est requis."); return; }
    if (mode === "signup" && !rgpd) { setError("Veuillez accepter la politique de confidentialité."); return; }
    if (mode === "signup") {
      const user = { prenom: form.prenom, nom: form.nom, email: form.email, createdAt: new Date().toISOString() };
      onAuth(user); setPage("dashboard");
    } else {
      const stored = JSON.parse(localStorage.getItem("todda_user") || "null");
      if (stored && stored.email === form.email) { onAuth(stored); setPage("dashboard"); }
      else { const user = { prenom: "Visiteur", email: form.email, createdAt: new Date().toISOString() }; onAuth(user); setPage("dashboard"); }
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.obsidian, padding: "7rem 1.5rem 4rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: "460px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <div style={{ color: COLORS.gold, fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.75rem" }}>{mode === "login" ? "Connexion" : "Créer mon espace"}</div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "2rem", color: COLORS.cream, fontWeight: 700, marginBottom: "0.75rem" }}>{mode === "login" ? "Content de vous revoir." : "Votre progression vous attend."}</h1>
          <p style={{ color: COLORS.muted, fontSize: "0.9rem" }}>{mode === "login" ? "Retrouvez votre parcours là où vous l'avez laissé." : "Sauvegardez vos résultats et suivez votre évolution."}</p>
        </div>
        <div style={{ background: COLORS.surface, borderRadius: "16px", padding: "2rem", border: `1px solid ${COLORS.border}` }}>
          {mode === "signup" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
              <input placeholder="Prénom *" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} style={inputStyle} />
              <input placeholder="Nom" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} style={inputStyle} />
            </div>
          )}
          <input placeholder="Email *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ ...inputStyle, width: "100%", boxSizing: "border-box", marginBottom: "0.75rem" }} />
          <input placeholder="Mot de passe *" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={{ ...inputStyle, width: "100%", boxSizing: "border-box", marginBottom: mode === "signup" ? "1rem" : "1.5rem" }} />
          {mode === "signup" && (
            <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "1.5rem", cursor: "pointer" }}>
              <input type="checkbox" checked={rgpd} onChange={e => setRgpd(e.target.checked)} style={{ marginTop: "3px", accentColor: COLORS.gold }} />
              <span style={{ color: COLORS.muted, fontSize: "0.82rem", lineHeight: 1.5 }}>J'accepte la politique de confidentialité. Mes données sont utilisées uniquement pour personnaliser mon parcours TODDA.</span>
            </label>
          )}
          {error && <div style={{ color: "#E87070", fontSize: "0.85rem", marginBottom: "1rem" }}>{error}</div>}
          <button onClick={handleSubmit} style={{ width: "100%", background: COLORS.gold, color: COLORS.obsidian, border: "none", padding: "1rem", borderRadius: "8px", fontSize: "1rem", fontWeight: 700, cursor: "pointer", boxShadow: `0 6px 24px ${COLORS.gold}30` }}>
            {mode === "login" ? "Se connecter" : "Créer mon espace gratuit"}
          </button>
          <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
            <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: "0.875rem" }}>
              {mode === "login" ? "Pas encore de compte ? Créer le mien" : "Déjà un compte ? Se connecter"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ user, userData, setPage, onLogout }) {
  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.obsidian, padding: "7rem 1.5rem 4rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: COLORS.muted, marginBottom: "1.5rem" }}>Connectez-vous pour accéder à votre espace.</p>
          <button onClick={() => setPage("auth")} style={{ background: COLORS.gold, color: COLORS.obsidian, border: "none", padding: "0.85rem 1.75rem", borderRadius: "8px", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer" }}>Se connecter →</button>
        </div>
      </div>
    );
  }

  const profile = userData.profile ? PROFILES[userData.profile] : null;
  const badges = (userData.badges || []).map(bid => BADGES.find(b => b.id === bid)).filter(Boolean);
  const completedMissions = userData.completedMissions || [];
  const xp = userData.xp || 0;
  const level = xp < 100 ? 1 : xp < 300 ? 2 : xp < 600 ? 3 : 4;
  const levelName = ["", "Communicant en devenir", "Orateur confirmé", "Voix affirmée", "Expert vocal"][level];

  return (
    <div style={{ minHeight: "100vh", background: COLORS.obsidian, padding: "7rem 1.5rem 4rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "3rem" }}>
          <div>
            <div style={{ color: COLORS.gold, fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: "0.5rem" }}>Mon espace</div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "2.2rem", color: COLORS.cream, fontWeight: 700 }}>Bonjour, {user.prenom} 👋</h1>
            <p style={{ color: COLORS.muted, marginTop: "0.25rem" }}>{levelName} · Niveau {level}</p>
          </div>
          <button onClick={onLogout} style={{ background: "none", border: `1px solid ${COLORS.border}`, color: COLORS.muted, padding: "0.5rem 1rem", borderRadius: "6px", fontSize: "0.82rem", cursor: "pointer" }}>Déconnexion</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "2.5rem" }}>
          {[
            { label: "XP Total", value: xp, icon: "⚡" },
            { label: "Niveau", value: level, icon: "🏆" },
            { label: "Missions", value: `${completedMissions.length}/${MISSIONS.length}`, icon: "🎯" },
            { label: "Badges", value: badges.length, icon: "🏅" },
          ].map((s, i) => (
            <div key={i} style={{ background: COLORS.surface, borderRadius: "14px", padding: "1.5rem", border: `1px solid ${COLORS.border}`, textAlign: "center" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{s.icon}</div>
              <div style={{ color: COLORS.gold, fontWeight: 700, fontSize: "1.5rem", marginBottom: "0.25rem" }}>{s.value}</div>
              <div style={{ color: COLORS.muted, fontSize: "0.8rem" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ background: COLORS.surface, borderRadius: "14px", padding: "1.5rem", border: `1px solid ${COLORS.border}`, marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <span style={{ color: COLORS.text, fontWeight: 600, fontSize: "0.9rem" }}>Progression niveau {level}</span>
            <span style={{ color: COLORS.gold, fontSize: "0.85rem" }}>{xp} XP</span>
          </div>
          <div style={{ height: "8px", background: COLORS.border, borderRadius: "100px" }}>
            <div style={{ height: "100%", background: `linear-gradient(90deg, ${COLORS.goldDim}, ${COLORS.gold})`, borderRadius: "100px", width: `${Math.min(100, (xp % 300) / 3)}%`, transition: "width 1s cubic-bezier(0.4,0,0.2,1)" }} />
          </div>
          <div style={{ color: COLORS.muted, fontSize: "0.8rem", marginTop: "0.5rem" }}>{level < 4 ? `${300 - (xp % 300)} XP pour le niveau suivant` : "Niveau maximum atteint !"}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          {profile ? (
            <div style={{ background: COLORS.surface, borderRadius: "14px", padding: "1.75rem", border: `1px solid ${COLORS.border}` }}>
              <h3 style={{ color: COLORS.gold, fontWeight: 700, marginBottom: "1rem" }}>🔮 Mon profil</h3>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "2rem" }}>{profile.emoji}</span>
                <div>
                  <div style={{ color: COLORS.cream, fontWeight: 700 }}>{profile.name}</div>
                  <div style={{ color: COLORS.muted, fontSize: "0.82rem" }}>{profile.tagline}</div>
                </div>
              </div>
              <button onClick={() => setPage("quiz")} style={{ marginTop: "0.5rem", background: "none", border: `1px solid ${COLORS.border}`, color: COLORS.muted, padding: "0.45rem 1rem", borderRadius: "6px", fontSize: "0.82rem", cursor: "pointer" }}>Refaire le diagnostic</button>
            </div>
          ) : (
            <div style={{ background: COLORS.surface, borderRadius: "14px", padding: "1.75rem", border: `1px solid ${COLORS.gold}30`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: "1rem" }}>
              <span style={{ fontSize: "2rem" }}>🔮</span>
              <div style={{ color: COLORS.creamDim, fontSize: "0.9rem" }}>Découvrez votre profil communicant</div>
              <button onClick={() => setPage("quiz")} style={{ background: COLORS.gold, color: COLORS.obsidian, border: "none", padding: "0.65rem 1.25rem", borderRadius: "7px", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer" }}>Faire le diagnostic</button>
            </div>
          )}
          <div style={{ background: COLORS.surface, borderRadius: "14px", padding: "1.75rem", border: `1px solid ${COLORS.border}` }}>
            <h3 style={{ color: COLORS.gold, fontWeight: 700, marginBottom: "1rem" }}>🏅 Mes badges</h3>
            {badges.length === 0 ? (
              <p style={{ color: COLORS.muted, fontSize: "0.88rem" }}>Complétez des missions pour débloquer vos premiers badges.</p>
            ) : (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                {badges.map((b, i) => (
                  <div key={i} style={{ background: COLORS.surfaceAlt, border: `1px solid ${COLORS.border}`, borderRadius: "10px", padding: "0.75rem", textAlign: "center", minWidth: "70px" }}>
                    <div style={{ fontSize: "1.5rem" }}>{b.icon}</div>
                    <div style={{ color: COLORS.muted, fontSize: "0.72rem", marginTop: "0.25rem" }}>{b.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div style={{ background: COLORS.surface, borderRadius: "14px", padding: "1.75rem", border: `1px solid ${COLORS.border}`, marginTop: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h3 style={{ color: COLORS.gold, fontWeight: 700 }}>🎯 Mes missions</h3>
            <button onClick={() => setPage("missions")} style={{ background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: "0.85rem" }}>Voir tout →</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {MISSIONS.slice(0, 4).map(m => {
              const done = completedMissions.includes(m.id);
              return (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: done ? `${COLORS.gold}20` : COLORS.surfaceAlt, border: `1px solid ${done ? COLORS.gold : COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", color: done ? COLORS.gold : COLORS.muted, flexShrink: 0 }}>{done ? "✓" : m.id}</div>
                  <span style={{ color: done ? COLORS.text : COLORS.muted, fontSize: "0.9rem" }}>{m.title}</span>
                  {done && <span style={{ marginLeft: "auto", color: COLORS.gold, fontSize: "0.8rem" }}>+{m.xp} XP</span>}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ marginTop: "2rem", background: `linear-gradient(135deg, ${COLORS.goldDim}15, ${COLORS.surface})`, borderRadius: "14px", padding: "2rem", border: `1px solid ${COLORS.gold}30`, textAlign: "center" }}>
          <p style={{ color: COLORS.gold, fontWeight: 600, marginBottom: "0.5rem" }}>{xp > 200 ? "Votre progression montre un vrai potentiel." : "Vous avez déjà les idées. Ce qu'il manque parfois, c'est le cadre et le regard extérieur."}</p>
          <p style={{ color: COLORS.creamDim, fontSize: "0.9rem", marginBottom: "1.25rem" }}>{xp > 200 ? "Certaines étapes sont souvent plus rapides avec un regard extérieur." : "Le studio peut devenir votre terrain d'entraînement pour accélérer."}</p>
          <button onClick={() => setPage("studio")} style={{ background: COLORS.gold, color: COLORS.obsidian, border: "none", padding: "0.75rem 1.5rem", borderRadius: "7px", fontSize: "0.9rem", fontWeight: 700, cursor: "pointer" }}>{xp > 200 ? "Réserver un coaching →" : "Découvrir le Studio →"}</button>
        </div>
      </div>
    </div>
  );
}

function HomePage({ setPage, userData, user }) {
  return (
    <div>
      <HeroSection setPage={setPage} />
      <WhyTodda setPage={setPage} />
      <section style={{ padding: "7rem 1.5rem", background: COLORS.obsidian, borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div style={{ color: COLORS.gold, fontSize: "0.78rem", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, marginBottom: "1rem" }}>Diagnostic</div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", color: COLORS.cream, fontWeight: 700, marginBottom: "1rem" }}>Quel communicant êtes-vous ?</h2>
            <p style={{ color: COLORS.creamDim, maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>Cinq profils. Une cartographie précise de vos forces et de votre potentiel.</p>
          </div>
          <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
            {Object.values(PROFILES).map((p) => (
              <div key={p.id} style={{ flexShrink: 0, width: "200px", background: COLORS.surface, borderRadius: "14px", padding: "1.5rem", border: `1px solid ${COLORS.border}`, textAlign: "center" }}>
                <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: `${p.color}20`, border: `1px solid ${p.color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem", margin: "0 auto 1rem" }}>{p.emoji}</div>
                <div style={{ color: COLORS.cream, fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.4rem" }}>{p.name}</div>
                <div style={{ color: COLORS.muted, fontSize: "0.8rem", lineHeight: 1.5 }}>{p.tagline}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <button onClick={() => setPage("quiz")} style={{ background: COLORS.gold, color: COLORS.obsidian, border: "none", padding: "1rem 2rem", borderRadius: "8px", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer", boxShadow: `0 8px 32px ${COLORS.gold}30` }}>Découvrir mon profil →</button>
          </div>
        </div>
      </section>
      <section style={{ padding: "5rem 1.5rem", background: COLORS.deep, borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(1.5rem,3vw,2.2rem)", color: COLORS.cream, fontWeight: 700, marginBottom: "2rem" }}>Progressez. Soyez récompensé(e).</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", flexWrap: "wrap" }}>
            {BADGES.slice(0, 5).map((b, i) => (
              <div key={i} style={{ background: COLORS.surface, borderRadius: "12px", padding: "1.25rem 1rem", border: `1px solid ${COLORS.border}`, textAlign: "center", minWidth: "110px" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>{b.icon}</div>
                <div style={{ color: COLORS.text, fontWeight: 600, fontSize: "0.85rem" }}>{b.name}</div>
                <div style={{ color: COLORS.muted, fontSize: "0.75rem", marginTop: "0.25rem" }}>{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Footer({ setPage }) {
  return (
    <footer style={{ background: COLORS.obsidian, borderTop: `1px solid ${COLORS.border}`, padding: "3rem 1.5rem" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "2rem" }}>
        <div>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "1.2rem", color: COLORS.gold, fontWeight: 700, marginBottom: "0.5rem" }}>TODDA</div>
          <div style={{ color: COLORS.muted, fontSize: "0.85rem" }}>Studio Podcast Marseille</div>
          <div style={{ color: COLORS.muted, fontSize: "0.82rem", marginTop: "0.25rem" }}>todda.fr · studiopodcastmarseille.fr</div>
        </div>
        <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
          <div>
            <div style={{ color: COLORS.creamDim, fontWeight: 600, marginBottom: "0.75rem", fontSize: "0.85rem" }}>Plateforme</div>
            {[["Diagnostic", "quiz"], ["Missions", "missions"], ["Studio", "studio"]].map(([l, p]) => (
              <button key={p} onClick={() => setPage(p)} style={{ display: "block", background: "none", border: "none", color: COLORS.muted, cursor: "pointer", fontSize: "0.83rem", padding: "0.2rem 0", marginBottom: "0.15rem" }}>{l}</button>
            ))}
          </div>
          <div>
            <div style={{ color: COLORS.creamDim, fontWeight: 600, marginBottom: "0.75rem", fontSize: "0.85rem" }}>Contact</div>
            <a href="mailto:contact@todda.fr" style={{ display: "block", color: COLORS.muted, fontSize: "0.83rem", textDecoration: "none" }}>contact@todda.fr</a>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: "1000px", margin: "2rem auto 0", paddingTop: "1.5rem", borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
        <span style={{ color: COLORS.muted, fontSize: "0.78rem" }}>© 2025 TODDA. Tous droits réservés.</span>
        <span style={{ color: COLORS.muted, fontSize: "0.78rem" }}>Données protégées · Conformité RGPD</span>
      </div>
    </footer>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useLocalStorage("todda_user", null);
  const [userData, setUserData] = useLocalStorage("todda_userData", {
    completedMissions: [], badges: ["first_step"], xp: 0, profile: null, exercises: {},
  });

  function handleQuizComplete(answers, profileId) {
    const newBadges = [...(userData.badges || ["first_step"])];
    if (!newBadges.includes("profile_revealed")) newBadges.push("profile_revealed");
    setUserData({ ...userData, quizAnswers: answers, profile: profileId, badges: newBadges });
  }

  function handleAuth(userObj) {
    setUser(userObj);
    if (!userData.badges?.includes("first_step")) {
      setUserData({ ...userData, badges: [...(userData.badges || []), "first_step"] });
    }
  }

  function handleLogout() { setUser(null); setPage("home"); }

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap";
    document.head.appendChild(link);
    document.body.style.margin = "0";
    document.body.style.background = COLORS.obsidian;
  }, []);

  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", background: COLORS.obsidian, minHeight: "100vh", color: COLORS.text }}>
      <Nav page={page} setPage={setPage} user={user} />
      {page === "home" && <HomePage setPage={setPage} userData={userData} user={user} />}
      {page === "quiz" && <QuizPage setPage={setPage} onComplete={handleQuizComplete} existingAnswers={userData.quizAnswers} />}
      {page === "missions" && <MissionsPage setPage={setPage} userData={userData} setUserData={setUserData} />}
      {page === "studio" && <StudioPage setPage={setPage} />}
      {page === "auth" && <AuthPage setPage={setPage} onAuth={handleAuth} />}
      {page === "dashboard" && <DashboardPage user={user} userData={userData} setPage={setPage} onLogout={handleLogout} />}
      <Footer setPage={setPage} />
    </div>
  );
}
