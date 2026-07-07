const { NextResponse } = require("next/server");
const { prisma } = require("../../../lib/prisma");
const { requireHost } = require("../../../lib/requireHost");

async function GET() {
  const items = await prisma.recommendation.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

async function POST(request) {
  const session = await requireHost();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const item = await prisma.recommendation.create({
    data: {
      name: body.name || "",
      role: body.role || "",
      quote: body.quote || "",
      photo: body.photo || "",
      order: Number(body.order) || 0,
    },
  });

  return NextResponse.json(item, { status: 201 });
}

module.exports = { GET, POST };
