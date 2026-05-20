import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 256, height: 256 };
export const contentType = "image/png";

export default function Icon() {
  const logoBuffer = readFileSync(join(process.cwd(), "src", "Logo.png"));
  const base64 = logoBuffer.toString("base64");
  const dataUrl = `data:image/png;base64,${base64}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 256,
          height: 256,
          background: "#000000",
          borderRadius: "50%",       /* perfect circle */
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dataUrl}
          width={230}
          height={230}
          style={{ objectFit: "contain" }}
          alt="logo"
        />
      </div>
    ),
    { width: 256, height: 256 }
  );
}
