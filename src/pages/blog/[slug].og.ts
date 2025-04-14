import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { readFileSync } from "node:fs";
import { html } from "satori-html";
import satori from "satori";
import sharp from "sharp";
import { SITE_TITLE_SHORT } from "@data/config";
import createSlug from "@lib/createSlug";
import { getPageTitle } from "@lib/getPageTitle";

export async function GET({ params }: APIContext) {
  const { slug } = params;

  if (!slug) {
    return new Response("Slug not provided", { status: 400 });
  }

  const postEntries = await getCollection("blog");
  const entry = postEntries.find(
    (entry) => createSlug(entry.data.title, entry.slug) === slug
  );

  const pubDate = entry?.data.pubDate
    ? new Date(entry.data.pubDate).toLocaleDateString("es-ES", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      })
    : "";

  const title = getPageTitle(slug, entry?.data.title);
  const cleanTitle = removeEmojis(title);

  const fontFilePath = `${process.cwd()}/public/fonts/inter.ttf`;
  const fontFile = readFileSync(fontFilePath);

  const isBlogPost = !!entry;

  const markup = html(`
    <div style="
      width: 100%;
      height: 100%;
      background: linear-gradient(145deg, #1E1B2E, #2E1F55);
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Inter';
      color: white;
    ">
      <div style="
        background: rgba(255, 255, 255, 0.05);
        padding: 60px 80px;
        border-radius: 32px;
        max-width: 1000px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        text-align: center;
        width: 100%;
        box-sizing: border-box;
      ">
        <h1 style="
          font-size: 64px;
          font-weight: 800;
          line-height: 1.2;
          margin: 0;
          word-break: break-word;
          white-space: pre-wrap;
        ">
          ${cleanTitle}
        </h1>
        ${
          isBlogPost
            ? `
        <div style="
          margin-top: 48px;
          font-size: 24px;
          font-weight: 500;
          opacity: 0.85;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          padding-top: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        ">
          ${SITE_TITLE_SHORT} - ${pubDate}
        </div>
        `
            : ""
        }
      </div>
    </div>
  `);

  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Inter",
        data: fontFile,
        style: "normal",
      },
    ],
  });
  const png = sharp(Buffer.from(svg)).png();
  const response = await png.toBuffer();

  return new Response(response, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "s-maxage=1, stale-while-revalidate=59",
    },
  });
}

function removeEmojis(text: string) {
  return text.replace(/[^\p{L}\p{N}\p{P}\p{Zs}]/gu, '');
}