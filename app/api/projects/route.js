const { NextResponse } = require("next/server");
const { prisma } = require("../../../lib/prisma");
const { requireHost } = require("../../../lib/requireHost");

async function GET() {
  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(projects);
}

async function POST(request) {
  const session = await requireHost();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const project = await prisma.project.create({
    data: {
      title: body.title || "Untitled project",
      summary: body.summary || "",
      description: body.description || "",
      coverImage: body.coverImage || "",
      techStack: body.techStack || "",
      repoUrl: body.repoUrl || "",
      demoUrl: body.demoUrl || "",
      articleUrl: body.articleUrl || "",
      order: Number(body.order) || 0,
    },
  });

  return NextResponse.json(project, { status: 201 });
}

module.exports = { GET, POST };
