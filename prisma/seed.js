const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: "Alex Rivera",
      title: "Full-Stack Engineer",
      bio: "I build fast, reliable web products end to end -- from database schema to the pixel on screen. Currently exploring agentic tooling and developer experience.",
      location: "Bengaluru, India",
      email: "you@example.com",
      github: "https://github.com/yourhandle",
      linkedin: "https://linkedin.com/in/yourhandle",
      twitter: "https://twitter.com/yourhandle",
      website: "",
    },
  });

  await prisma.project.createMany({
    data: [
      {
        title: "Realtime Order Dashboard",
        summary: "Live operations dashboard processing 10k+ events/min.",
        description:
          "Built a realtime dashboard for a logistics team to track order status across warehouses. Used WebSockets for live updates, a materialized view layer for fast aggregation, and role-based views for ops vs. management. Reduced manual status-checking time by roughly 70%.",
        coverImage: "",
        techStack: "Next.js,PostgreSQL,WebSockets,TailwindCSS",
        repoUrl: "https://github.com/yourhandle/order-dashboard",
        demoUrl: "",
        articleUrl: "",
        order: 1,
      },
      {
        title: "Design System & Component Library",
        summary: "Shared UI kit adopted across 6 product teams.",
        description:
          "Designed and documented a token-based component library (Figma + React) to unify five products under one visual language. Included accessibility audits, dark-mode support, and a Storybook-based playground for design QA.",
        coverImage: "",
        techStack: "React,TypeScript,Storybook,Figma",
        repoUrl: "https://github.com/yourhandle/design-system",
        demoUrl: "",
        articleUrl: "",
        order: 2,
      },
      {
        title: "CLI Deployment Tool",
        summary: "Internal CLI cutting deploy time from 12 min to 90 sec.",
        description:
          "Wrote a Go-based CLI that wraps our CI/CD pipeline with sane defaults, rollback support, and Slack notifications. Adopted team-wide, now runs on every merge to main.",
        coverImage: "",
        techStack: "Go,Docker,GitHub Actions",
        repoUrl: "https://github.com/yourhandle/deploy-cli",
        demoUrl: "",
        articleUrl: "",
        order: 3,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.education.createMany({
    data: [
      {
        institution: "State University",
        degree: "B.Tech",
        field: "Computer Science",
        startDate: "2016",
        endDate: "2020",
        description: "Focused on distributed systems and human-computer interaction.",
        order: 1,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.experience.createMany({
    data: [
      {
        company: "Acme Corp",
        role: "Senior Software Engineer",
        location: "Remote",
        startDate: "2022",
        endDate: null,
        description: "Leading the platform team responsible for internal developer tooling.",
        order: 1,
      },
      {
        company: "Startup Labs",
        role: "Software Engineer",
        location: "Bengaluru, India",
        startDate: "2020",
        endDate: "2022",
        description: "Built and shipped core product features for a B2B SaaS platform from seed to Series A.",
        order: 2,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.skill.createMany({
    data: [
      { category: "Languages", name: "JavaScript / TypeScript", order: 1 },
      { category: "Languages", name: "Python", order: 2 },
      { category: "Languages", name: "Go", order: 3 },
      { category: "Frameworks", name: "Next.js / React", order: 1 },
      { category: "Frameworks", name: "Node.js", order: 2 },
      { category: "Tools", name: "Docker", order: 1 },
      { category: "Tools", name: "PostgreSQL", order: 2 },
      { category: "Tools", name: "Git / GitHub Actions", order: 3 },
    ],
    skipDuplicates: true,
  });

  await prisma.recommendation.createMany({
    data: [
      {
        name: "Jordan Lee",
        role: "Engineering Manager, Acme Corp",
        quote:
          "One of the most reliable engineers I've worked with -- picks up ambiguous problems and returns with a clear plan, not just code.",
        photo: "",
        order: 1,
      },
      {
        name: "Priya Nair",
        role: "Product Designer, Startup Labs",
        quote:
          "Great design collaborator. Always pushed back thoughtfully on feasibility instead of just saying yes or no.",
        photo: "",
        order: 2,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
