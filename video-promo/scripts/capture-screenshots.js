const path = require("path");
const { existsSync, mkdirSync } = require("fs");
const { chromium } = require("playwright");

const SITE = "file://" + path.resolve(__dirname, "..", "..");
const OUT_DIR = path.resolve(__dirname, "..", "public", "screenshots");

const ME_RESPONSE = {
  user: {
    id: 1,
    prenom: "Léa",
    email: "lea@example.com",
    plan: "premium",
    credits: 24,
    credits_used: 6,
    visio_credits: 3,
  },
};

const SAMPLE_LETTER = `Madame, Monsieur,

Actuellement étudiante en BUT Informatique, je suis passionnée par le développement web et je souhaite vivement rejoindre votre équipe pour un stage de fin d'études.

Au cours de mes projets académiques, j'ai développé des applications en React et Python, et j'ai particulièrement apprécié résoudre des problèmes concrets en équipe. Votre entreprise, reconnue pour l'innovation de ses outils numériques, correspond exactement à l'environnement dans lequel je souhaite progresser.

Rigoureuse, curieuse et autonome, je suis convaincue de pouvoir apporter une réelle valeur ajoutée à vos projets tout en poursuivant mon apprentissage à vos côtés.

Je me tiens à votre disposition pour un entretien et vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

Léa`;

const SAMPLE_COURSE = `Chapitre 3 — Fonctions et dérivées (Python + Maths)

def derivee(f, x, h=1e-6):
    return (f(x + h) - f(x - h)) / (2 * h)

Une fonction f est dérivable en x si sa dérivée f'(x) existe.
Règle : la dérivée de x^n est n * x^(n-1).
Exemple : f(x) = x^2 → f'(x) = 2x`;

const QUIZ = {
  questions: [
    {
      q: "Quelle est la dérivée de f(x) = x² sur ℝ ?",
      options: ["f'(x) = x", "f'(x) = 2x", "f'(x) = x²", "f'(x) = 2"],
      correct: 1,
      explication: "La dérivée de xⁿ est n·x^(n-1). Pour x², on obtient donc 2x.",
    },
  ],
};

async function mockBackend(page) {
  await page.route("**/lettrepro-production.up.railway.app/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "{}" }),
  );
  await page.route("**/api/me", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(ME_RESPONSE) }),
  );
  await page.addInitScript(() => {
    window.localStorage.setItem("lp_token", "demo-token");
  });
}

async function run() {
  mkdirSync(OUT_DIR, { recursive: true });

  // Some sandboxes only allow a pre-installed Playwright browser; use it when
  // present, otherwise fall back to Playwright's own (downloaded) browser.
  const sandboxChrome = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
  const browser = await chromium.launch(existsSync(sandboxChrome) ? { executablePath: sandboxChrome } : {});

  // ---------- Letter generator: fill in steps, loading, result ----------
  {
    const page = await browser.newPage({ viewport: { width: 1180, height: 1000 }, deviceScaleFactor: 2 });
    await mockBackend(page);
    await page.route("**/api/generate", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ letter: SAMPLE_LETTER, creditsLeft: 23 }),
      }),
    );
    await page.goto(SITE + "/dashboard.html", { waitUntil: "networkidle" });
    await page.waitForSelector("#g-poste", { state: "visible", timeout: 15000 });
    const genCard = page.locator("#page-generate .gen-card");

    await page.fill("#g-poste", "Stage développeur web");
    await genCard.screenshot({ path: OUT_DIR + "/generator-poste.png" });

    await page.fill("#g-entreprise", "Capgemini");
    await page.fill(
      "#g-profil",
      "Étudiant en BUT Informatique 2e année, passionné de développement web, React et Python...",
    );
    await genCard.screenshot({ path: OUT_DIR + "/generator-full.png" });

    await page.evaluate(() => {
      document.getElementById("gen-btn").disabled = true;
      document.getElementById("loading").classList.add("visible");
    });
    await genCard.screenshot({ path: OUT_DIR + "/generator-loading.png" });
    await page.evaluate(() => {
      document.getElementById("gen-btn").disabled = false;
      document.getElementById("loading").classList.remove("visible");
    });

    await page.click("#gen-btn");
    await page.waitForSelector("#result-card.visible", { timeout: 15000 });
    await page.waitForTimeout(300);
    await page.locator("#result-card").screenshot({ path: OUT_DIR + "/generator-result.png" });
    await page.close();
  }

  // ---------- Study: paste course, loading, then quiz question states ----------
  {
    const page = await browser.newPage({ viewport: { width: 1180, height: 1000 }, deviceScaleFactor: 2 });
    await mockBackend(page);
    await page.goto(SITE + "/dashboard.html", { waitUntil: "networkidle" });
    await page.waitForSelector("#g-poste", { state: "visible", timeout: 15000 });

    await page.click('[data-page="study"]');
    await page.waitForSelector("#study-cours", { state: "visible", timeout: 15000 });
    const studyCard = page.locator("#study-generate .gen-card");

    await studyCard.screenshot({ path: OUT_DIR + "/study-blank.png" });

    await page.fill("#study-cours", SAMPLE_COURSE);
    await studyCard.screenshot({ path: OUT_DIR + "/study-typed.png" });

    await page.evaluate(() => {
      document.getElementById("study-btn").disabled = true;
      document.getElementById("study-loading").classList.add("visible");
    });
    await studyCard.screenshot({ path: OUT_DIR + "/study-loading.png" });

    // ---- quiz question: unanswered, option A selected, option B selected, validated ----
    await page.waitForSelector("#study-result-card", { state: "attached", timeout: 15000 });
    await page.evaluate((quiz) => {
      document.getElementById("study-result-card").classList.add("visible");
      document.getElementById("study-result-panels").innerHTML = renderQuizHTML(quiz, null);
      renderQuestion();
    }, QUIZ);
    await page.waitForTimeout(150);
    await page.locator("#study-result-card").screenshot({ path: OUT_DIR + "/quiz-question.png" });

    await page.evaluate(() => selectOption(0));
    await page.waitForTimeout(150);
    await page.locator("#study-result-card").screenshot({ path: OUT_DIR + "/quiz-select-a.png" });

    await page.evaluate(() => selectOption(1));
    await page.waitForTimeout(150);
    await page.locator("#study-result-card").screenshot({ path: OUT_DIR + "/quiz-select-b.png" });

    await page.evaluate(() => validateAnswer());
    await page.waitForTimeout(150);
    await page.locator("#study-result-card").screenshot({ path: OUT_DIR + "/quiz-correct.png" });

    await page.close();
  }

  await browser.close();
  console.log("done");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
