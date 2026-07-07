const { NextResponse } = require("next/server");
const { prisma } = require("../../../../lib/prisma");
const { requireHost } = require("../../../../lib/requireHost");

async function PUT(request, { params }) {
  const session = await requireHost();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const project = await prisma.project.update({
    where: { id: params.id },
    data: {
      title: body.title,
      summary: body.summary,
      description: body.description,
      coverImage: body.coverImage,
      techStack: body.techStack,
      repoUrl: body.repoUrl,
      demoUrl: body.demoUrl,
      articleUrl: body.articleUrl,
      order: Number(body.order) || 0,
    },
  });

  return NextResponse.json(project);
}

async function DELETE(request, { params }) {
  const session = await requireHost();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.project.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

module.exports = { PUT, DELETE };
