import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

const hasRootApp = existsSync(path.join(root, "app"));
const hasSrcApp = existsSync(path.join(root, "src", "app"));

if (hasRootApp && hasSrcApp) {
  throw new Error(
    "Existen app/ y src/app/. Revisa la estructura antes de continuar."
  );
}

if (!hasRootApp && !hasSrcApp) {
  throw new Error(
    "No se encontró app/ ni src/app/. Ejecuta el script desde la raíz de tu proyecto Next.js."
  );
}

const sourceRoot = hasSrcApp ? "src" : "";

const sourceDirectories = [
  "app/apps/tools/arkhamengine/new",
  "app/apps/tools/arkhamengine/campaigns/[campaignId]/scenarios/[scenarioId]",
  "app/api/arkhamengine/generate",

  "features/arkhamengine/components/shell",
  "features/arkhamengine/components/collection",
  "features/arkhamengine/components/configurator",
  "features/arkhamengine/components/campaign",
  "features/arkhamengine/components/scenario",
  "features/arkhamengine/components/shared",

  "features/arkhamengine/schemas",
  "features/arkhamengine/catalogs",
  "features/arkhamengine/engine",
  "features/arkhamengine/application",
  "features/arkhamengine/server",
  "features/arkhamengine/persistence",
  "features/arkhamengine/store",
  "features/arkhamengine/hooks",
  "features/arkhamengine/fixtures",
  "features/arkhamengine/tests",

  "components/ui",
  "lib/shared",
];

const rootDirectories = [
  "docs/arkhamengine",
  "public/arkhamengine",
  "e2e/arkhamengine",
];

for (const directory of sourceDirectories) {
  mkdirSync(path.join(root, sourceRoot, directory), {
    recursive: true,
  });
}

for (const directory of rootDirectories) {
  mkdirSync(path.join(root, directory), {
    recursive: true,
  });
}

console.log(
  `Carpetas creadas en ${sourceRoot || "la raíz del proyecto"}.`
);

console.log(
  "No se han creado ni sobrescrito archivos de implementación."
);