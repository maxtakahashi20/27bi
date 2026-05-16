const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const dirs = [
  path.join(root, ".next"),
  path.join(root, "node_modules", ".cache"),
  path.join(root, "node_modules", ".turbo"),
];

for (const d of dirs) {
  try {
    fs.rmSync(d, { recursive: true, force: true });
    console.log("removed:", d);
  } catch (e) {
    console.warn("skip:", d, (e && e.message) || e);
  }
}
