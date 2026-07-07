const readline = require("readline");
const bcrypt = require("bcryptjs");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question("Enter the password you want to use for host login: ", async (password) => {
  if (!password) {
    console.error("Password cannot be empty.");
    rl.close();
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);
  console.log("\nAdd this to your .env file:\n");
  console.log(`ADMIN_PASSWORD_HASH="${hash}"\n`);
  rl.close();
});
