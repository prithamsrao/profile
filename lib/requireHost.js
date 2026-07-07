const { getServerSession } = require("next-auth");
const { authOptions } = require("./auth");

/**
 * Call at the top of any API route that mutates data.
 * Returns the session if the caller is the authenticated host,
 * or null (after the caller should respond 401) otherwise.
 */
async function requireHost() {
  const session = await getServerSession(authOptions);
  if (!session?.isHost) return null;
  return session;
}

module.exports = { requireHost };
