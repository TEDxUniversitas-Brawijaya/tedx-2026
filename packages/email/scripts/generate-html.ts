import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createTemplate, type TemplateMap } from "../src/templates";

const sampleData: { [K in keyof TemplateMap]: TemplateMap[K] } = {
  merchOrder: {
    name: "Budi Santoso",
    items: [
      {
        name: "T-shirt TEDxUB 2026",
        quantity: 2,
        size: "M",
        price: 240_000,
      },
      {
        name: "Topi TEDxUB",
        quantity: 1,
        size: "Free Size",
        price: 50_000,
      },
      {
        name: "Sticker Pack",
        quantity: 3,
        price: 45_000,
      },
    ],
  },
  ticketOrder: {
    name: "Siti Aminah",
    ticket: {
      name: "Early Bird Ticket",
      quantity: 2,
      price: 150_000,
      whatsappGroupUrl: "https://chat.whatsapp.com/EXAMPLEGROUPLINK",
    },
    refundUrl: "https://store.tedxuniversitasbrawijaya.com/refund/1234567890",
  },
};

async function generateHTML(): Promise<void> {
  const outputDir = join(process.cwd(), "temp");

  // Ensure output directory exists
  await mkdir(outputDir, { recursive: true });

  // Generate HTML for each template
  const templates = Object.keys(sampleData) as (keyof TemplateMap)[];

  for (const templateName of templates) {
    const data = sampleData[templateName];
    const html = createTemplate(templateName, data);
    const outputPath = join(outputDir, `${templateName}.html`);

    await writeFile(outputPath, html, "utf-8");
    console.log(`✅ Generated ${templateName}.html`);
  }

  console.log(
    `\n✨ All email templates generated successfully in: ${outputDir}`
  );
}

generateHTML().catch((error) => {
  console.error("Error generating email templates:", error);
  process.exit(1);
});
