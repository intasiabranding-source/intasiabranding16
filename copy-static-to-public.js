const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const src = path.join(root, "static");
const dest = path.join(root, "public");

function copyRecursive(from, to) {
  if (!fs.existsSync(from)) return;
  const stat = fs.statSync(from);
  if (stat.isDirectory()) {
    if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
    for (const entry of fs.readdirSync(from)) {
      if (entry === "css" && from === src) {
        const cssDest = path.join(to, "css");
        if (!fs.existsSync(cssDest)) fs.mkdirSync(cssDest, { recursive: true });
        const cssDir = path.join(from, "css");
        for (const cssFile of fs.readdirSync(cssDir)) {
          if (cssFile === "input.css") continue;
          fs.copyFileSync(path.join(cssDir, cssFile), path.join(cssDest, cssFile));
        }
        continue;
      }
      copyRecursive(path.join(from, entry), path.join(to, entry));
    }
  } else {
    const base = path.basename(from);
    if (base === "input.css") return;
    fs.copyFileSync(from, to);
  }
}

if (fs.existsSync(dest)) {
  for (const entry of fs.readdirSync(dest)) {
    const target = path.join(dest, entry);
    if (entry === "admin") continue;
    fs.rmSync(target, { recursive: true, force: true });
  }
} else {
  fs.mkdirSync(dest, { recursive: true });
}

copyRecursive(src, dest);
console.log("Copied static/ to public/");
