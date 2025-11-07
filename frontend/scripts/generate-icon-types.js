import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsDir = path.resolve(__dirname, "../src/assets/icons");
const outputFile = path.resolve(__dirname, "../src/types/generated/iconTypes.ts");

function generateIconTypes() {
	if (!fs.existsSync(iconsDir)) {
		console.error(`Icons directory not found: ${iconsDir}`);
		process.exit(1);
	}

	const files = fs.readdirSync(iconsDir);
	const iconNames = files
		.filter((file) => file.endsWith(".svg"))
		.map((file) => file.replace(".svg", ""));

	if (iconNames.length === 0) {
		console.warn("No SVG files found in icons directory");
		return;
	}

	const typeContent = `// This file is auto-generated. Do not edit manually.
// Run 'npm run generate:icons' to regenerate.

export type IconName = ${iconNames.map((name) => `"${name}"`).join(" | ")};
`;

	fs.writeFileSync(outputFile, typeContent, "utf-8");
	console.log(`✓ Generated icon types: ${iconNames.length} icons found`);
	console.log(`  Icons: ${iconNames.join(", ")}`);
}

generateIconTypes();
