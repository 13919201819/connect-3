import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    console.log("🚀 Starting Embedding Upload...");

    const SUPABASE_URL = process.env.SUPABASE_URL!;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY!;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: "Missing environment variables" },
        { status: 500 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const openai = new OpenAI({
      apiKey: OPENROUTER_API_KEY,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const filePath = path.join(process.cwd(), "final_clumoss_knowledge_base.txt");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: "KB file not found in root" },
        { status: 500 }
      );
    }

    const text = fs.readFileSync(filePath, "utf8");

    const chunks = text.split(/\n\s*\n/).filter((c) => c.trim().length > 0);

    for (let i = 0; i < chunks.length; i++) {
      console.log(`Embedding chunk ${i + 1}/${chunks.length}`);

      const response = await openai.embeddings.create({
        model: "openai/text-embedding-3-small",
        input: chunks[i],
      });

      const embedding = response.data[0].embedding;

      const { error } = await supabase.from("documents").insert({
        content: chunks[i],
        embedding,
      });

      if (error) {
        console.error("Supabase insert error:", error);
        return NextResponse.json({ error }, { status: 500 });
      }
    }

    return NextResponse.json(
      { message: "All embeddings uploaded successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { error: JSON.stringify(error) },
      { status: 500 }
    );
  }
}