const { NextResponse } = require("next/server");
const { prisma } = require("../../../../lib/prisma");
const { requireHost } = require("../../../../lib/requireHost");

async function PUT(request, { params }) {
  const session = await requireHost();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const item = await prisma.education.update({
    where: { id: params.id },
    data: {
      institution: body.institution,
      degree: body.degree,
      field: body.field,
      startDate: body.startDate,
      endDate: body.endDate,
      description: body.description,
      order: Number(body.order) || 0,
    },
  });

  return NextResponse.json(item);
}

async function DELETE(request, { params }) {
  const session = await requireHost();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.education.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

module.exports = { PUT, DELETE };
