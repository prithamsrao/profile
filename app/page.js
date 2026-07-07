import { prisma } from "../lib/prisma";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import ProjectsSection from "../components/ProjectsSection";
import ExperienceSection from "../components/ExperienceSection";
import EducationSection from "../components/EducationSection";
import SkillsSection from "../components/SkillsSection";
import RecommendationsSection from "../components/RecommendationsSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

export const dynamic = "force-dynamic"; // always reflect latest host edits

export default async function HomePage() {
  const [profile, projects, experience, education, skills, recommendations] = await Promise.all([
    prisma.profile.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } }),
    prisma.project.findMany({ orderBy: { order: "asc" } }),
    prisma.experience.findMany({ orderBy: { order: "asc" } }),
    prisma.education.findMany({ orderBy: { order: "asc" } }),
    prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] }),
    prisma.recommendation.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <>
      <Nav name={profile.name} />
      <main>
        <Hero profile={profile} />
        <ProjectsSection projects={projects} />
        <ExperienceSection items={experience} />
        <EducationSection items={education} />
        <SkillsSection items={skills} />
        <RecommendationsSection items={recommendations} />
        <ContactSection profile={profile} />
      </main>
      <Footer name={profile.name} />
    </>
  );
}
