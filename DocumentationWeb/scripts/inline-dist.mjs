import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const distDir = fileURLToPath(new URL("../dist/", import.meta.url));
const assetsDir = fileURLToPath(new URL("../dist/assets/", import.meta.url));

const indexPath = join(distDir, "index.html");
const assetNames = readdirSync(assetsDir);
const cssName = assetNames.find((name) => name.endsWith(".css"));
const jsName = assetNames.find((name) => name.endsWith(".js"));

if (!cssName || !jsName) {
  throw new Error("No se encontraron los assets CSS/JS generados por Vite.");
}

const css = readFileSync(join(assetsDir, cssName), "utf8")
  .replaceAll("url(/", "url(./");
const js = readFileSync(join(assetsDir, jsName), "utf8")
  .replaceAll('src="/', 'src="./')
  .replaceAll('src="/assets/images/', 'src="./assets/images/')
  .replaceAll("src=/assets/images/", "src=./assets/images/");

let html = readFileSync(indexPath, "utf8");

html = html
  .replace(/<script[^>]+src=["'][^"']+\.js["'][^>]*><\/script>/, "")
  .replace(/<link[^>]+href=["'][^"']+\.css["'][^>]*>/, `<style>\n${css}\n</style>`)
  .replace("</body>", `<script>\n${js}\n</script>\n</body>`);

writeFileSync(indexPath, html, "utf8");
