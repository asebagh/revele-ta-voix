import { useState, useEffect, useRef } from "react";

const COLORS = {
  obsidian: "#0A0A0F", deep: "#111118", surface: "#16161F", surfaceAlt: "#1C1C28",
  border: "#2A2A3A", borderLight: "#3A3A50", gold: "#C9A84C", goldLight: "#E8C96A",
  goldDim: "#8A6F2E", cream: "#F5F0E8", creamDim: "#C8C0B0", muted: "#666680", text: "#E8E4DC",
};
const FONT = "'Montserrat', sans-serif";

const STUDIO_PHOTOS = [
  { url: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=900&q=80", alt: "Studio podcast professionnel", label: "Studio Jaune — Grande configuration" },
  { url: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=900&q=80", alt: "Microphone de studio", label: "Équipement audio haut de gamme" },
  { url: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=900&q=80", alt: "Enregistrement podcast", label: "Studio Vert — Configuration intime" },
  { url: "https://images.unsplash.com/photo-1621600411688-4be93cd68504?w=900&q=80", alt: "Caméra et éclairage", label: "Captation 4 caméras simultanées" },
  { url: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=900&q=80", alt: "Interface de mixage", label: "Mixage et post-production" },
  { url: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=900&q=80", alt: "Coaching vocal", label: "Accompagnement personnalisé" },
];

const QUIZ_QUESTIONS = [
  { id: 1, category: "prise_de_parole", text: "Avant de prendre la parole en public, vous ressentez…", type: "scale", label_low: "J'adore ça — c'est naturel", label_high: "Une anxiété intense" },
  { id: 2, category: "camera", text: "Face à une caméra ou en vidéo, vous êtes…", type: "choice", options: ["À l'aise, vous oubliez qu'elle est là", "Un peu crispé(e) mais ça passe", "Bloqué(e), vous ne savez plus quoi dire", "Vous évitez la caméra au maximum"] },
  { id: 3, category: "structure", text: "Quand vous expliquez quelque chose d'important, votre discours est…", type: "choice", options: ["Clair, structuré, facile à suivre", "Assez clair mais parfois trop long", "Un peu dispersé, vous perdez le fil", "Difficile à organiser dans le feu de l'action"] },
  { id: 4, category: "imposteur", text: "Vous pensez légitimement à partager votre expertise publiquement ?", type: "scale", label_low: "Oui, pleinement", label_high: "Non, qui suis-je pour ça ?" },
  { id: 5, category: "vente", text: "Parler de vos offres, prix ou services en face-à-face…", type: "choice", options: ["C'est naturel, vous aimez ça", "Vous le faites mais avec un peu d'inconfort", "Vous minimisez toujours votre valeur", "Vous évitez ce moment au maximum"] },
  { id: 6, category: "contenu", text: "Créer du contenu régulier (posts, vidéos, podcasts) vous semble…", type: "scale", label_low: "Facile et motivant", label_high: "Épuisant et angoissant" },
  { id: 7, category: "voix", text: "En situation de stress, votre voix…", type: "choice", options: ["Reste stable et assurée", "Accélère un peu", "Se fragilise ou tremble légèrement", "Vous vous perdez dans votre débit"] },
  { id: 8, category: "storytelling", text: "Raconter votre parcours ou votre histoire pro vous paraît…", type: "scale", label_low: "Naturel et puissant", label_high: "Difficile et gênant" },
  { id: 9, category: "prise_de_parole", text: "Vous préparez vos interventions importantes…", type: "choice", options: ["Très peu — l'impro c'est mieux pour moi", "Un peu mais vite", "Beaucoup mais jamais assez", "Tellement que ça paralyse"] },
  { id: 10, category: "visibilite", text: "Votre visibilité en ligne reflète-t-elle vraiment votre niveau réel d'expertise ?", type: "scale", label_low: "Oui, totalement", label_high: "Non, je suis largement sous-représenté(e)" },
  { id: 11, category: "camera", text: "Vous avez déjà refusé une opportunité de visibilité à cause de l'appréhension ?", type: "choice", options: ["Jamais", "Une ou deux fois", "Plusieurs fois", "C'est une habitude"] },
  { id: 12, category: "imposteur", text: "Quand on vous complimente sur votre expertise, vous…", type: "choice", options: ["L'acceptez naturellement", "Dites merci mais minimisez intérieurement", "Pensez qu'ils ne voient pas vos lacunes", "Avez du mal à y croire"] },
];

const PROFILES = {
  stratege_invisible: { id: "stratege_invisible", name: "Le Stratège Invisible", emoji: "🧠", tagline: "Votre expertise mérite la lumière qu'elle n'a pas encore.", description: "Vous êtes profondément compétent(e). Votre expertise est réelle, reconnue par ceux qui vous côtoient. Mais votre voix ne résonne pas encore au-delà de votre cercle proche. Vous maîtrisez les coulisses, rarement le devant de la scène.", forces: ["Vision stratégique solide", "Expertise profonde et crédible", "Rigueur intellectuelle"], freins: ["Difficulté à se mettre en avant", "Inconfort face à la visibilité", "Tendance à sous-estimer son impact potentiel"], potentiel: "Une fois votre voix libérée, vous pouvez devenir une référence dans votre domaine. Votre fond est là. Il ne manque que la forme.", missions: ["Oser prendre sa place", "Développer sa visibilité", "Face caméra"], color: "#4A6FA5" },
  passionne_brouillon: { id: "passionne_brouillon", name: "Le Passionné Brouillon", emoji: "🔥", tagline: "Votre énergie est un atout. Votre structure, votre prochain levier.", description: "Vous avez une énergie communicative, un enthousiasme authentique que les gens sentent immédiatement. Mais votre discours part souvent dans tous les sens.", forces: ["Énergie et passion contagieuses", "Authenticité immédiate", "Capacité à susciter l'intérêt"], freins: ["Discours peu structuré", "Tendance à vouloir tout dire", "Difficulté à aller à l'essentiel"], potentiel: "Canalisée, votre passion devient votre signature. Avec une structure claire, vous devenez irrésistible.", missions: ["Structurer son message", "Pitcher son activité", "Storytelling express"], color: "#C9622A" },
  cameleon: { id: "cameleon", name: "Le Caméléon", emoji: "🌊", tagline: "Votre adaptabilité est rare. Votre affirmation, à construire.", description: "Vous lisez les gens avec une intelligence sociale remarquable. À l'aise dans la relation, vous savez vous adapter. Mais parfois, à trop vouloir plaire, vous perdez votre propre point de vue.", forces: ["Intelligence relationnelle élevée", "Grande adaptabilité", "Empathie et écoute"], freins: ["Manque d'affirmation de soi", "Point de vue parfois dilué", "Difficulté à occuper l'espace"], potentiel: "Quand vous ajoutez l'affirmation à l'adaptation, vous devenez un communicant d'exception.", missions: ["Oser prendre sa place", "Gagner en impact", "Leadership vocal"], color: "#2A8A7A" },
  perfectionniste: { id: "perfectionniste", name: "Le Perfectionniste", emoji: "⚡", tagline: "L'imparfait publié vaut mieux que le parfait attendu.", description: "Vos standards sont élevés. Trop élevés parfois. La peur de ne pas être à la hauteur vous paralyse plus souvent qu'elle ne vous protège.", forces: ["Exigence de qualité", "Profondeur de réflexion", "Sérieux perçu"], freins: ["Paralysie par l'analyse", "Procrastination déguisée en perfectionnisme", "Peur du jugement"], potentiel: "Votre exigence, redirigée, devient une force de différenciation. Le monde a besoin de gens sérieux qui osent quand même.", missions: ["Oser prendre sa place", "Créer du contenu sans stress", "Face caméra"], color: "#7A4A9A" },
  createur_silencieux: { id: "createur_silencieux", name: "Le Créateur Silencieux", emoji: "✨", tagline: "Vous avez tant à offrir. Il est temps que le monde l'entende.", description: "Vous avez des idées profondes, une créativité réelle. Mais vous préférez créer dans l'ombre. L'idée d'exposer votre image vous met mal à l'aise.", forces: ["Créativité et originalité", "Profondeur de pensée", "Sens du détail"], freins: ["Peur de l'exposition", "Dissonance entre valeur perçue et visibilité", "Résistance à l'image"], potentiel: "Un studio sécurisant, un accompagnement bienveillant — et vous découvrez que vous avez bien plus de présence que vous ne le croyez.", missions: ["Face caméra", "Créer du contenu sans stress", "Développer sa visibilité"], color: "#C9A84C" },
};

const MISSIONS = [
  { id: 1, title: "Oser prendre sa place", icon: "🎯", duration: "8 min", xp: 50, description: "La première étape n'est pas technique. C'est mentale.", lesson: "Prendre sa place, ce n'est pas écraser les autres. C'est assumer ce que vous avez à offrir. La prise de parole commence toujours avant la parole — elle commence dans la posture mentale.", examples: ["Oprah Winfrey a mis des années avant d'assumer sa singularité à l'antenne.", "Barack Obama répétait ses discours à voix haute des dizaines de fois."], mistakes: ["Attendre d'être 'prêt' (on ne l'est jamais totalement)", "Confondre humilité et invisibilité", "Penser que les autres ont moins peur"], exercise: "Écrivez en 3 phrases pourquoi VOUS méritez d'être entendu(e) aujourd'hui.", challenge: { type: "quiz", question: "Laquelle de ces affirmations vous ressemble le plus en ce moment ?", options: ["Je mérite d'être entendu(e), même imparfait(e)", "Je vais attendre d'en savoir plus", "Les autres font ça mieux que moi", "Je n'ai rien d'exceptionnel à dire"], correct: 0, explanation: "Oser imparfaitement est toujours plus puissant qu'attendre la perfection." } },
  { id: 2, title: "Structurer son message", icon: "🗺️", duration: "10 min", xp: 60, description: "Un message clair n'est pas simplifié. C'est organisé.", lesson: "La structure PPP : Problème → Perspective → Proposition. Commencez par ce que votre interlocuteur ressent, donnez un angle nouveau, puis proposez une direction claire.", examples: ["Steve Jobs présentait toujours un problème avant la solution.", "Les meilleurs TED talks suivent tous une courbe émotionnelle précise."], mistakes: ["Commencer par soi au lieu de l'autre", "Vouloir tout dire en une fois", "Confondre quantité et qualité d'information"], exercise: "Écrivez votre message en utilisant la structure PPP en 150 mots maximum.", challenge: { type: "quiz", question: "Dans la structure PPP, par quoi commence-t-on idéalement ?", options: ["Par parler de soi et de ses compétences", "Par le problème ressenti par l'interlocuteur", "Par la solution qu'on propose", "Par les chiffres qui prouvent notre expertise"], correct: 1, explanation: "On commence toujours par l'autre — son problème, sa douleur, son besoin." } },
  { id: 3, title: "Gagner en impact", icon: "⚡", duration: "7 min", xp: 70, description: "L'impact ne vient pas du volume. Il vient de la précision.", lesson: "L'impact naît du silence autant que de la parole. Une pause bien placée vaut dix mots de remplissage. Le regard compte davantage que le texte.", examples: ["Les négociateurs professionnels utilisent le silence comme un outil puissant.", "Les acteurs de théâtre apprennent que le temps de réaction est aussi important que la réplique."], mistakes: ["Remplir tous les silences par peur du vide", "Parler trop vite par stress", "Perdre le contact visuel en cherchant ses mots"], exercise: "Lisez un texte à voix haute, enregistrez-vous. Identifiez 3 moments où une pause aurait renforcé le message.", challenge: { type: "quiz", question: "Qu'est-ce qui crée le plus d'impact dans une prise de parole ?", options: ["Parler fort et longtemps", "Utiliser beaucoup de vocabulaire technique", "Une pause bien placée et un regard direct", "Avoir des slides très remplies"], correct: 2, explanation: "Le silence et le regard sont les outils les plus sous-utilisés — et les plus puissants." } },
  { id: 4, title: "Parler face caméra", icon: "📹", duration: "9 min", xp: 80, description: "La caméra révèle ce qu'un miroir ne montre pas.", lesson: "La caméra amplifie l'authenticité autant que le stress. La clé : ne pas jouer un rôle. Regardez l'objectif comme vous regarderiez un ami à qui vous expliquez quelque chose d'important.", examples: ["La plupart des YouTubeurs qui semblent naturels ont filmé des centaines d'heures avant d'y arriver.", "Les journalistes TV répètent leurs postures et regards pendant des mois."], mistakes: ["Lire ses notes au lieu de parler", "Oublier de respirer (le stress se voit)", "Se juger pendant qu'on tourne"], exercise: "Filmez-vous 2 minutes en parlant de votre activité. Identifiez une force et un axe d'amélioration.", challenge: { type: "quiz", question: "Face caméra, où doit-on regarder pour créer la connexion ?", options: ["Sur l'écran pour voir son propre reflet", "Dans l'objectif de la caméra", "Légèrement en bas pour paraître réfléchi", "En haut à droite pour sembler naturel"], correct: 1, explanation: "L'objectif, c'est les yeux de votre interlocuteur. C'est là que la connexion se crée." } },
  { id: 5, title: "Créer du contenu sans stress", icon: "🎨", duration: "8 min", xp: 65, description: "Le contenu régulier n'est pas une question de talent. C'est un système.", lesson: "La règle des 3 sources : ce que vous avez vécu cette semaine, une question de client, une erreur que vous avez faite. Toujours. Un créateur régulier ne cherche pas l'inspiration — il a un système.", examples: ["Gary Vaynerchuk documente sa vie professionnelle plutôt que de créer du contenu.", "Les meilleurs podcasters planifient leurs épisodes 6 semaines à l'avance."], mistakes: ["Attendre l'inspiration", "Vouloir que chaque post soit parfait", "Ne pas recycler son contenu existant"], exercise: "Listez 10 questions que vos clients vous posent souvent. Chacune est un contenu potentiel.", challenge: { type: "quiz", question: "Quelle est la meilleure source d'idées de contenu pour un expert ?", options: ["Les tendances du moment sur TikTok", "Les questions que vos clients vous posent vraiment", "Ce que vos concurrents publient", "Les actualités de votre secteur"], correct: 1, explanation: "Vos clients vous disent exactement de quoi ils ont besoin. C'est votre mine d'or éditoriale." } },
  { id: 6, title: "Pitcher son activité", icon: "🚀", duration: "10 min", xp: 90, description: "Un bon pitch ne vend pas. Il connecte.", lesson: "Le pitch parfait répond à 3 questions : Qui vous aidez → Quel problème vous résolvez → Comment c'est différent. En 30 secondes. C'est une invitation à une conversation, pas un argumentaire.", examples: ["Airbnb à ses débuts : 'Location de canapés entre voyageurs.' Simple. Mémorable.", "Les startups qui lèvent des fonds ont toujours un pitch condensé en une phrase."], mistakes: ["Parler de soi avant de parler de l'autre", "Lister ses services au lieu de décrire une transformation", "Pitcher trop tôt sans avoir écouté"], exercise: "Rédigez votre pitch en 3 versions : 10 secondes, 30 secondes, 2 minutes.", challenge: { type: "quiz", question: "Un bon pitch de 30 secondes doit prioritairement contenir…", options: ["Votre CV et vos diplômes", "Le prix de vos offres", "Le problème que vous résolvez et pour qui", "Une liste exhaustive de vos services"], correct: 2, explanation: "On parle d'abord du problème qu'on résout, pour qui. Tout le reste vient après." } },
  { id: 7, title: "Développer sa visibilité", icon: "🌟", duration: "9 min", xp: 75, description: "La visibilité n'est pas une question d'ego. C'est un acte de service.", lesson: "Si vous avez de la valeur et que personne ne le sait, vous privez des gens de votre aide. La visibilité permet aux bonnes personnes de vous trouver.", examples: ["Les experts qui publient régulièrement créent un niveau de confiance impossible à construire autrement.", "Un podcast est le format le plus qualifiant : les auditeurs vous écoutent en moyenne 40 minutes."], mistakes: ["Attendre un profil parfait pour commencer", "Être partout au lieu d'être excellent quelque part", "Publier sans stratégie ni ligne éditoriale"], exercise: "Définissez votre ligne éditoriale en 3 mots : un thème principal, une cible, un ton.", challenge: { type: "quiz", question: "Pourquoi être visible est un acte de générosité ?", options: ["Pour avoir plus de followers", "Pour que les bonnes personnes qui ont besoin de vous puissent vous trouver", "Pour montrer sa réussite", "Pour dépasser ses concurrents"], correct: 1, explanation: "Chaque jour invisible est un jour où quelqu'un qui a besoin de vous ne vous trouve pas." } },
];

const BADGES = [
  { id: "first_step", name: "Premier Pas", icon: "🎯", desc: "Diagnostic lancé", category: "démarrage", rarity: "common" },
  { id: "profile_revealed", name: "Profil Révélé", icon: "🔮", desc: "Profil communicant dévoilé", category: "démarrage", rarity: "common" },
  { id: "account_created", name: "Membre TODDA", icon: "🏠", desc: "Bienvenue dans la communauté", category: "démarrage", rarity: "common" },
  { id: "first_mission", name: "Décollage", icon: "🚀", desc: "Première mission accomplie", category: "missions", rarity: "common" },
  { id: "streak_3", name: "Sur ma lancée", icon: "🔥", desc: "3 missions consécutives", category: "missions", rarity: "rare" },
  { id: "streak_5", name: "En feu", icon: "💥", desc: "5 missions consécutives", category: "missions", rarity: "epic" },
  { id: "all_missions", name: "Parcours complet", icon: "⭐", desc: "Toutes les missions terminées", category: "missions", rarity: "legendary" },
  { id: "camera_brave", name: "Face Caméra", icon: "📹", desc: "Mission caméra relevée", category: "compétences", rarity: "rare" },
  { id: "pitch_master", name: "Maître du Pitch", icon: "🎤", desc: "Mission pitch maîtrisée", category: "compétences", rarity: "rare" },
  { id: "content_creator", name: "Créateur", icon: "✨", desc: "Mission contenu validée", category: "compétences", rarity: "rare" },
  { id: "visibility_hero", name: "Visible", icon: "🌟", desc: "Mission visibilité débloquée", category: "compétences", rarity: "rare" },
  { id: "quiz_perfect", name: "Sans faute", icon: "💎", desc: "Quiz réussi sans erreur", category: "quiz", rarity: "epic" },
  { id: "quiz_3", name: "Curieux", icon: "🧩", desc: "3 quiz complétés", category: "quiz", rarity: "common" },
  { id: "quiz_all", name: "Savant", icon: "🎓", desc: "Tous les quiz validés", category: "quiz", rarity: "legendary" },
  { id: "xp_100", name: "100 XP", icon: "⚡", desc: "100 points d'expérience", category: "xp", rarity: "common" },
  { id: "xp_300", name: "300 XP", icon: "🔋", desc: "300 points d'expérience", category: "xp", rarity: "rare" },
  { id: "xp_600", name: "600 XP", icon: "🌩️", desc: "600 points d'expérience", category: "xp", rarity: "epic" },
];

const RARITY_COLORS = {
  common: { bg: "#2A2A3A", border: "#3A3A50", label: "Commun", color: "#888" },
  rare: { bg: "#1A2A4A", border: "#2A4A8A", label: "Rare", color: "#4A8AFF" },
  epic: { bg: "#2A1A4A", border: "#6A2A9A", label: "Épique", color: "#9A4AFF" },
  legendary: { bg: "#2A1A0A", border: "#C9A84C", label: "Légendaire", color: "#C9A84C" },
};
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => { try { const item = window.localStorage.getItem(key); return item ? JSON.parse(item) : initialValue; } catch { return initialValue; } });
  const setValue = (value) => { try { const v = value instanceof Function ? value(storedValue) : value; setStoredValue(v); window.localStorage.setItem(key, JSON.stringify(v)); } catch (e) { console.error(e); } };
  return [storedValue, setValue];
}

function computeProfile(answers) {
  const scores = { prise_de_parole:0, camera:0, structure:0, imposteur:0, vente:0, contenu:0, voix:0, storytelling:0, visibilite:0 };
  const counts = { ...scores };
  answers.forEach(a => { if (!a) return; const q = QUIZ_QUESTIONS[a.questionIndex]; if (!q) return; counts[q.category]=(counts[q.category]||0)+1; scores[q.category]=(scores[q.category]||0)+a.score; });
  Object.keys(scores).forEach(k => { if (counts[k]) scores[k] = scores[k]/counts[k]; });
  const vis = (scores.camera+scores.visibilite+scores.contenu)/3;
  const str = (scores.structure+scores.storytelling)/2;
  const conf = (scores.imposteur+scores.prise_de_parole)/2;
  if (vis>7 && conf<5) return "stratege_invisible";
  if (str>6 && conf<5) return "passionne_brouillon";
  if (scores.imposteur>6 && scores.vente>5) return "perfectionniste";
  if (scores.camera>7 && vis>6) return "createur_silencieux";
  return "cameleon";
}

function QuizPage({ setPage, onProfile, onStart }) {
  const [step, setStep] = useState("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [scaleValue, setScaleValue] = useState(5);
  const [profile, setProfile] = useState(null);
  const [animating, setAnimating] = useState(false);
  const totalQ = QUIZ_QUESTIONS.length;
  const q = QUIZ_QUESTIONS[current];

  function handleChoice(score) {
    if (animating) return;
    setAnimating(true);
    const newAnswers = [...answers];
    newAnswers[current] = { questionIndex: current, score };
    setAnswers(newAnswers);
    setTimeout(() => {
      if (current < totalQ - 1) { setCurrent(current+1); setScaleValue(5); setAnimating(false); }
      else { const p = computeProfile(newAnswers); setProfile(p); setStep("result"); onProfile(p); }
    }, 300);
  }

  if (step === "intro") return (
    <div style={{ minHeight:"100vh", background:COLORS.obsidian, padding:"7rem 1.5rem 4rem", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT }}>
      <div style={{ maxWidth:"640px", textAlign:"center" }}>
        <div style={{ width:"90px", height:"90px", borderRadius:"50%", background:`${COLORS.gold}18`, border:`1px solid ${COLORS.gold}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"2.5rem", margin:"0 auto 2rem" }}>🔮</div>
        <h1 style={{ fontFamily:FONT, fontSize:"clamp(1.8rem,4vw,2.6rem)", color:COLORS.cream, marginBottom:"1rem", fontWeight:800 }}>Votre profil de communicant</h1>
        <p style={{ color:COLORS.creamDim, lineHeight:1.8, marginBottom:"0.75rem", fontWeight:400 }}>12 questions. 4 à 6 minutes. Un portrait précis de votre style de communication, vos forces, vos freins et votre potentiel inexploité.</p>
        <p style={{ color:COLORS.muted, fontSize:"0.9rem", marginBottom:"2.5rem", fontWeight:400 }}>Il n'y a pas de bonne ou mauvaise réponse. Soyez honnête — c'est là que la magie opère.</p>
        <button onClick={() => { setStep("quiz"); if(onStart) onStart(); }} style={{ background:COLORS.gold, color:COLORS.obsidian, border:"none", padding:"1rem 2.5rem", borderRadius:"8px", fontSize:"1rem", fontWeight:800, cursor:"pointer", fontFamily:FONT, boxShadow:`0 8px 32px ${COLORS.gold}40` }}>Commencer le diagnostic →</button>
      </div>
    </div>
  );

  if (step === "quiz") return (
    <div style={{ minHeight:"100vh", background:COLORS.obsidian, padding:"7rem 1.5rem 4rem", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT }}>
      <div style={{ maxWidth:"640px", width:"100%" }}>
        <div style={{ marginBottom:"2.5rem" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.5rem" }}>
            <span style={{ color:COLORS.muted, fontSize:"0.82rem", fontWeight:600 }}>Question {current+1} / {totalQ}</span>
            <span style={{ color:COLORS.gold, fontSize:"0.82rem", fontWeight:700 }}>{Math.round((current/totalQ)*100)}%</span>
          </div>
          <div style={{ height:"6px", background:COLORS.border, borderRadius:"100px" }}>
            <div style={{ height:"100%", borderRadius:"100px", background:`linear-gradient(90deg,${COLORS.goldDim},${COLORS.gold})`, width:`${(current/totalQ)*100}%`, transition:"width 0.5s cubic-bezier(0.4,0,0.2,1)" }} />
          </div>
          <div style={{ display:"flex", gap:"4px", marginTop:"0.6rem" }}>
            {QUIZ_QUESTIONS.map((_,i) => <div key={i} style={{ flex:1, height:"3px", borderRadius:"2px", background:i<current?COLORS.gold:i===current?`${COLORS.gold}60`:COLORS.border, transition:"background 0.3s" }} />)}
          </div>
        </div>
        <div style={{ background:COLORS.surface, borderRadius:"20px", padding:"2.5rem", border:`1px solid ${COLORS.border}`, opacity:animating?0:1, transition:"opacity 0.2s" }}>
          <p style={{ color:COLORS.gold, fontSize:"0.72rem", letterSpacing:"0.15em", textTransform:"uppercase", fontWeight:700, marginBottom:"1.25rem" }}>{q.category.replace(/_/g," ")}</p>
          <h2 style={{ fontFamily:FONT, fontSize:"1.35rem", color:COLORS.cream, fontWeight:700, lineHeight:1.4, marginBottom:"2rem" }}>{q.text}</h2>
          {q.type === "scale" && (
            <div>
              <div style={{ textAlign:"center", marginBottom:"1rem" }}>
                <span style={{ fontSize:"2.5rem", fontWeight:900, color:scaleValue>6?"#E87070":scaleValue>3?COLORS.gold:"#70E8A0" }}>{scaleValue}</span>
                <span style={{ color:COLORS.muted, fontSize:"1rem" }}>/10</span>
              </div>
              <input type="range" min={0} max={10} value={scaleValue} onChange={e=>setScaleValue(Number(e.target.value))} style={{ width:"100%", accentColor:COLORS.gold, marginBottom:"0.75rem" }} />
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"1.5rem" }}>
                <span style={{ color:"#70E8A0", fontSize:"0.8rem", fontWeight:600 }}>{q.label_low}</span>
                <span style={{ color:"#E87070", fontSize:"0.8rem", fontWeight:600 }}>{q.label_high}</span>
              </div>
              <button onClick={() => handleChoice(scaleValue)} style={{ width:"100%", background:COLORS.gold, color:COLORS.obsidian, border:"none", padding:"1rem", borderRadius:"10px", fontSize:"1rem", fontWeight:800, cursor:"pointer", fontFamily:FONT }}>{current<totalQ-1?"Suivant →":"Voir mon profil →"}</button>
            </div>
          )}
          {q.type === "choice" && (
            <div style={{ display:"flex", flexDirection:"column", gap:"0.75rem" }}>
              {q.options.map((opt,i) => {
                const score = [0,3,7,10][i]??i*3;
                return <button key={i} onClick={() => handleChoice(score)} style={{ background:COLORS.surfaceAlt, border:`1px solid ${COLORS.border}`, color:COLORS.text, padding:"1rem 1.25rem", borderRadius:"12px", fontSize:"0.93rem", cursor:"pointer", textAlign:"left", fontWeight:500, fontFamily:FONT, display:"flex", gap:"0.75rem", alignItems:"center" }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=COLORS.gold; e.currentTarget.style.background=`${COLORS.gold}10`; e.currentTarget.style.color=COLORS.gold;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=COLORS.border; e.currentTarget.style.background=COLORS.surfaceAlt; e.currentTarget.style.color=COLORS.text;}}>
                  <span style={{ width:"26px", height:"26px", borderRadius:"50%", border:`1px solid ${COLORS.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.75rem", color:COLORS.muted, flexShrink:0, fontWeight:700 }}>{String.fromCharCode(65+i)}</span>{opt}
                </button>;
              })}
            </div>
          )}
        </div>
        {current>0 && <button onClick={() => {if(!animating){setCurrent(current-1);setScaleValue(5);}}} style={{ marginTop:"1rem", background:"none", border:"none", color:COLORS.muted, cursor:"pointer", fontSize:"0.88rem", fontFamily:FONT, fontWeight:500 }}>← Question précédente</button>}
      </div>
    </div>
  );

  const prof = PROFILES[profile];
  if (!prof) return null;
  return (
    <div style={{ minHeight:"100vh", background:COLORS.obsidian, padding:"7rem 1.5rem 4rem", fontFamily:FONT }}>
      <div style={{ maxWidth:"760px", margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"3rem" }}>
          <div style={{ width:"110px", height:"110px", borderRadius:"50%", background:`${prof.color}22`, border:`2px solid ${prof.color}60`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"3rem", margin:"0 auto 1.5rem" }}>{prof.emoji}</div>
          <div style={{ color:COLORS.muted, fontSize:"0.75rem", letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:"0.5rem", fontWeight:600 }}>Votre profil</div>
          <h1 style={{ fontFamily:FONT, fontSize:"clamp(2rem,4vw,3rem)", color:COLORS.cream, fontWeight:900, marginBottom:"0.75rem" }}>{prof.name}</h1>
          <p style={{ color:prof.color, fontWeight:700, fontSize:"1.1rem", marginBottom:"1.25rem" }}>{prof.tagline}</p>
          <p style={{ color:COLORS.creamDim, lineHeight:1.8, maxWidth:"580px", margin:"0 auto", fontWeight:400 }}>{prof.description}</p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.25rem", marginBottom:"2rem" }}>
          <div style={{ background:COLORS.surface, borderRadius:"16px", padding:"1.5rem", border:`1px solid ${COLORS.border}` }}>
            <h3 style={{ color:COLORS.gold, fontWeight:700, marginBottom:"1rem", fontSize:"0.9rem" }}>✦ Vos forces</h3>
            {prof.forces.map((f,i) => <div key={i} style={{ color:COLORS.text, fontSize:"0.88rem", marginBottom:"0.5rem", paddingLeft:"0.75rem", borderLeft:`2px solid ${COLORS.gold}40`, fontWeight:400 }}>{f}</div>)}
          </div>
          <div style={{ background:COLORS.surface, borderRadius:"16px", padding:"1.5rem", border:`1px solid ${COLORS.border}` }}>
            <h3 style={{ color:COLORS.creamDim, fontWeight:700, marginBottom:"1rem", fontSize:"0.9rem" }}>⚡ Vos freins</h3>
            {prof.freins.map((f,i) => <div key={i} style={{ color:COLORS.text, fontSize:"0.88rem", marginBottom:"0.5rem", paddingLeft:"0.75rem", borderLeft:`2px solid ${COLORS.border}`, fontWeight:400 }}>{f}</div>)}
          </div>
        </div>
        <div style={{ background:`linear-gradient(135deg,${prof.color}15,${COLORS.surface})`, borderRadius:"16px", padding:"1.75rem", border:`1px solid ${prof.color}40`, marginBottom:"2.5rem" }}>
          <h3 style={{ color:COLORS.gold, fontWeight:700, marginBottom:"0.75rem" }}>🚀 Votre potentiel</h3>
          <p style={{ color:COLORS.text, lineHeight:1.8, fontWeight:400 }}>{prof.potentiel}</p>
        </div>
        <div style={{ textAlign:"center" }}>
          <p style={{ color:COLORS.muted, fontSize:"0.9rem", marginBottom:"1.5rem", fontStyle:"italic" }}>"Votre profil commence à se dessiner. Continuez votre progression."</p>
          <div style={{ display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={() => setPage("missions")} style={{ background:COLORS.gold, color:COLORS.obsidian, border:"none", padding:"0.9rem 1.75rem", borderRadius:"8px", fontSize:"0.95rem", fontWeight:800, cursor:"pointer", fontFamily:FONT }}>Commencer mes missions →</button>
            <button onClick={() => setPage("studio")} style={{ background:"none", border:`1px solid ${COLORS.border}`, color:COLORS.creamDim, padding:"0.9rem 1.75rem", borderRadius:"8px", fontSize:"0.95rem", cursor:"pointer", fontFamily:FONT, fontWeight:600 }}>Découvrir le Studio</button>
          </div>
        </div>
      </div>
    </div>
  );
}
function MissionsPage({ setPage, xpTotal, completedMissions, completedQuizzes, completeMission, completeQuiz, profile }) {
  const [selected, setSelected] = useState(null);
  const [quizState, setQuizState] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [exerciseText, setExerciseText] = useState("");
  const [exerciseSaved, setExerciseSaved] = useState(false);

  function handleQuizAnswer(idx) {
    if (quizAnswer !== null) return;
    setQuizAnswer(idx);
    const m = MISSIONS[selected];
    const isCorrect = idx === m.challenge.correct;
    completeQuiz(m.id, isCorrect && !completedQuizzes.includes(m.id));
    setQuizState("result");
  }

  if (selected !== null) {
    const m = MISSIONS[selected];
    const isDone = completedMissions.includes(m.id);
    const qDone = completedQuizzes.includes(m.id);
    const ch = m.challenge;
    return (
      <div style={{ minHeight:"100vh", background:COLORS.obsidian, padding:"7rem 1.5rem 4rem", fontFamily:FONT }}>
        <div style={{ maxWidth:"760px", margin:"0 auto" }}>
          <button onClick={() => { setSelected(null); setQuizState(null); setQuizAnswer(null); setExerciseText(""); setExerciseSaved(false); }} style={{ background:"none", border:"none", color:COLORS.muted, cursor:"pointer", fontSize:"0.88rem", fontFamily:FONT, marginBottom:"2rem", fontWeight:600 }}>← Retour aux missions</button>
          <div style={{ background:COLORS.surface, borderRadius:"20px", padding:"2.5rem", border:`1px solid ${COLORS.border}`, marginBottom:"1.5rem" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1.5rem" }}>
              <div style={{ width:"60px", height:"60px", borderRadius:"14px", background:`${COLORS.gold}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.75rem" }}>{m.icon}</div>
              <div>
                <div style={{ color:COLORS.muted, fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"0.25rem" }}>Mission {m.id} · {m.duration} · +{m.xp} XP</div>
                <h2 style={{ color:COLORS.cream, fontWeight:900, fontSize:"1.4rem", margin:0 }}>{m.title}</h2>
              </div>
            </div>
            <div style={{ background:COLORS.obsidian, borderRadius:"12px", padding:"1.5rem", marginBottom:"1.5rem", borderLeft:`3px solid ${COLORS.gold}` }}>
              <p style={{ color:COLORS.creamDim, lineHeight:1.8, margin:0, fontWeight:400 }}>{m.lesson}</p>
            </div>
            <div style={{ marginBottom:"1.5rem" }}>
              <div style={{ color:COLORS.gold, fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"0.75rem" }}>Exemples inspirants</div>
              {m.examples.map((ex, i) => <div key={i} style={{ color:COLORS.creamDim, fontSize:"0.88rem", marginBottom:"0.5rem", paddingLeft:"1rem", borderLeft:`2px solid ${COLORS.border}`, fontWeight:400 }}>{ex}</div>)}
            </div>
            <div style={{ marginBottom:"1.5rem" }}>
              <div style={{ color:COLORS.muted, fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"0.75rem" }}>Erreurs fréquentes à éviter</div>
              {m.mistakes.map((mk, i) => <div key={i} style={{ color:"#E87070", fontSize:"0.85rem", marginBottom:"0.4rem", display:"flex", gap:"0.5rem", fontWeight:400 }}><span>✗</span>{mk}</div>)}
            </div>
            <div style={{ marginBottom:"1.5rem" }}>
              <div style={{ color:COLORS.gold, fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"0.75rem" }}>Exercice</div>
              <p style={{ color:COLORS.creamDim, fontSize:"0.9rem", marginBottom:"0.75rem", fontWeight:400 }}>{m.exercise}</p>
              <textarea value={exerciseText} onChange={e=>setExerciseText(e.target.value)} placeholder="Écrivez votre réponse ici..." style={{ width:"100%", background:COLORS.obsidian, border:`1px solid ${COLORS.border}`, borderRadius:"10px", padding:"1rem", color:COLORS.cream, fontFamily:FONT, fontSize:"0.9rem", resize:"vertical", minHeight:"100px", outline:"none", boxSizing:"border-box", fontWeight:400 }} />
              {exerciseText.length > 10 && !exerciseSaved && <button onClick={() => setExerciseSaved(true)} style={{ marginTop:"0.5rem", background:"none", border:`1px solid ${COLORS.gold}`, color:COLORS.gold, padding:"0.5rem 1rem", borderRadius:"6px", cursor:"pointer", fontSize:"0.83rem", fontWeight:700, fontFamily:FONT }}>💾 Sauvegarder</button>}
              {exerciseSaved && <div style={{ marginTop:"0.5rem", color:"#4CAF82", fontSize:"0.83rem", fontWeight:600 }}>✓ Exercice sauvegardé</div>}
            </div>
          </div>
          <div style={{ background:COLORS.surface, borderRadius:"20px", padding:"2rem", border:`1px solid ${qDone ? COLORS.gold+'40' : COLORS.border}`, marginBottom:"1.5rem" }}>
            <div style={{ color:COLORS.gold, fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"1.25rem" }}>Quiz de validation · +20 XP</div>
            <p style={{ color:COLORS.cream, fontWeight:700, fontSize:"1rem", marginBottom:"1.25rem", lineHeight:1.5 }}>{ch.question}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.6rem" }}>
              {ch.options.map((opt, i) => {
                let bg = COLORS.surfaceAlt, border = COLORS.border, color = COLORS.creamDim;
                if (quizAnswer !== null) {
                  if (i === ch.correct) { bg = "#1A3A2A"; border = "#4CAF82"; color = "#4CAF82"; }
                  else if (i === quizAnswer && i !== ch.correct) { bg = "#3A1A1A"; border = "#E87070"; color = "#E87070"; }
                }
                return (
                  <button key={i} onClick={() => handleQuizAnswer(i)} disabled={quizAnswer !== null} style={{ background:bg, border:`1.5px solid ${border}`, color, padding:"0.9rem 1.25rem", borderRadius:"10px", fontSize:"0.9rem", cursor:quizAnswer!==null?"default":"pointer", textAlign:"left", fontWeight:600, fontFamily:FONT, display:"flex", gap:"0.75rem", alignItems:"center", transition:"all 0.2s" }}>
                    <span style={{ width:"26px", height:"26px", borderRadius:"50%", border:`1.5px solid ${border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.75rem", flexShrink:0, fontWeight:700 }}>{String.fromCharCode(65+i)}</span>{opt}
                  </button>
                );
              })}
            </div>
            {quizAnswer !== null && (
              <div style={{ marginTop:"1.25rem", background: quizAnswer===ch.correct?"#1A3A2A":"#2A1A1A", borderRadius:"10px", padding:"1rem 1.25rem", border:`1px solid ${quizAnswer===ch.correct?"#4CAF82":"#E87070"}` }}>
                <div style={{ color: quizAnswer===ch.correct?"#4CAF82":"#E87070", fontWeight:800, marginBottom:"0.4rem", fontSize:"0.88rem" }}>{quizAnswer===ch.correct?"✓ Bonne réponse !":"✗ Pas tout à fait..."}</div>
                <p style={{ color:COLORS.creamDim, fontSize:"0.87rem", lineHeight:1.6, margin:0, fontWeight:400 }}>{ch.explanation}</p>
              </div>
            )}
          </div>
          {!isDone && <button onClick={() => { completeMission(m.id); setSelected(null); setQuizState(null); setQuizAnswer(null); setExerciseText(""); setExerciseSaved(false); }} style={{ width:"100%", background:COLORS.gold, color:COLORS.obsidian, border:"none", padding:"1.1rem", borderRadius:"10px", fontSize:"1rem", fontWeight:800, cursor:"pointer", fontFamily:FONT, boxShadow:`0 8px 32px ${COLORS.gold}30` }}>✓ Mission complétée — Réclamer mes {m.xp} XP</button>}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:COLORS.obsidian, padding:"7rem 1.5rem 4rem", fontFamily:FONT }}>
      <div style={{ maxWidth:"900px", margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"3.5rem" }}>
          <div style={{ color:COLORS.gold, fontSize:"0.72rem", letterSpacing:"0.18em", textTransform:"uppercase", fontWeight:700, marginBottom:"1rem" }}>Parcours</div>
          <h1 style={{ fontFamily:FONT, fontSize:"clamp(2rem,4vw,3rem)", color:COLORS.cream, fontWeight:900, marginBottom:"0.75rem" }}>Booster ma communication</h1>
          <p style={{ color:COLORS.creamDim, maxWidth:"500px", margin:"0 auto", lineHeight:1.7, fontWeight:400 }}>7 missions. Des quiz de validation. Des progrès concrets.</p>
          {xpTotal>0 && <div style={{ marginTop:"1.25rem", display:"inline-flex", gap:"1.5rem", background:COLORS.surface, padding:"0.75rem 1.5rem", borderRadius:"100px", border:`1px solid ${COLORS.border}` }}><span style={{ color:COLORS.gold, fontWeight:800, fontSize:"0.9rem" }}>⚡ {xpTotal} XP</span><span style={{ color:COLORS.muted, fontSize:"0.88rem", fontWeight:500 }}>{completedMissions.length}/{MISSIONS.length} missions · {completedQuizzes.length} quiz ✓</span></div>}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"0.875rem" }}>
          {MISSIONS.map((m,i) => {
            const done=completedMissions.includes(m.id);
            const qDone=completedQuizzes.includes(m.id);
            return <button key={m.id} onClick={()=>{setSelected(i);setQuizState(null);setQuizAnswer(null);setExerciseText("");setExerciseSaved(false);}} style={{ background:COLORS.surface, border:done?`1px solid ${COLORS.gold}40`:`1px solid ${COLORS.border}`, borderRadius:"16px", padding:"1.5rem 2rem", cursor:"pointer", textAlign:"left", display:"flex", alignItems:"center", gap:"1.5rem", transition:"all 0.2s", fontFamily:FONT }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=COLORS.gold; e.currentTarget.style.transform="translateX(4px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=done?`${COLORS.gold}40`:COLORS.border; e.currentTarget.style.transform="none";}}>
              <div style={{ width:"54px", height:"54px", borderRadius:"14px", flexShrink:0, background:done?`${COLORS.gold}20`:COLORS.surfaceAlt, display:"flex", alignItems:"center", justifyContent:"center", fontSize:done?"1.3rem":"1.6rem", color:COLORS.gold }}>{done?"✓":m.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"0.25rem", flexWrap:"wrap" }}>
                  <span style={{ color:COLORS.muted, fontSize:"0.75rem", fontWeight:700 }}>MISSION {m.id}</span>
                  {done && <span style={{ background:"#1A3A2A", color:"#4CAF82", padding:"0.15rem 0.6rem", borderRadius:"100px", fontSize:"0.72rem", fontWeight:700 }}>Complétée</span>}
                  {qDone && <span style={{ background:"#1A2A4A", color:"#4A8AFF", padding:"0.15rem 0.6rem", borderRadius:"100px", fontSize:"0.72rem", fontWeight:700 }}>Quiz ✓</span>}
                </div>
                <div style={{ color:COLORS.cream, fontWeight:700, fontSize:"1rem", marginBottom:"0.2rem" }}>{m.title}</div>
                <div style={{ color:COLORS.muted, fontSize:"0.85rem", fontWeight:400 }}>{m.description}</div>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <div style={{ color:COLORS.gold, fontWeight:800, fontSize:"0.88rem" }}>+{m.xp} XP</div>
                <div style={{ color:COLORS.muted, fontSize:"0.78rem", fontWeight:500 }}>{m.duration}</div>
              </div>
            </button>;
          })}
        </div>
        <div style={{ marginTop:"3.5rem", background:`linear-gradient(135deg,${COLORS.goldDim}15,${COLORS.surface})`, borderRadius:"18px", padding:"2.5rem", border:`1px solid ${COLORS.gold}30`, textAlign:"center" }}>
          <p style={{ color:COLORS.gold, fontWeight:800, fontSize:"1.05rem", marginBottom:"0.75rem" }}>"Certaines progressions vont plus vite lorsqu'on n'est pas seul."</p>
          <p style={{ color:COLORS.creamDim, marginBottom:"1.5rem", lineHeight:1.7, fontWeight:400 }}>Le studio est un terrain d'entraînement sécurisé pour accélérer votre visibilité.</p>
          <button onClick={()=>setPage("studio")} style={{ background:COLORS.gold, color:COLORS.obsidian, border:"none", padding:"0.85rem 1.75rem", borderRadius:"8px", fontSize:"0.95rem", fontWeight:800, cursor:"pointer", fontFamily:FONT }}>Découvrir le Studio →</button>
        </div>
      </div>
    </div>
  );
}

function StudioPage({ setPage }) {
  const [activeTab, setActiveTab] = useState("studio");
  const [activePhoto, setActivePhoto] = useState(0);

  const tabs = [
    { id: "studio", label: "Le Studio" },
    { id: "accompagnement", label: "L'Accompagnement" },
    { id: "tarifs", label: "Services & Tarifs" },
  ];

  const differentiators = [
    { icon: "🎬", title: "L'œil du réalisateur", desc: "Je ne suis pas seulement ingénieur son. Je cadre, je dirige, je vous guide à chaque prise. Vous n'avez qu'à être vous-même — je m'occupe du reste." },
    { icon: "🛡️", title: "Un cadre sécurisant", desc: "Le studio est pensé pour les non-habitués. Pas de jugement, pas de pression. C'est un espace où vous avez le droit d'essayer, de rater, et d'être surpris de vous-même." },
    { icon: "🗺️", title: "La structure avant le micro", desc: "Avant même d'appuyer sur Rec, on travaille votre message. Parce qu'un bon contenu commence par une idée claire, pas par un bon équipement." },
    { icon: "♻️", title: "Un contenu, dix formats", desc: "Un épisode enregistré devient un Reel, une citation, un article, un post LinkedIn. Je vous apprends à recycler sans répéter." },
    { icon: "🤝", title: "Une relation humaine d'abord", desc: "Pas de process industriel. Chaque client est unique. Je connais votre activité, vos objectifs, votre style — et j'adapte chaque session à vous." },
  ];

  const testimonials = [
    { name: "Sophie M.", role: "Coach certifiée", text: "J'avais une peur bleue de la caméra. Après une session avec Alexandre, j'ai publié ma première vidéo LinkedIn. 3 000 vues en 48h.", stars: 5 },
    { name: "Thomas R.", role: "Dirigeant PME", text: "Le studio est impressionnant mais c'est l'accompagnement qui fait tout. Alexandre a reformulé mon pitch en 20 minutes. Je l'utilise encore aujourd'hui.", stars: 5 },
    { name: "Laura B.", role: "Consultante RH", text: "Je cherchais un lieu pro pour lancer mon podcast. J'ai trouvé bien plus : un partenaire créatif qui comprend ma vision.", stars: 5 },
    { name: "Karim D.", role: "Entrepreneur tech", text: "En une demi-journée, on a produit 8 contenus réutilisables. Rapport qualité/impact imbattable.", stars: 5 },
  ];

  const formules = [
    { name: "Session Studio", price: "À partir de 190€", duration: "2h", features: ["Studio équipé 4 caméras", "Ingénieur son présent", "Livraison fichiers bruts", "1 set de votre choix (Jaune ou Vert)"], highlight: false },
    { name: "Coaching + Studio", price: "À partir de 350€", duration: "3h30", features: ["Briefing message & structure (1h)", "Session studio complète (2h)", "Retours en temps réel", "Plan de recyclage contenu", "Fichiers montés livrés"], highlight: true, badge: "⭐ Recommandé" },
    { name: "Batch Content", price: "Sur devis", duration: "Journée", features: ["Journée de tournage complète", "Multi-formats (podcast, vidéo, Reels)", "Stratégie éditoriale incluse", "Accompagnement stratégique post-prod", "Idéal pour 6 semaines de contenu"], highlight: false },
  ];

  const tabContent = () => {
    if (activeTab === "studio") return (
      <div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem", marginBottom:"2.5rem" }}>
          <div style={{ gridColumn:"1/-1" }}>
            <div style={{ borderRadius:"18px", overflow:"hidden", position:"relative", height:"380px" }}>
              <img src={STUDIO_PHOTOS[activePhoto].url} alt={STUDIO_PHOTOS[activePhoto].alt} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(to top, rgba(10,10,15,0.95) 0%, transparent 100%)", padding:"2rem 1.5rem 1.5rem" }}>
                <div style={{ color:COLORS.gold, fontWeight:700, fontSize:"0.85rem" }}>{STUDIO_PHOTOS[activePhoto].label}</div>
              </div>
            </div>
          </div>
          {STUDIO_PHOTOS.map((p, i) => (
            <button key={i} onClick={() => setActivePhoto(i)} style={{ border:i===activePhoto?`2px solid ${COLORS.gold}`:`2px solid ${COLORS.border}`, borderRadius:"12px", overflow:"hidden", cursor:"pointer", padding:0, height:"90px", background:"transparent" }}>
              <img src={p.url} alt={p.alt} style={{ width:"100%", height:"100%", objectFit:"cover", opacity: i===activePhoto?1:0.6, transition:"opacity 0.2s" }} />
            </button>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1.5rem" }}>
          {[
            { icon:"🎥", title:"4 caméras simultanées", desc:"Captation multi-angles sans interruption. Chaque prise est une opportunité, rien n'est laissé au hasard." },
            { icon:"🟡", title:"Studio Jaune — jusqu'à 6 personnes", desc:"Pour vos tables rondes, interviews croisées, ou contenus en équipe. Lumineux, spacieux, chaleureux." },
            { icon:"🟢", title:"Studio Vert — configuration intime", desc:"Pour les prises de parole solo, les podcasts à 2, ou quand vous avez besoin d'un cadre épuré et concentré." },
            { icon:"🎚️", title:"Éclairage cinématographique", desc:"Des lumières réglables pour chaque ambiance : coaching, corporate, storytelling, interview premium." },
          ].map((f, i) => (
            <div key={i} style={{ background:COLORS.surface, borderRadius:"14px", padding:"1.5rem", border:`1px solid ${COLORS.border}` }}>
              <div style={{ fontSize:"1.5rem", marginBottom:"0.75rem" }}>{f.icon}</div>
              <div style={{ color:COLORS.cream, fontWeight:700, fontSize:"0.95rem", marginBottom:"0.4rem" }}>{f.title}</div>
              <div style={{ color:COLORS.muted, fontSize:"0.85rem", lineHeight:1.6, fontWeight:400 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    );

    if (activeTab === "accompagnement") return (
      <div>
        <div style={{ background:`linear-gradient(135deg,${COLORS.goldDim}15,${COLORS.surface})`, borderRadius:"18px", padding:"2.5rem", border:`1px solid ${COLORS.gold}30`, marginBottom:"2.5rem" }}>
          <p style={{ color:COLORS.gold, fontWeight:800, fontSize:"1.1rem", marginBottom:"0.75rem" }}>"Je ne loue pas un studio. J'accompagne votre transformation."</p>
          <p style={{ color:COLORS.creamDim, lineHeight:1.8, fontWeight:400 }}>Chez TODDA, la technique est au service du message. Avant de poser un micro, on travaille ensemble sur ce que vous avez à dire — et comment le dire pour que ça reste.</p>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem", marginBottom:"2.5rem" }}>
          {differentiators.map((d, i) => (
            <div key={i} style={{ background:COLORS.surface, borderRadius:"14px", padding:"1.5rem 2rem", border:`1px solid ${COLORS.border}`, display:"flex", gap:"1.25rem", alignItems:"flex-start" }}>
              <div style={{ fontSize:"1.75rem", flexShrink:0, marginTop:"2px" }}>{d.icon}</div>
              <div>
                <div style={{ color:COLORS.cream, fontWeight:700, fontSize:"1rem", marginBottom:"0.4rem" }}>{d.title}</div>
                <div style={{ color:COLORS.muted, fontSize:"0.88rem", lineHeight:1.7, fontWeight:400 }}>{d.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom:"1rem" }}>
          <div style={{ color:COLORS.gold, fontSize:"0.72rem", letterSpacing:"0.18em", textTransform:"uppercase", fontWeight:700, marginBottom:"1.5rem" }}>Ils en parlent mieux que moi</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1rem" }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background:COLORS.surface, borderRadius:"14px", padding:"1.5rem", border:`1px solid ${COLORS.border}` }}>
                <div style={{ color:COLORS.gold, fontSize:"0.85rem", marginBottom:"0.75rem" }}>{"★".repeat(t.stars)}</div>
                <p style={{ color:COLORS.creamDim, fontSize:"0.88rem", lineHeight:1.7, marginBottom:"1rem", fontStyle:"italic", fontWeight:400 }}>"{t.text}"</p>
                <div style={{ color:COLORS.cream, fontWeight:700, fontSize:"0.85rem" }}>{t.name}</div>
                <div style={{ color:COLORS.muted, fontSize:"0.78rem", fontWeight:400 }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    if (activeTab === "tarifs") return (
      <div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"1.25rem", marginBottom:"2.5rem" }}>
          {formules.map((f, i) => (
            <div key={i} style={{ background: f.highlight ? `linear-gradient(135deg,${COLORS.goldDim}20,${COLORS.surface})` : COLORS.surface, borderRadius:"18px", padding:"2rem 1.5rem", border: f.highlight ? `2px solid ${COLORS.gold}` : `1px solid ${COLORS.border}`, position:"relative", display:"flex", flexDirection:"column" }}>
              {f.badge && <div style={{ position:"absolute", top:"-12px", left:"50%", transform:"translateX(-50%)", background:COLORS.gold, color:COLORS.obsidian, padding:"0.25rem 0.9rem", borderRadius:"100px", fontSize:"0.72rem", fontWeight:800, whiteSpace:"nowrap" }}>{f.badge}</div>}
              <div style={{ color:COLORS.gold, fontWeight:800, fontSize:"1rem", marginBottom:"0.4rem" }}>{f.name}</div>
              <div style={{ color:COLORS.cream, fontWeight:900, fontSize:"1.4rem", marginBottom:"0.3rem" }}>{f.price}</div>
              <div style={{ color:COLORS.muted, fontSize:"0.8rem", marginBottom:"1.5rem", fontWeight:500 }}>{f.duration}</div>
              <div style={{ flex:1, display:"flex", flexDirection:"column", gap:"0.6rem", marginBottom:"1.75rem" }}>
                {f.features.map((feat, j) => (
                  <div key={j} style={{ display:"flex", gap:"0.6rem", alignItems:"flex-start" }}>
                    <span style={{ color:COLORS.gold, fontSize:"0.85rem", marginTop:"1px", flexShrink:0 }}>✓</span>
                    <span style={{ color:COLORS.creamDim, fontSize:"0.83rem", lineHeight:1.5, fontWeight:400 }}>{feat}</span>
                  </div>
                ))}
              </div>
              <a href="mailto:contact@todda.fr" style={{ display:"block", textAlign:"center", background: f.highlight ? COLORS.gold : "transparent", color: f.highlight ? COLORS.obsidian : COLORS.gold, border:`1.5px solid ${COLORS.gold}`, padding:"0.85rem", borderRadius:"8px", fontSize:"0.88rem", fontWeight:800, textDecoration:"none" }}>Réserver</a>
            </div>
          ))}
        </div>
        <div style={{ background:COLORS.surface, borderRadius:"14px", padding:"1.75rem 2rem", border:`1px solid ${COLORS.border}`, display:"flex", gap:"1.5rem", alignItems:"center" }}>
          <div style={{ fontSize:"2rem", flexShrink:0 }}>📍</div>
          <div>
            <div style={{ color:COLORS.cream, fontWeight:700, marginBottom:"0.3rem" }}>Studio Podcast Marseille</div>
            <div style={{ color:COLORS.muted, fontSize:"0.87rem", lineHeight:1.6, fontWeight:400 }}>Basé à Marseille/Aix-en-Provence · Réservation par mail ou téléphone · <a href="https://studiopodcastmarseille.fr" target="_blank" rel="noreferrer" style={{ color:COLORS.gold }}>studiopodcastmarseille.fr</a></div>
          </div>
          <a href="mailto:contact@todda.fr" style={{ flexShrink:0, background:COLORS.gold, color:COLORS.obsidian, border:"none", padding:"0.85rem 1.5rem", borderRadius:"8px", fontSize:"0.9rem", fontWeight:800, textDecoration:"none", cursor:"pointer" }}>contact@todda.fr</a>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight:"100vh", background:COLORS.obsidian, padding:"7rem 1.5rem 5rem", fontFamily:FONT }}>
      <div style={{ maxWidth:"960px", margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"3.5rem" }}>
          <div style={{ color:COLORS.gold, fontSize:"0.72rem", letterSpacing:"0.18em", textTransform:"uppercase", fontWeight:700, marginBottom:"1rem" }}>Studio Podcast Marseille</div>
          <h1 style={{ fontFamily:FONT, fontSize:"clamp(2rem,4vw,3rem)", color:COLORS.cream, fontWeight:900, marginBottom:"1rem" }}>Où votre voix prend forme</h1>
          <p style={{ color:COLORS.creamDim, maxWidth:"560px", margin:"0 auto", lineHeight:1.8, fontWeight:400 }}>Un studio de production premium, pensé pour les entrepreneurs et dirigeants qui veulent un contenu à la hauteur de leur expertise — sans compromis sur la qualité ni sur l'humain.</p>
        </div>
        <div style={{ display:"flex", gap:"0.5rem", marginBottom:"2.5rem", background:COLORS.surface, borderRadius:"12px", padding:"0.4rem", border:`1px solid ${COLORS.border}` }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ flex:1, padding:"0.8rem 1rem", borderRadius:"8px", border:"none", background: activeTab===t.id ? COLORS.gold : "transparent", color: activeTab===t.id ? COLORS.obsidian : COLORS.muted, fontWeight:700, fontSize:"0.88rem", cursor:"pointer", fontFamily:FONT, transition:"all 0.2s" }}>{t.label}</button>
          ))}
        </div>
        {tabContent()}
        <div style={{ marginTop:"3.5rem", textAlign:"center" }}>
          <button onClick={() => setPage("missions")} style={{ background:"transparent", color:COLORS.gold, border:`1.5px solid ${COLORS.gold}`, padding:"0.85rem 2rem", borderRadius:"8px", fontSize:"0.95rem", fontWeight:700, cursor:"pointer", fontFamily:FONT }}>← Retour aux missions</button>
        </div>
      </div>
    </div>
  );
}
function AuthPage({ user, setUser, setPage }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [gdpr, setGdpr] = useState(false);
  const [error, setError] = useState("");

  const inputStyle = { width:"100%", background:COLORS.surface, border:`1px solid ${COLORS.border}`, borderRadius:"10px", padding:"0.9rem 1.1rem", color:COLORS.cream, fontFamily:FONT, fontSize:"0.95rem", outline:"none", boxSizing:"border-box", fontWeight:500 };

  const handleSubmit = () => {
    if (!email.includes("@")) return setError("Adresse e-mail invalide.");
    if (mode === "signup" && !name.trim()) return setError("Veuillez indiquer votre prénom.");
    if (mode === "signup" && !gdpr) return setError("Veuillez accepter les conditions.");
    const userData = { name: name || email.split("@")[0], email };
    setUser(userData);
    localStorage.setItem("todda_user", JSON.stringify(userData));
    setPage("dashboard");
  };

  return (
    <div style={{ minHeight:"100vh", background:COLORS.obsidian, display:"flex", alignItems:"center", justifyContent:"center", padding:"2rem", fontFamily:FONT }}>
      <div style={{ width:"100%", maxWidth:"420px" }}>
        <div style={{ textAlign:"center", marginBottom:"2.5rem" }}>
          <div style={{ fontSize:"2rem", marginBottom:"0.75rem" }}>✦</div>
          <h1 style={{ fontFamily:FONT, fontSize:"1.75rem", color:COLORS.cream, fontWeight:900, marginBottom:"0.5rem" }}>{mode === "login" ? "Bon retour" : "Rejoindre TODDA"}</h1>
          <p style={{ color:COLORS.muted, fontWeight:400 }}>{mode === "login" ? "Connectez-vous à votre espace." : "Créez votre compte gratuitement."}</p>
        </div>
        <div style={{ background:COLORS.surface, borderRadius:"20px", padding:"2.5rem", border:`1px solid ${COLORS.border}` }}>
          {mode === "signup" && (
            <div style={{ marginBottom:"1.25rem" }}>
              <label style={{ display:"block", color:COLORS.creamDim, fontSize:"0.82rem", fontWeight:700, marginBottom:"0.5rem", letterSpacing:"0.08em" }}>PRÉNOM</label>
              <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Alexandre" />
            </div>
          )}
          <div style={{ marginBottom:"1.25rem" }}>
            <label style={{ display:"block", color:COLORS.creamDim, fontSize:"0.82rem", fontWeight:700, marginBottom:"0.5rem", letterSpacing:"0.08em" }}>E-MAIL</label>
            <input style={inputStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.fr" />
          </div>
          {mode === "signup" && (
            <div style={{ display:"flex", gap:"0.75rem", alignItems:"flex-start", marginBottom:"1.5rem" }}>
              <div onClick={() => setGdpr(!gdpr)} style={{ width:"20px", height:"20px", borderRadius:"5px", border:`2px solid ${gdpr ? COLORS.gold : COLORS.border}`, background: gdpr ? COLORS.gold : "transparent", cursor:"pointer", flexShrink:0, marginTop:"2px", display:"flex", alignItems:"center", justifyContent:"center" }}>
                {gdpr && <span style={{ color:COLORS.obsidian, fontSize:"12px", fontWeight:900 }}>✓</span>}
              </div>
              <span style={{ color:COLORS.muted, fontSize:"0.82rem", lineHeight:1.6, fontWeight:400 }}>J'accepte les conditions d'utilisation et la politique de confidentialité (RGPD). Mes données ne sont pas partagées.</span>
            </div>
          )}
          {error && <div style={{ color:"#FF6B6B", fontSize:"0.83rem", marginBottom:"1rem", fontWeight:600 }}>{error}</div>}
          <button onClick={handleSubmit} style={{ width:"100%", background:COLORS.gold, color:COLORS.obsidian, border:"none", padding:"1rem", borderRadius:"10px", fontSize:"1rem", fontWeight:800, cursor:"pointer", fontFamily:FONT, marginBottom:"1.25rem" }}>
            {mode === "login" ? "Se connecter" : "Créer mon compte"}
          </button>
          <div style={{ textAlign:"center" }}>
            <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }} style={{ background:"transparent", border:"none", color:COLORS.gold, cursor:"pointer", fontSize:"0.87rem", fontWeight:600, fontFamily:FONT }}>
              {mode === "login" ? "Pas encore de compte ? S'inscrire →" : "Déjà un compte ? Se connecter →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ user, badges, xpTotal, completedMissions, completedQuizzes, setPage, setUser }) {
  const level = Math.floor(xpTotal / 100) + 1;
  const xpInLevel = xpTotal % 100;
  const earnedBadges = BADGES.filter(b => badges.includes(b.id));

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("todda_user");
    setPage("home");
  };

  return (
    <div style={{ minHeight:"100vh", background:COLORS.obsidian, padding:"7rem 1.5rem 5rem", fontFamily:FONT }}>
      <div style={{ maxWidth:"800px", margin:"0 auto" }}>
        <div style={{ background:`linear-gradient(135deg,${COLORS.goldDim}20,${COLORS.surface})`, borderRadius:"20px", padding:"2.5rem", border:`1px solid ${COLORS.gold}40`, marginBottom:"2.5rem", display:"flex", gap:"2rem", alignItems:"center", flexWrap:"wrap" }}>
          <div style={{ width:"72px", height:"72px", borderRadius:"50%", background:`linear-gradient(135deg,${COLORS.gold},${COLORS.goldDim})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.8rem", flexShrink:0 }}>
            {user?.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ color:COLORS.cream, fontWeight:900, fontSize:"1.4rem", marginBottom:"0.25rem" }}>Bonjour {user?.name} 👋</div>
            <div style={{ color:COLORS.muted, fontSize:"0.88rem", fontWeight:400, marginBottom:"0.75rem" }}>{user?.email}</div>
            <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
              <span style={{ background:COLORS.obsidian, color:COLORS.gold, padding:"0.3rem 0.8rem", borderRadius:"100px", fontSize:"0.82rem", fontWeight:700 }}>⚡ Niveau {level}</span>
              <span style={{ background:COLORS.obsidian, color:COLORS.creamDim, padding:"0.3rem 0.8rem", borderRadius:"100px", fontSize:"0.82rem", fontWeight:600 }}>{xpTotal} XP total</span>
              <span style={{ background:COLORS.obsidian, color:COLORS.creamDim, padding:"0.3rem 0.8rem", borderRadius:"100px", fontSize:"0.82rem", fontWeight:600 }}>{completedMissions.length}/{MISSIONS.length} missions</span>
              <span style={{ background:COLORS.obsidian, color:COLORS.creamDim, padding:"0.3rem 0.8rem", borderRadius:"100px", fontSize:"0.82rem", fontWeight:600 }}>{completedQuizzes.length} quiz ✓</span>
            </div>
          </div>
        </div>

        <div style={{ background:COLORS.surface, borderRadius:"16px", padding:"2rem", border:`1px solid ${COLORS.border}`, marginBottom:"2rem" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.75rem" }}>
            <span style={{ color:COLORS.cream, fontWeight:700, fontSize:"0.9rem" }}>Progression Niveau {level}</span>
            <span style={{ color:COLORS.gold, fontWeight:700, fontSize:"0.9rem" }}>{xpInLevel}/100 XP</span>
          </div>
          <div style={{ background:COLORS.obsidian, borderRadius:"100px", height:"10px", overflow:"hidden" }}>
            <div style={{ width:`${xpInLevel}%`, height:"100%", background:`linear-gradient(90deg,${COLORS.goldDim},${COLORS.gold})`, borderRadius:"100px", transition:"width 0.8s ease" }} />
          </div>
          <div style={{ color:COLORS.muted, fontSize:"0.78rem", marginTop:"0.5rem", fontWeight:400 }}>{100 - xpInLevel} XP avant le niveau {level + 1}</div>
        </div>

        {earnedBadges.length > 0 && (
          <div style={{ background:COLORS.surface, borderRadius:"16px", padding:"2rem", border:`1px solid ${COLORS.border}`, marginBottom:"2rem" }}>
            <div style={{ color:COLORS.gold, fontSize:"0.72rem", letterSpacing:"0.18em", textTransform:"uppercase", fontWeight:700, marginBottom:"1.5rem" }}>Mes Badges ({earnedBadges.length})</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.75rem" }}>
              {earnedBadges.map(b => {
                const r = RARITY_COLORS[b.rarity];
                return (
                  <div key={b.id} style={{ background:r.bg, border:`1.5px solid ${r.border}`, borderRadius:"12px", padding:"0.75rem 1rem", display:"flex", alignItems:"center", gap:"0.6rem" }}>
                    <span style={{ fontSize:"1.25rem" }}>{b.icon}</span>
                    <div>
                      <div style={{ color:COLORS.cream, fontWeight:700, fontSize:"0.82rem" }}>{b.name}</div>
                      <div style={{ color:r.color, fontWeight:700, fontSize:"0.68rem", textTransform:"uppercase", letterSpacing:"0.08em" }}>{r.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ display:"flex", gap:"1rem", flexWrap:"wrap" }}>
          <button onClick={() => setPage("missions")} style={{ flex:1, background:COLORS.gold, color:COLORS.obsidian, border:"none", padding:"1rem", borderRadius:"10px", fontSize:"0.95rem", fontWeight:800, cursor:"pointer", fontFamily:FONT }}>Continuer les missions →</button>
          <button onClick={handleLogout} style={{ background:"transparent", color:COLORS.muted, border:`1px solid ${COLORS.border}`, padding:"1rem 1.5rem", borderRadius:"10px", fontSize:"0.9rem", fontWeight:600, cursor:"pointer", fontFamily:FONT }}>Déconnexion</button>
        </div>
      </div>
    </div>
  );
}
function HomePage({ setPage, user }) {
  return (
    <div style={{ minHeight:"100vh", background:COLORS.obsidian, fontFamily:FONT }}>
      <div style={{ maxWidth:"900px", margin:"0 auto", padding:"9rem 1.5rem 6rem", textAlign:"center" }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:"0.5rem", background:COLORS.surface, border:`1px solid ${COLORS.gold}40`, borderRadius:"100px", padding:"0.45rem 1.1rem", marginBottom:"2.5rem" }}>
          <span style={{ color:COLORS.gold, fontSize:"0.78rem", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" }}>TODDA × Studio Podcast Marseille</span>
        </div>
        <h1 style={{ fontFamily:FONT, fontSize:"clamp(2.5rem,6vw,4.5rem)", fontWeight:900, color:COLORS.cream, lineHeight:1.1, marginBottom:"1.5rem" }}>
          Révèle ta voix.<br />
          <span style={{ color:COLORS.gold }}>Libère ton impact.</span>
        </h1>
        <p style={{ color:COLORS.creamDim, fontSize:"clamp(1rem,2vw,1.2rem)", maxWidth:"580px", margin:"0 auto 3rem", lineHeight:1.8, fontWeight:400 }}>
          Diagnostic de communication, parcours personnalisé, studio de production premium. Tout ce qu'il faut pour que votre expertise soit enfin entendue.
        </p>
        <div style={{ display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap", marginBottom:"5rem" }}>
          <button onClick={() => setPage("quiz")} style={{ background:COLORS.gold, color:COLORS.obsidian, border:"none", padding:"1.1rem 2.25rem", borderRadius:"10px", fontSize:"1.05rem", fontWeight:800, cursor:"pointer", fontFamily:FONT, boxShadow:`0 8px 32px ${COLORS.gold}30` }}>
            Démarrer mon diagnostic →
          </button>
          <button onClick={() => setPage("studio")} style={{ background:"transparent", color:COLORS.cream, border:`1.5px solid ${COLORS.border}`, padding:"1.1rem 2.25rem", borderRadius:"10px", fontSize:"1rem", fontWeight:700, cursor:"pointer", fontFamily:FONT }}>
            Découvrir le studio
          </button>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.25rem", marginBottom:"5rem" }}>
          {[
            { icon:"🎯", title:"Diagnostic personnalisé", desc:"12 questions pour révéler votre profil communicant unique." },
            { icon:"🏆", title:"Parcours gamifié", desc:"7 missions avec quiz, badges et XP. La progression se voit." },
            { icon:"🎙️", title:"Studio premium", desc:"4 caméras, 2 configurations, accompagnement expert inclus." },
          ].map((f, i) => (
            <div key={i} style={{ background:COLORS.surface, borderRadius:"18px", padding:"2rem 1.5rem", border:`1px solid ${COLORS.border}`, textAlign:"center" }}>
              <div style={{ fontSize:"2rem", marginBottom:"1rem" }}>{f.icon}</div>
              <div style={{ color:COLORS.cream, fontWeight:700, fontSize:"1rem", marginBottom:"0.5rem" }}>{f.title}</div>
              <div style={{ color:COLORS.muted, fontSize:"0.85rem", lineHeight:1.6, fontWeight:400 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom:"4rem" }}>
          <div style={{ color:COLORS.gold, fontSize:"0.72rem", letterSpacing:"0.18em", textTransform:"uppercase", fontWeight:700, marginBottom:"1.5rem" }}>Badges à débloquer</div>
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"center", gap:"0.6rem" }}>
            {BADGES.slice(0, 12).map(b => {
              const r = RARITY_COLORS[b.rarity];
              return (
                <div key={b.id} title={b.desc} style={{ background:r.bg, border:`1.5px solid ${r.border}`, borderRadius:"10px", padding:"0.5rem 0.85rem", display:"flex", alignItems:"center", gap:"0.4rem" }}>
                  <span style={{ fontSize:"1rem" }}>{b.icon}</span>
                  <span style={{ color:COLORS.creamDim, fontSize:"0.78rem", fontWeight:600 }}>{b.name}</span>
                  <span style={{ color:r.color, fontSize:"0.65rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.06em" }}>{r.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ background:`linear-gradient(135deg,${COLORS.goldDim}20,${COLORS.surface})`, borderRadius:"22px", padding:"3rem 2.5rem", border:`1px solid ${COLORS.gold}40` }}>
          <p style={{ color:COLORS.gold, fontWeight:800, fontSize:"1.15rem", marginBottom:"0.75rem" }}>"Votre expertise existe. Votre voix doit exister aussi."</p>
          <p style={{ color:COLORS.creamDim, marginBottom:"2rem", lineHeight:1.8, fontWeight:400 }}>Alexandre · Coach communication & Fondateur TODDA</p>
          <button onClick={() => setPage("quiz")} style={{ background:COLORS.gold, color:COLORS.obsidian, border:"none", padding:"1rem 2rem", borderRadius:"10px", fontSize:"1rem", fontWeight:800, cursor:"pointer", fontFamily:FONT }}>Commencer maintenant →</button>
        </div>
      </div>
    </div>
  );
}

function Footer({ setPage }) {
  return (
    <footer style={{ background:COLORS.deep, borderTop:`1px solid ${COLORS.border}`, padding:"3rem 1.5rem 2rem", fontFamily:FONT }}>
      <div style={{ maxWidth:"900px", margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:"3rem", marginBottom:"2.5rem" }}>
          <div>
            <div style={{ color:COLORS.cream, fontWeight:900, fontSize:"1.1rem", marginBottom:"0.75rem", letterSpacing:"0.06em" }}>TODDA</div>
            <p style={{ color:COLORS.muted, fontSize:"0.85rem", lineHeight:1.7, fontWeight:400, marginBottom:"1rem" }}>Coaching communication, prise de parole et production vidéo pour entrepreneurs et dirigeants. Marseille / Aix-en-Provence.</p>
            <div style={{ display:"flex", gap:"0.6rem" }}>
              <a href="https://todda.fr" target="_blank" rel="noreferrer" style={{ color:COLORS.gold, fontSize:"0.82rem", fontWeight:600, textDecoration:"none" }}>todda.fr</a>
              <span style={{ color:COLORS.border }}>·</span>
              <a href="https://studiopodcastmarseille.fr" target="_blank" rel="noreferrer" style={{ color:COLORS.gold, fontSize:"0.82rem", fontWeight:600, textDecoration:"none" }}>studiopodcastmarseille.fr</a>
            </div>
          </div>
          <div>
            <div style={{ color:COLORS.creamDim, fontWeight:700, fontSize:"0.78rem", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"1rem" }}>Navigation</div>
            {[["home","Accueil"],["quiz","Diagnostic"],["missions","Missions"],["studio","Studio"]].map(([p, l]) => (
              <button key={p} onClick={() => setPage(p)} style={{ display:"block", background:"none", border:"none", color:COLORS.muted, cursor:"pointer", fontSize:"0.87rem", padding:"0.3rem 0", fontFamily:FONT, fontWeight:400, textAlign:"left" }}>{l}</button>
            ))}
          </div>
          <div>
            <div style={{ color:COLORS.creamDim, fontWeight:700, fontSize:"0.78rem", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"1rem" }}>Contact</div>
            <a href="mailto:contact@todda.fr" style={{ display:"block", color:COLORS.muted, fontSize:"0.87rem", marginBottom:"0.4rem", textDecoration:"none", fontWeight:400 }}>contact@todda.fr</a>
            <div style={{ color:COLORS.muted, fontSize:"0.87rem", fontWeight:400 }}>Marseille, PACA</div>
          </div>
        </div>
        <div style={{ borderTop:`1px solid ${COLORS.border}`, paddingTop:"1.5rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"1rem" }}>
          <span style={{ color:COLORS.muted, fontSize:"0.78rem", fontWeight:400 }}>© 2025 TODDA. Tous droits réservés.</span>
          <span style={{ color:COLORS.muted, fontSize:"0.78rem", fontWeight:400 }}>Données protégées — RGPD</span>
        </div>
      </div>
    </footer>
  );
}

function Toast({ toasts }) {
  return (
    <div style={{ position:"fixed", bottom:"1.5rem", right:"1.5rem", zIndex:9999, display:"flex", flexDirection:"column", gap:"0.6rem" }}>
      {toasts.map(t => {
        const r = RARITY_COLORS[t.rarity || "common"];
        return (
          <div key={t.key} style={{ background:r.bg, border:`2px solid ${r.border}`, borderRadius:"14px", padding:"0.85rem 1.25rem", display:"flex", alignItems:"center", gap:"0.75rem", boxShadow:`0 8px 32px rgba(0,0,0,0.5)`, animation:"slideIn 0.35s ease", minWidth:"260px" }}>
            <span style={{ fontSize:"1.5rem" }}>{t.icon}</span>
            <div>
              <div style={{ color:COLORS.cream, fontWeight:800, fontSize:"0.88rem" }}>Badge débloqué !</div>
              <div style={{ color:r.color, fontWeight:700, fontSize:"0.8rem" }}>{t.name} · <span style={{ textTransform:"uppercase", letterSpacing:"0.06em", fontSize:"0.68rem" }}>{r.label}</span></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(() => { try { const s = localStorage.getItem("todda_user"); return s ? JSON.parse(s) : null; } catch { return null; } });
  const [profile, setProfile] = useState(() => { try { const s = localStorage.getItem("todda_profile"); return s ? JSON.parse(s) : null; } catch { return null; } });
  const [xpTotal, setXpTotal] = useState(() => parseInt(localStorage.getItem("todda_xp") || "0"));
  const [badges, setBadges] = useState(() => { try { const s = localStorage.getItem("todda_badges"); return s ? JSON.parse(s) : []; } catch { return []; } });
  const [completedMissions, setCompletedMissions] = useState(() => { try { const s = localStorage.getItem("todda_missions"); return s ? JSON.parse(s) : []; } catch { return []; } });
  const [completedQuizzes, setCompletedQuizzes] = useState(() => { try { const s = localStorage.getItem("todda_quizzes"); return s ? JSON.parse(s) : []; } catch { return []; } });
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap";
    document.head.appendChild(link);
    const style = document.createElement("style");
    style.textContent = `@keyframes slideIn { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } } * { box-sizing: border-box; } body { margin:0; background:#0A0A0F; }`;
    document.head.appendChild(style);
  }, []);

  const addBadge = (badgeId) => {
    setBadges(prev => {
      if (prev.includes(badgeId)) return prev;
      const updated = [...prev, badgeId];
      localStorage.setItem("todda_badges", JSON.stringify(updated));
      const badge = BADGES.find(b => b.id === badgeId);
      if (badge) {
        const key = Date.now();
        setToasts(t => [...t, { ...badge, key }]);
        setTimeout(() => setToasts(t => t.filter(x => x.key !== key)), 3500);
      }
      return updated;
    });
  };

  const addXp = (amount) => {
    setXpTotal(prev => {
      const next = prev + amount;
      localStorage.setItem("todda_xp", String(next));
      if (prev < 100 && next >= 100) addBadge("xp_100");
      if (prev < 300 && next >= 300) addBadge("xp_300");
      if (prev < 600 && next >= 600) addBadge("xp_600");
      return next;
    });
  };

  const completeMission = (missionId) => {
    setCompletedMissions(prev => {
      if (prev.includes(missionId)) return prev;
      const updated = [...prev, missionId];
      localStorage.setItem("todda_missions", JSON.stringify(updated));
      if (updated.length === 1) addBadge("first_mission");
      if (updated.length === 3) addBadge("streak_3");
      if (updated.length === 5) addBadge("streak_5");
      if (updated.length === MISSIONS.length) addBadge("all_missions");
      if (missionId === 4) addBadge("camera_brave");
      if (missionId === 6) addBadge("pitch_master");
      if (missionId === 5) addBadge("content_creator");
      if (missionId === 7) addBadge("visibility_hero");
      const m = MISSIONS.find(x => x.id === missionId);
      if (m) addXp(m.xp);
      return updated;
    });
  };

  const completeQuiz = (missionId, perfect) => {
    setCompletedQuizzes(prev => {
      if (prev.includes(missionId)) return prev;
      const updated = [...prev, missionId];
      localStorage.setItem("todda_quizzes", JSON.stringify(updated));
      if (updated.length === 3) addBadge("quiz_3");
      if (updated.length === MISSIONS.length) addBadge("quiz_all");
      if (perfect) addBadge("quiz_perfect");
      addXp(20);
      return updated;
    });
  };

  const handleProfileSet = (p) => {
    setProfile(p);
    localStorage.setItem("todda_profile", JSON.stringify(p));
    addBadge("profile_revealed");
    addXp(30);
  };

  const handleQuizStart = () => {
    addBadge("first_step");
  };

  const handleAuth = (u) => {
    setUser(u);
    addBadge("account_created");
  };

  const navItems = [
    { id:"home", label:"Accueil" },
    { id:"quiz", label:"Diagnostic" },
    { id:"missions", label:"Missions" },
    { id:"studio", label:"Studio" },
    { id: user ? "dashboard" : "auth", label: user ? "Mon espace" : "Connexion" },
  ];

  return (
    <div style={{ fontFamily:FONT, background:COLORS.obsidian, minHeight:"100vh" }}>
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:`${COLORS.obsidian}F0`, backdropFilter:"blur(16px)", borderBottom:`1px solid ${COLORS.border}` }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"0 1.5rem", display:"flex", alignItems:"center", justifyContent:"space-between", height:"64px" }}>
          <button onClick={() => setPage("home")} style={{ background:"none", border:"none", cursor:"pointer", color:COLORS.gold, fontFamily:FONT, fontWeight:900, fontSize:"1.05rem", letterSpacing:"0.08em" }}>TODDA</button>
          <div style={{ display:"flex", gap:"0.25rem" }}>
            {navItems.map(n => (
              <button key={n.id} onClick={() => setPage(n.id)} style={{ background: page===n.id ? `${COLORS.gold}15` : "transparent", color: page===n.id ? COLORS.gold : COLORS.muted, border: page===n.id ? `1px solid ${COLORS.gold}40` : "1px solid transparent", padding:"0.45rem 1rem", borderRadius:"8px", cursor:"pointer", fontSize:"0.85rem", fontWeight:700, fontFamily:FONT, transition:"all 0.2s" }}>{n.label}</button>
            ))}
          </div>
          {xpTotal > 0 && <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", background:COLORS.surface, border:`1px solid ${COLORS.gold}40`, borderRadius:"100px", padding:"0.35rem 0.85rem" }}>
            <span style={{ color:COLORS.gold, fontSize:"0.8rem", fontWeight:800 }}>⚡ {xpTotal} XP</span>
          </div>}
        </div>
      </nav>

      {page === "home" && <HomePage setPage={setPage} user={user} />}
      {page === "quiz" && <QuizPage setPage={setPage} onProfile={handleProfileSet} onStart={handleQuizStart} />}
      {page === "missions" && <MissionsPage setPage={setPage} xpTotal={xpTotal} completedMissions={completedMissions} completedQuizzes={completedQuizzes} completeMission={completeMission} completeQuiz={completeQuiz} profile={profile} />}
      {page === "studio" && <StudioPage setPage={setPage} />}
      {page === "auth" && <AuthPage user={user} setUser={handleAuth} setPage={setPage} />}
      {page === "dashboard" && <DashboardPage user={user} badges={badges} xpTotal={xpTotal} completedMissions={completedMissions} completedQuizzes={completedQuizzes} setPage={setPage} setUser={setUser} />}

      <Footer setPage={setPage} />
      <Toast toasts={toasts} />
    </div>
  );
}
