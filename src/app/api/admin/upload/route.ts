import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

const SESSION_TOKEN = "admin_session_token_2024";

async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  return session?.value === SESSION_TOKEN;
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const uploadsDir = path.join(process.cwd(), "public/uploads");

    let savedLocally = false;
    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const filepath = path.join(uploadsDir, filename);
      fs.writeFileSync(filepath, buffer);
      savedLocally = true;
    } catch (fsErr) {
      // Expected in read-only serverless hosts like Vercel
      console.warn("[Upload] Local filesystem is read-only:", fsErr);
    }

    // Attempt GitHub direct commit if token is present
    const token = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;
    const repo = process.env.GITHUB_REPOSITORY || "gowthamdev-me/gowthamdev.me";
    const branch = process.env.GITHUB_BRANCH || "main";

    if (token) {
      try {
        const ghUrl = `https://api.github.com/repos/${repo}/contents/public/uploads/${filename}`;
        const putRes = await fetch(ghUrl, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `Upload ${filename} via admin panel`,
            content: buffer.toString("base64"),
            branch,
          }),
        });

        if (putRes.ok) {
          const rawUrl = `https://raw.githubusercontent.com/${repo}/${branch}/public/uploads/${filename}`;
          return NextResponse.json({
            success: true,
            url: rawUrl,
            filename: filename,
            syncedToGitHub: true,
          });
        } else {
          const errBody = await putRes.json();
          console.error("[Upload] GitHub API upload failed:", errBody);
        }
      } catch (ghErr) {
        console.error("[Upload] Error uploading to GitHub:", ghErr);
      }
    }

    if (savedLocally) {
      return NextResponse.json({
        success: true,
        url: `/uploads/${filename}`,
        filename: filename,
      });
    }

    return NextResponse.json(
      {
        error:
          "Serverless filesystem is read-only. Please set GITHUB_TOKEN in your Vercel Environment Variables to allow live image uploads, or upload locally via http://localhost:1408/admin.",
      },
      { status: 500 }
    );
  } catch (err: any) {
    console.error("Upload handler error:", err);
    return NextResponse.json(
      {
        error: err.message || "Upload failed",
        details: err.toString(),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const uploadsDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadsDir)) {
      return NextResponse.json([]);
    }

    const files = fs.readdirSync(uploadsDir).map((filename) => {
      const stat = fs.statSync(path.join(uploadsDir, filename));
      return {
        filename,
        url: `/uploads/${filename}`,
        size: stat.size,
        uploadedAt: stat.mtime.toISOString(),
      };
    });

    return NextResponse.json(files);
  } catch {
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");
    if (!filename) {
      return NextResponse.json({ error: "No filename" }, { status: 400 });
    }

    const filepath = path.join(process.cwd(), "public/uploads", filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

