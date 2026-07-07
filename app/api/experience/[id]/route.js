const { NextResponse } = require("next/server");
const { prisma } = require("../../../../lib/prisma");
const { requireHost } = require("../../../../lib/requireHost");

async function PUT(request, { params }) {
  const session = await requireHost();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const item = await prisma.experience.update({
    where: { id: params.id },
    data: {
      company: body.company,
      role: body.role,
      location: body.location,
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

  await prisma.experience.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}

module.exports = { PUT, DELETE };
