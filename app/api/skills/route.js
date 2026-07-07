const { NextResponse } = require("next/server");
const { prisma } = require("../../../lib/prisma");
const { requireHost } = require("../../../lib/requireHost");

async function GET() {
  const items = await prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });
  return NextResponse.json(items);
}

async function POST(request) {
  const session = await requireHost();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const item = await prisma.skill.create({
    data: {
      category: body.category || "Other",
      name: body.name || "",
      order: Number(body.order) || 0,
    },
  });

  return NextResponse.json(item, { status: 201 });
}

module.exports = { GET, POST };
