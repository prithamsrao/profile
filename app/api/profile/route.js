const { NextResponse } = require("next/server");
const { prisma } = require("../../../lib/prisma");
const { requireHost } = require("../../../lib/requireHost");

async function GET() {
  const profile = await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1 },
  });
  return NextResponse.json(profile);
}

async function PUT(request) {
  const session = await requireHost();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const profile = await prisma.profile.upsert({
    where: { id: 1 },
    update: {
      name: body.name,
      title: body.title,
      bio: body.bio,
      location: body.location,
      email: body.email,
      github: body.github,
      linkedin: body.linkedin,
      twitter: body.twitter,
      website: body.website,
    },
    create: {
      id: 1,
      name: body.name,
      title: body.title,
      bio: body.bio,
      location: body.location,
      email: body.email,
      github: body.github,
      linkedin: body.linkedin,
      twitter: body.twitter,
      website: body.website,
    },
  });

  return NextResponse.json(profile);
}

module.exports = { GET, PUT };
