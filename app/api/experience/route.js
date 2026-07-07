const { NextResponse } = require("next/server");
const { prisma } = require("../../../lib/prisma");
const { requireHost } = require("../../../lib/requireHost");

async function GET() {
  const items = await prisma.experience.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

async function POST(request) {
  const session = await requireHost();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const item = await prisma.experience.create({
    data: {
      company: body.company || "",
      role: body.role || "",
      location: body.location || "",
      startDate: body.startDate || "",
      endDate: body.endDate || "",
      description: body.description || "",
      order: Number(body.order) || 0,
    },
  });

  return NextResponse.json(item, { status: 201 });
}

module.exports = { GET, POST };
