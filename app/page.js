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
import Reveal from "../components/Reveal";

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
        <Reveal><ProjectsSection projects={projects} /></Reveal>
        <Reveal><ExperienceSection items={experience} /></Reveal>
        <Reveal><EducationSection items={education} /></Reveal>
        <Reveal><SkillsSection items={skills} /></Reveal>
        <Reveal><RecommendationsSection items={recommendations} /></Reveal>
        <Reveal><ContactSection profile={profile} /></Reveal>
      </main>
      <Footer name={profile.name} />
    </>
  );
}
