import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { createTemplate, type TemplateMap } from "../src/templates";

const sampleData: { [K in keyof TemplateMap]: TemplateMap[K] } = {
  merchOrder: {
    orderId: "TDX-20260410-123456",
    items: [
      {
        name: "T-shirt TEDxUB 2026",
        quantity: 2,
        variants: [{ type: "Size", label: "M" }],
        price: 240_000,
      },
      {
        name: "Topi TEDxUB",
        quantity: 1,
        price: 50_000,
      },
      {
        name: "Sticker Pack",
        quantity: 3,
        price: 45_000,
      },
    ],
  },
  merchOrderExpired: {
    orderId: "TDX-20260410-123456",
    items: [
      {
        name: "T-shirt TEDxUB 2026",
        quantity: 1,
        variants: [{ type: "Size", label: "L" }],
        price: 120_000,
      },
    ],
  },
  merchOrderRejected: {
    orderId: "TDX-20260410-123456",
    items: [
      {
        name: "Topi TEDxUB",
        quantity: 1,
        price: 50_000,
      },
    ],
    reason: "Pembayaran tidak valid / tidak terverifikasi",
  },
  ticketOrder: {
    orderId: "TDX-20260410-123456",
    item: {
      name: "Bundling 3 (ticket main event & ticket day 1 propaganda 3)",
      quantity: 1,
      price: 300_000,
      tickets: [
        {
          eventName: "Main Event",
          eventDate: "10 Mei 2026",
          whatsappGroupUrl: "https://chat.whatsapp.com/xxx",
        },
        {
          eventName: "Propa 3 Day 2",
          eventDate: "11 Mei 2026",
          whatsappGroupUrl: "https://chat.whatsapp.com/xxx",
        },
      ],
    },
    refundUrl: "https://store.tedxuniversitasbrawijaya.com/refund/1234567890",
  },
  ticketOrderExpired: {
    orderId: "TDX-20260410-123456",
    item: {
      name: "Ticket Propa 3 Day 1",
      quantity: 1,
      price: 150_000,
    },
  },
  ticketOrderRejected: {
    orderId: "TDX-20260410-123456",
    item: {
      name: "Ticket Main Event",
      quantity: 1,
      price: 200_000,
    },
    reason: "Pembayaran tidak valid / tidak terverifikasi",
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
