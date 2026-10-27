/* ================================================================
   ERIC'S CHATBOT — KNOWLEDGE FILE
   ----------------------------------------------------------------
   This is the only file you need to edit to change what the bot says.

   Each entry in "topics" has:
     id        a short name (no spaces)
     keywords  words or phrases that point to this topic.
               More specific phrases ("eagle scout") count more than
               single words ("scout").
     answer    what the bot replies
     more      (optional) reply if the person then says "tell me more"
     links     (optional) buttons shown under the answer
               { label: "Button text", href: "#section-id" or a URL }

   To add a topic: copy one { ... } block, paste it, change the text,
   and make sure there's a comma between blocks.
   ================================================================ */

window.ERIC_BOT = {
  name: "Ask about Eric",

  welcome:
    "Hi! I'm a bot that answers questions about Eric Chan: his experience, skills, education, and how to reach him. What would you like to know?",

  // Shown as tappable buttons when the chat opens and after a miss
  suggestions: [
    "Who is Eric?",
    "What languages does he know?",
    "Tell me about his experience",
    "Where did he study?",
    "Can I see his resume?",
    "How do I contact him?",
     "Show me some of his projects."
  ],

  // Reply when a question doesn't match anything about Eric
  fallback:
    "I only know about Eric, so I can't help with that one. Try asking about his skills, experience, education, projects, or how to contact him.",

  // Languages Eric knows (used to answer "Does he know ___?")
  languages: ["Python", "Java", "C++", "C#", "SQL", "HTML"],

  topics: [
    {
      id: "greeting",
      short: true, // only matches short messages like "hi"
      keywords: ["hi", "hello", "hey", "yo", "sup", "good morning", "good afternoon", "good evening", "howdy"],
      answer: "Hi there! Ask me anything about Eric: his experience, skills, education, or how to get in touch."
    },
    {
      id: "thanks",
      short: true,
      keywords: ["thanks", "thank you", "thx", "appreciate", "cool", "awesome", "great", "nice"],
      answer: "Happy to help! Anything else you'd like to know about Eric?"
    },
    {
      id: "bot",
      keywords: ["who are you", "what are you", "are you ai", "are you a bot", "are you real", "are you eric", "how do you work"],
      answer: "I'm a small chatbot Eric built into his portfolio. I run entirely in your browser and only answer questions about Eric. For anything I can't answer, email him at chaneric022@gmail.com."
    },
    {
      id: "about",
      keywords: ["who is eric", "about eric", "who is he", "introduce", "background", "summary", "yourself", "about him", "overview"],
      answer: "Eric Chan is a software engineer and game developer based in Chicago. He's working on an M.S. in Artificial Intelligence at DePaul University (expected 2028) and has a bachelor's in Interactive Media and Game Design from UC Irvine. He enjoys building back-end systems and designing gameplay that keeps people engaged.",
      more: "Eric got his start with an associate's in Computer Science at Diablo Valley College. Since then he's interned in gamification at Skillwaze, where his features raised user engagement by 18.5%, tutored SAT students for almost three years, and earned the rank of Eagle Scout.",
      links: [{ label: "Read his About section", href: "#about" }]
    },
    {
      id: "languages",
      keywords: ["language", "languages", "programming", "code in", "coding", "python", "java", "c++", "c#", "sql", "html", "tech stack", "stack"],
      answer: "Eric programs in Python, Java, C++, C#, SQL, and HTML. He uses Python and Java for back-end and AI work, and C# and C++ for game development.",
      links: [{ label: "See all skills", href: "#skills" }]
    },
    {
      id: "skills",
      keywords: ["skill", "skills", "good at", "abilities", "strengths", "expertise", "capable", "what can he do", "specialize"],
      answer: "On the software side, Eric works on AI applications, system design, full-stack development, SQL databases, data management, and testing and debugging. On the game side, he focuses on character gameplay, gameplay systems, storytelling, cross-platform development, and player psychology.",
      more: "He's also detail-oriented and organized, and good at juggling several tasks while staying accurate. His tools include Unity, Unreal Engine, Visual Studio, GitHub, Jira, and Microsoft Office.",
      links: [{ label: "See all skills", href: "#skills" }]
    },
    {
      id: "tools",
      keywords: ["tools", "software he uses", "unity", "unreal", "unreal engine", "visual studio", "engine", "engines", "ide", "github", "jira", "microsoft office", "applications", "git"],
      answer: "Eric builds games in Unity and Unreal Engine and writes code in Visual Studio. He also uses GitHub for version control, Jira for tracking projects, and Microsoft Office for documentation and planning."
    },
    {
      id: "ai",
      keywords: ["ai", "artificial intelligence", "machine learning", "ml", "masters", "master's", "graduate", "grad school", "depaul"],
      answer: "Eric is a Master of Science in Artificial Intelligence candidate at DePaul University in Chicago, expected to graduate in 2028. He's interested in building AI applications and pairs that with his background in back-end programming and system design.",
      links: [{ label: "See education", href: "#education" }]
    },
    {
      id: "education",
      keywords: ["education", "study", "studied", "school", "college", "university", "degree", "degrees", "graduate from", "major", "uci", "uc irvine", "irvine", "diablo valley", "dvc", "bachelor", "associate"],
      answer: "Eric has three degrees in progress or completed:\n• M.S. in Artificial Intelligence, DePaul University (expected 2028)\n• Bachelor's in Interactive Media and Game Design, UC Irvine (June 2025)\n• Associate's in Computer Science, Diablo Valley College (May 2022)",
      more: "His coursework includes Object-Oriented Programming, Databases and Analytics, Applied Algorithms and Structures, Assembly Language, Programming for Games, Multiplayer Systems, and Storytelling and World Building.",
      links: [{ label: "See education", href: "#education" }]
    },
    {
      id: "coursework",
      keywords: ["coursework", "courses", "classes", "class", "took"],
      answer: "Eric's software courses include Object-Oriented Programming, Databases and Analytics, Applied Algorithms and Structures, Computer Engineering, Assembly Language, and Project Management. His game courses include Programming for Games, Multiplayer Systems, Storytelling and World Building, Visual Design Fundamentals, Roleplay and Improvisational Play, and Data Analytics."
    },
    {
      id: "graduation",
      keywords: ["graduate", "graduation", "when does he graduate", "when will he graduate", "graduating", "when does he finish", "finish school", "done with school", "2028"],
      answer: "Eric expects to finish his M.S. in Artificial Intelligence at DePaul in 2028. He completed his bachelor's at UC Irvine in June 2025."
    },
    {
      id: "experience",
      keywords: ["experience", "work history", "worked", "jobs", "job", "career", "employment", "positions", "roles he had"],
      answer: "Eric's experience includes:\n• Gamification Intern at Skillwaze (Jun–Sep 2024): raised user engagement by 18.5%\n• SAT Tutor at Summer SAT (Oct 2022–Jun 2025): students improved 100–200 points on average\n• Eagle Scout (2012–2019): led 20 volunteers on an 8-month service project\nAsk about any of these for details.",
      links: [{ label: "See experience", href: "#experience" }]
    },
    {
      id: "skillwaze",
      keywords: ["skillwaze", "internship", "intern", "gamification", "san ramon", "engagement"],
      answer: "From June to September 2024, Eric was a Gamification Intern at Skillwaze in San Ramon, CA. He studied user engagement data to find where retention was slipping, then designed and tested 7 new gamification features that raised user engagement by 18.5%.",
      more: "He worked with several teams to make sure each game mechanic supported a real user or business goal, not just added points and badges for their own sake."
    },
    {
      id: "tutor",
      keywords: ["tutor", "tutoring", "sat", "teaching", "teach", "summer sat"],
      answer: "From October 2022 to June 2025, Eric tutored SAT students at Summer SAT in Irvine. He analyzed practice-test results to find each student's weak spots and built personalized study plans, and his students improved by 100–200 points on average."
    },
    {
      id: "scout",
      keywords: ["eagle scout", "scout", "scouts", "boy scouts", "leadership", "volunteer", "volunteering", "community service", "lead", "led", "team lead"],
      answer: "Eric is an Eagle Scout (Boy Scouts of America, 2012–2019). For his Eagle project he led 20 volunteers through an 8-month community service project totaling 200–250 volunteer hours, handling the proposal, materials, logistics, and timeline himself.",
      more: "He also planned and supervised troop trips, which taught him safety planning and how to resolve conflicts within a group."
    },
    {
      id: "games",
      keywords: ["game", "games", "game dev", "game development", "game design", "game designer", "gameplay", "unity", "unreal", "video game", "gaming", "mechanics", "level design"],
      answer: "Eric studied Interactive Media and Game Design at UC Irvine. He focuses on gameplay systems, character mechanics, storytelling, and player psychology, and he's taken courses in Programming for Games and Multiplayer Systems. He helped build the team game Into the Light, and at Skillwaze he applied game design to a real product and raised engagement by 18.5%.",
      links: [{ label: "Game designer resume", href: "Eric_Chan_Resume_Game.pdf" }]
    },
    {
      id: "software",
      keywords: ["software", "software engineer", "software engineering", "developer", "back end", "backend", "full stack", "full-stack", "system design", "database", "databases"],
      answer: "As a software engineer, Eric works on back-end programming, system design, SQL databases, and full-stack development, mainly in Python, Java, and C++. He's adding AI to that toolkit through his master's at DePaul.",
      links: [{ label: "Software resume", href: "Eric_Chan_Resume_Software.pdf" }]
    },
    {
      id: "projects",
      keywords: ["project", "projects", "portfolio", "built", "made", "work samples", "demo"],
      answer: "You're actually speaking to one right now! His other featured projects include the gamification work at Skillwaze, where 7 new features raised engagement by 18.5%, and Into the Light, a team game where he helped design core features, balance gameplay, and create characters. You'll find more in the Projects section of this page.",
      links: [{ label: "See projects", href: "#projects" }]
    },
    {
      id: "intothelight",
      keywords: ["into the light", "into the light game", "capstone", "gdim", "video", "trailer", "his game", "game project", "game he made", "game he worked on", "balance", "balancing", "character design", "characters"],
      answer: "Into the Light is Eric's capstone game for UC Irvine's GDIM 167 course, built with a team. He helped design and implement its core gameplay features, tuned the game's balance so it stayed challenging but fair, and contributed to the conception of its characters.",
      links: [
        { label: "Watch the video", href: "https://www.youtube.com/watch?v=RrNsYFPFeYs" },
        { label: "See projects", href: "#projects" }
      ]
    },
    {
      id: "resume",
      keywords: ["resume", "cv", "pdf", "download"],
      answer: "Eric has two resumes, one for each kind of role:",
      links: [
        { label: "Software Engineer resume", href: "Eric_Chan_Resume_Software.pdf" },
        { label: "Game Designer resume", href: "Eric_Chan_Resume_Game.pdf" }
      ]
    },
    {
      id: "contact",
      keywords: ["contact", "email", "reach", "get in touch", "message him", "talk to him", "linkedin", "connect", "phone", "call"],
      answer: "The best way to reach Eric is email: chaneric022@gmail.com. His phone number is on his resume.",
      links: [{ label: "Go to Contact", href: "#contact" }]
    },
    {
      id: "location",
      keywords: ["where", "location", "live", "based", "located", "chicago", "city", "relocate", "remote"],
      answer: "Eric is based in Chicago, Illinois, where he studies at DePaul."
    },
    {
      id: "hire",
      keywords: ["hire", "hiring", "available", "availability", "looking for", "open to", "job search", "internship opportunities", "interview", "why should"],
      answer: "Eric is looking for software engineering and game development roles and internships. He brings a mix of technical skills (Python, Java, C++, C#, SQL) and game design training, plus a proven result: an 18.5% engagement increase at Skillwaze. Email him at chaneric022@gmail.com.",
      links: [{ label: "Contact Eric", href: "#contact" }]
    }
  ]
};
