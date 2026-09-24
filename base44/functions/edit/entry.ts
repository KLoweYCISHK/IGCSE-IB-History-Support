// Password-protected editing.
// The edit password lives in the app secret EDIT_PASSWORD (Base44 dashboard →
// app settings → environment variables), never in the code. Anyone who sends
// the right password can change site content; everyone else is read-only.
import { createClientFromRequest } from "npm:@base44/sdk@0.8.50";
import { secrets } from "base44:runtime";

const ENTITIES = new Set([
  "ContentBlock", "Document", "ExamItem", "IgcseFocusUnit", "IgcseMarkSchemeTemplate",
  "IgcsePaper2Focus", "IgcsePaper2Link", "PageMeta", "PageSection", "Perspective",
  "Resource", "RoadmapStep", "SiteSettings", "Textbook",
]);
const METHODS = new Set([
  "create", "update", "delete", "bulkCreate", "bulkUpdate", "updateMany", "deleteMany",
]);

async function passwordOk(given: unknown): Promise<boolean> {
  const expected = secrets.get("EDIT_PASSWORD");
  if (!expected || typeof given !== "string" || !given) return false;
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(given)),
    crypto.subtle.digest("SHA-256", enc.encode(expected)),
  ]);
  const x = new Uint8Array(a), y = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const isForm = (req.headers.get("content-type") || "").includes("multipart/form-data");

    if (isForm) {
      // File upload: fields "password" and "file"
      const form = await req.formData();
      if (!(await passwordOk(form.get("password")))) {
        await new Promise((r) => setTimeout(r, 800));
        return Response.json({ error: "Incorrect password" }, { status: 403 });
      }
      const file = form.get("file");
      if (!(file instanceof File)) return Response.json({ error: "No file" }, { status: 400 });
      const result = await base44.asServiceRole.integrations.Core.UploadFile({ file });
      return Response.json(result);
    }

    const { password, action, entity, method, args } = await req.json();
    if (!(await passwordOk(password))) {
      await new Promise((r) => setTimeout(r, 800));
      return Response.json({ error: "Incorrect password" }, { status: 403 });
    }
    if (action === "check") return Response.json({ ok: true });

    if (!ENTITIES.has(entity) || !METHODS.has(method) || !Array.isArray(args)) {
      return Response.json({ error: "Not allowed" }, { status: 400 });
    }
    const result = await (base44.asServiceRole.entities as any)[entity][method](...args);
    return Response.json({ result: result ?? null });
  } catch (error) {
    return Response.json({ error: (error as Error).message || "Edit failed" }, { status: 500 });
  }
}
