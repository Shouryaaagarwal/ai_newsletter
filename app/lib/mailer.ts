// import nodemailer from "nodemailer";

// export const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_APP_PASSWORD,
//   },
// });

// export function buildEmailHTML(newsletter: string): string {
//   const sections = newsletter.split("\n\n").filter(Boolean);

//   const bodyHTML = sections
//     .map((block) => {
//       if (block.startsWith("AI Newsletter")) {
//         return `<h1 style="font-size:22px;font-weight:600;color:#1a1a1a;margin:0 0 8px;">${block}</h1>`;
//       }
//       if (block.startsWith("Sources:")) {
//         const links = block.replace("Sources:", "").trim().split("\n");
//         return `
//           <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e5e5;">
//             <p style="font-size:11px;color:#999;margin:0 0 6px;">Sources</p>
//             ${links.map((l) => `<a href="${l.trim()}" style="display:block;font-size:11px;color:#6366f1;margin:2px 0;">${l.trim()}</a>`).join("")}
//           </div>`;
//       }
//       if (block.length < 60 && !block.includes(".")) {
//         return `<h2 style="font-size:16px;font-weight:600;color:#1a1a1a;margin:24px 0 8px;">${block}</h2>`;
//       }
//       return `<p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 14px;">${block}</p>`;
//     })
//     .join("");

//   return `
// <!DOCTYPE html>
// <html>
// <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
// <body style="margin:0;padding:0;background:#f9f9f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
//   <table width="100%" cellpadding="0" cellspacing="0">
//     <tr><td align="center" style="padding:40px 16px;">
//       <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
//         <!-- Header -->
//         <tr><td style="background:#6366f1;border-radius:12px 12px 0 0;padding:24px 32px;">
//           <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.8);letter-spacing:0.05em;">NEXUS BRIEF</p>
//           <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.6);">AI · Energy · Geopolitics · India</p>
//         </td></tr>
//         <!-- Body -->
//         <tr><td style="background:#ffffff;padding:32px;border-left:1px solid #e5e5e5;border-right:1px solid #e5e5e5;">
//           ${bodyHTML}
//         </td></tr>
//         <!-- Footer -->
//         <tr><td style="background:#f3f4f6;border-radius:0 0 12px 12px;padding:20px 32px;border:1px solid #e5e5e5;border-top:none;">
//           <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
//             You're receiving this because you subscribed to Nexus Brief.<br/>
//             <a href="#" style="color:#6366f1;">Unsubscribe</a>
//           </p>
//         </td></tr>
//       </table>
//     </td></tr>
//   </table>
// </body>
// </html>`;
// }

// export async function sendNewsletter(
//   to: string[],
//   newsletter: string
// ): Promise<void> {
//   const html = buildEmailHTML(newsletter);
//   const date = new Date().toLocaleDateString("en-US", {
//     month: "long", day: "numeric", year: "numeric",
//   });

//   await transporter.sendMail({
//     from: `"${process.env.GMAIL_FROM_NAME}" <${process.env.GMAIL_USER}>`,
//     bcc: to,       // BCC keeps subscriber emails private from each other
//     subject: `Nexus Brief · ${date}`,
//     html,
//   });

//   console.log(`[Mailer] Sent to ${to.length} subscribers`);
// }   



// import nodemailer from "nodemailer";

// export const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_APP_PASSWORD,
//   },
// });

// export function buildEmailHTML(newsletter: string): string {
//   const sections = newsletter.split("\n\n").filter(Boolean);

//   const bodyHTML = sections
//     .map((block) => {
//       // Main Title
//       if (block.startsWith("AI Newsletter")) {
//         return `
//           <h1 style="font-size:26px;font-weight:700;color:#111827;margin:0 0 16px;line-height:1.3;">
//             ${block}
//           </h1>`;
//       }

//       // Sources Section
//       if (block.startsWith("Sources:")) {
//         const links = block.replace("Sources:", "").trim().split("\n");

//         return `
//         <div style="margin-top:40px;padding-top:20px;border-top:1px solid #e5e7eb;">
//           <p style="font-size:12px;color:#6b7280;margin-bottom:8px;font-weight:600;">Sources</p>
//           ${links
//             .map(
//               (l) => `
//               <a href="${l.trim()}" 
//                  style="display:block;font-size:13px;color:#4f46e5;text-decoration:none;margin:4px 0;">
//                  → ${l.trim()}
//               </a>`
//             )
//             .join("")}
//         </div>`;
//       }

//       // Section Heading
//       if (block.length < 80 && !block.includes(".")) {
//         return `
//           <h2 style="font-size:18px;font-weight:600;color:#1f2937;margin:28px 0 10px;">
//             ${block}
//           </h2>`;
//       }

//       // Highlight box (for insights)
//       if (block.startsWith("👉")) {
//         return `
//           <div style="background:#f3f4f6;padding:16px 18px;border-radius:10px;margin:16px 0;">
//             <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">
//               ${block}
//             </p>
//           </div>`;
//       }

//       // Normal paragraph
//       return `
//         <p style="font-size:15px;color:#374151;line-height:1.8;margin:0 0 16px;">
//           ${block}
//         </p>`;
//     })
//     .join("");

//   return `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="utf-8">
//   <meta name="viewport" content="width=device-width,initial-scale=1">
// </head>

// <body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">

//   <table width="100%" cellpadding="0" cellspacing="0">
//     <tr>
//       <td align="center" style="padding:40px 16px;">

//         <!-- Container -->
//         <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e7eb;">

//           <!-- Header -->
//           <tr>
//             <td style="background:#111827;padding:28px 32px;">
//               <p style="margin:0;font-size:12px;color:#9ca3af;letter-spacing:0.12em;">
//                 NEXUS BRIEF
//               </p>
//               <p style="margin:6px 0 0;font-size:14px;color:#e5e7eb;">
//                 AI · Energy · Geopolitics · India
//               </p>
//             </td>
//           </tr>

//           <!-- Divider -->
//           <tr>
//             <td style="height:1px;background:#e5e7eb;"></td>
//           </tr>

//           <!-- Body -->
//           <tr>
//             <td style="padding:32px;">
//               ${bodyHTML}
//             </td>
//           </tr>

//           <!-- Footer -->
//           <tr>
//             <td style="background:#f9fafb;padding:24px 32px;text-align:center;border-top:1px solid #e5e7eb;">
              
//               <p style="font-size:13px;color:#6b7280;margin:0 0 8px;">
//                 You're receiving this because you subscribed to Nexus Brief.
//               </p>

//               <a href="#" style="font-size:13px;color:#4f46e5;text-decoration:none;">
//                 Unsubscribe
//               </a>

//               <p style="margin-top:12px;font-size:11px;color:#9ca3af;">
//                 © ${new Date().getFullYear()} Nexus Brief
//               </p>

//             </td>
//           </tr>

//         </table>

//       </td>
//     </tr>
//   </table>

// </body>
// </html>
// `;
// }

// export async function sendNewsletter(
//   to: string[],
//   newsletter: string
// ): Promise<void> {
//   const html = buildEmailHTML(newsletter);

//   const date = new Date().toLocaleDateString("en-US", {
//     month: "long",
//     day: "numeric",
//     year: "numeric",
//   });

//   await transporter.sendMail({
//     from: `"${process.env.GMAIL_FROM_NAME}" <${process.env.GMAIL_USER}>`,
//     bcc: to,
//     subject: `Nexus Brief · ${date}`,
//     html,
//   });

//   console.log(`[Mailer] Sent to ${to.length} subscribers`);
// }   




// import nodemailer from "nodemailer";

// export const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_APP_PASSWORD,
//   },
// });

// export function buildEmailHTML(newsletter: string): string {
//   const lines = newsletter.split("\n");
//   let bodyHTML = "";
//   let i = 0;

//   while (i < lines.length) {
//     const line = lines[i].trim();

//     if (!line) {
//       i++;
//       continue;
//     }

//     // Main newsletter title
//     if (line.startsWith("AI Newsletter") || line.startsWith("Nexus Brief")) {
//       bodyHTML += `
//         <h1 style="
//           font-size: 28px;
//           font-weight: 700;
//           color: #0f172a;
//           margin: 0 0 6px;
//           line-height: 1.25;
//           letter-spacing: -0.5px;
//         ">${line}</h1>`;
//       i++;
//       continue;
//     }

//     // Date or subtitle line right after title
//     if (
//       i > 0 &&
//       line.match(/^(January|February|March|April|May|June|July|August|September|October|November|December|\d{1,2}\s)/i) ||
//       line.match(/^Issue|^Vol\.|^Edition/i)
//     ) {
//       bodyHTML += `
//         <p style="
//           font-size: 13px;
//           color: #64748b;
//           margin: 0 0 28px;
//           letter-spacing: 0.02em;
//         ">${line}</p>`;
//       i++;
//       continue;
//     }

//     // H2 Section heading — short line with no punctuation
//     if (line.length < 72 && !line.includes(".") && !line.startsWith("👉") && !line.startsWith("http") && line === line) {
//       const isHeading =
//         line === line.toUpperCase() ||
//         /^[A-Z\s\d\-&:]+$/.test(line) ||
//         (line.length < 52 && !line.startsWith("-") && /^[A-Z]/.test(line) && !line.includes(","));

//       if (isHeading && line.length < 60) {
//         bodyHTML += `
//           <table width="100%" cellpadding="0" cellspacing="0" style="margin: 32px 0 14px;">
//             <tr>
//               <td style="
//                 padding-bottom: 10px;
//                 border-bottom: 2px solid #e2e8f0;
//               ">
//                 <span style="
//                   font-size: 11px;
//                   font-weight: 700;
//                   color: #6366f1;
//                   text-transform: uppercase;
//                   letter-spacing: 0.1em;
//                 ">${line}</span>
//               </td>
//             </tr>
//           </table>`;
//         i++;
//         continue;
//       }
//     }

//     // Callout / insight block
//     if (line.startsWith("👉") || line.startsWith("•") || line.startsWith("→")) {
//       bodyHTML += `
//         <table width="100%" cellpadding="0" cellspacing="0" style="margin: 14px 0;">
//           <tr>
//             <td style="
//               width: 3px;
//               background: #6366f1;
//               border-radius: 3px;
//             "></td>
//             <td style="width: 14px;"></td>
//             <td style="
//               padding: 14px 16px;
//               background: #f8f7ff;
//               border-radius: 0 8px 8px 0;
//             ">
//               <p style="
//                 margin: 0;
//                 font-size: 14px;
//                 color: #1e1b4b;
//                 line-height: 1.7;
//               ">${line}</p>
//             </td>
//           </tr>
//         </table>`;
//       i++;
//       continue;
//     }

//     // Sources block
//     if (line.startsWith("Sources:") || line.startsWith("Source:")) {
//       const sourceLinks: string[] = [];
//       i++;
//       while (i < lines.length && lines[i].trim() !== "") {
//         const src = lines[i].trim();
//         if (src) sourceLinks.push(src);
//         i++;
//       }

//       bodyHTML += `
//         <table width="100%" cellpadding="0" cellspacing="0" style="
//           margin-top: 36px;
//           border-top: 1px solid #e2e8f0;
//         ">
//           <tr>
//             <td style="padding-top: 20px;">
//               <p style="
//                 font-size: 11px;
//                 font-weight: 700;
//                 text-transform: uppercase;
//                 letter-spacing: 0.1em;
//                 color: #94a3b8;
//                 margin: 0 0 10px;
//               ">Sources</p>
//               ${sourceLinks
//                 .map(
//                   (url) => `
//                 <a href="${url}" style="
//                   display: block;
//                   font-size: 12.5px;
//                   color: #6366f1;
//                   text-decoration: none;
//                   margin: 5px 0;
//                   word-break: break-all;
//                 ">${url}</a>`
//                 )
//                 .join("")}
//             </td>
//           </tr>
//         </table>`;
//       continue;
//     }

//     // Normal paragraph
//     bodyHTML += `
//       <p style="
//         font-size: 15px;
//         color: #334155;
//         line-height: 1.85;
//         margin: 0 0 18px;
//       ">${line}</p>`;
//     i++;
//   }

//   const year = new Date().getFullYear();

//   return `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="utf-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <meta http-equiv="X-UA-Compatible" content="IE=edge">
//   <title>Nexus Brief</title>
// </head>
// <body style="
//   margin: 0;
//   padding: 0;
//   background-color: #f1f5f9;
//   font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
//   -webkit-font-smoothing: antialiased;
// ">

//   <!-- Preheader (hidden preview text) -->
//   <div style="
//     display: none;
//     max-height: 0;
//     overflow: hidden;
//     mso-hide: all;
//     font-size: 1px;
//     line-height: 1px;
//     color: #f1f5f9;
//   ">
//     Your weekly intelligence briefing on AI, Energy, Geopolitics &amp; India.&nbsp;
//     &#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;&#847;&nbsp;
//   </div>

//   <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
//     <tr>
//       <td align="center" style="padding: 40px 16px 48px;">

//         <!-- Outer wrapper: max 620px -->
//         <table width="620" cellpadding="0" cellspacing="0" role="presentation"
//           style="max-width: 620px; width: 100%;">

//           <!-- ── TOP LABEL ─────────────────────────────── -->
//           <tr>
//             <td style="padding-bottom: 14px; text-align: center;">
//               <span style="
//                 font-size: 11px;
//                 font-weight: 700;
//                 color: #94a3b8;
//                 letter-spacing: 0.12em;
//                 text-transform: uppercase;
//               ">Nexus Brief · Intelligence for a Complex World</span>
//             </td>
//           </tr>

//           <!-- ── CARD ──────────────────────────────────── -->
//           <tr>
//             <td style="
//               background: #ffffff;
//               border-radius: 16px;
//               overflow: hidden;
//               border: 1px solid #e2e8f0;
//             ">

//               <!-- Header band -->
//               <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
//                 <tr>
//                   <td style="
//                     background: #0f172a;
//                     padding: 26px 36px 22px;
//                   ">
//                     <!-- Logo row -->
//                     <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
//                       <tr>
//                         <td>
//                           <table cellpadding="0" cellspacing="0" role="presentation">
//                             <tr>
//                               <!-- Monogram badge -->
//                               <td style="
//                                 width: 36px;
//                                 height: 36px;
//                                 background: #6366f1;
//                                 border-radius: 8px;
//                                 text-align: center;
//                                 vertical-align: middle;
//                               ">
//                                 <span style="
//                                   font-size: 15px;
//                                   font-weight: 700;
//                                   color: #ffffff;
//                                   line-height: 36px;
//                                 ">N</span>
//                               </td>
//                               <td style="width: 12px;"></td>
//                               <td style="vertical-align: middle;">
//                                 <span style="
//                                   font-size: 18px;
//                                   font-weight: 700;
//                                   color: #ffffff;
//                                   letter-spacing: -0.3px;
//                                 ">NEXUS BRIEF</span>
//                               </td>
//                             </tr>
//                           </table>
//                         </td>
//                         <td style="text-align: right; vertical-align: middle;">
//                           <span style="
//                             font-size: 12px;
//                             color: #94a3b8;
//                           ">nexusbrief.co</span>
//                         </td>
//                       </tr>
//                     </table>

//                     <!-- Divider -->
//                     <div style="
//                       height: 1px;
//                       background: rgba(255,255,255,0.08);
//                       margin: 18px 0 16px;
//                     "></div>

//                     <!-- Tag pills -->
//                     <table cellpadding="0" cellspacing="0" role="presentation">
//                       <tr>
//                         ${["AI", "Energy", "Geopolitics", "India"]
//                           .map(
//                             (tag) => `
//                           <td style="padding-right: 6px;">
//                             <span style="
//                               display: inline-block;
//                               padding: 3px 10px;
//                               background: rgba(255,255,255,0.08);
//                               border: 1px solid rgba(255,255,255,0.12);
//                               border-radius: 100px;
//                               font-size: 11px;
//                               color: #cbd5e1;
//                               letter-spacing: 0.04em;
//                             ">${tag}</span>
//                           </td>`
//                           )
//                           .join("")}
//                       </tr>
//                     </table>
//                   </td>
//                 </tr>
//               </table>

//               <!-- ── BODY ─────────────────────────────── -->
//               <tr>
//                 <td style="padding: 36px 36px 28px;">
//                   ${bodyHTML}
//                 </td>
//               </tr>

//               <!-- ── DIVIDER ──────────────────────────── -->
//               <tr>
//                 <td style="
//                   height: 1px;
//                   background: #e2e8f0;
//                   margin: 0 36px;
//                 "></td>
//               </tr>

//               <!-- ── FOOTER ──────────────────────────── -->
//               <tr>
//                 <td style="
//                   background: #f8fafc;
//                   padding: 24px 36px;
//                   border-radius: 0 0 16px 16px;
//                 ">
//                   <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
//                     <tr>
//                       <td>
//                         <p style="
//                           font-size: 12.5px;
//                           color: #94a3b8;
//                           margin: 0 0 8px;
//                           line-height: 1.6;
//                         ">
//                           You're receiving this because you subscribed to Nexus Brief.
//                           No spam, ever.
//                         </p>
//                         <table cellpadding="0" cellspacing="0" role="presentation">
//                           <tr>
//                             <td style="padding-right: 16px;">
//                               <a href="#" style="
//                                 font-size: 12.5px;
//                                 color: #6366f1;
//                                 text-decoration: none;
//                               ">Unsubscribe</a>
//                             </td>
//                             <td style="
//                               width: 1px;
//                               background: #e2e8f0;
//                             "></td>
//                             <td style="padding-left: 16px;">
//                               <a href="#" style="
//                                 font-size: 12.5px;
//                                 color: #6366f1;
//                                 text-decoration: none;
//                               ">Manage preferences</a>
//                             </td>
//                           </tr>
//                         </table>
//                       </td>
//                       <td style="text-align: right; vertical-align: top;">
//                         <span style="
//                           font-size: 11px;
//                           color: #cbd5e1;
//                         ">© ${year} Nexus Brief</span>
//                       </td>
//                     </tr>
//                   </table>
//                 </td>
//               </tr>

//             </td>
//           </tr>

//           <!-- ── BELOW CARD LEGAL ──────────────────────── -->
//           <tr>
//             <td style="padding-top: 20px; text-align: center;">
//               <p style="
//                 font-size: 11.5px;
//                 color: #94a3b8;
//                 margin: 0;
//                 line-height: 1.7;
//               ">
//                 Nexus Brief · New Delhi, India<br>
//                 This email was sent to you because you opted in at nexusbrief.co
//               </p>
//             </td>
//           </tr>

//         </table>
//       </td>
//     </tr>
//   </table>

// </body>
// </html>`;
// }

// export async function sendNewsletter(
//   to: string[],
//   newsletter: string
// ): Promise<void> {
//   const html = buildEmailHTML(newsletter);

//   const date = new Date().toLocaleDateString("en-US", {
//     month: "long",
//     day: "numeric",
//     year: "numeric",
//   });

//   await transporter.sendMail({
//     from: `"${process.env.GMAIL_FROM_NAME}" <${process.env.GMAIL_USER}>`,
//     bcc: to,
//     subject: `Nexus Brief · ${date}`,
//     html,
//   });

//   console.log(`[Mailer] Sent to ${to.length} subscribers`);
// }   



import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Send ingest success notification to admin
export async function sendIngestNotification(
  totalChunks: number,
  perSource: Record<string, number | string>
): Promise<void> {
  const date = new Date().toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  const sourceRows = Object.entries(perSource)
    .map(([url, count]) => {
      const isError = typeof count === "string" && count.startsWith("ERROR");
      const color = isError ? "#ef4444" : "#10b981";
      const label = isError ? count : `${count} chunks`;
      return `<tr>
        <td style="padding:6px 0;font-size:12px;color:#374151;border-bottom:1px solid #f3f4f6;">${url}</td>
        <td style="padding:6px 0;font-size:12px;color:${color};text-align:right;border-bottom:1px solid #f3f4f6;">${label}</td>
      </tr>`;
    })
    .join("");

  await transporter.sendMail({
    from: `"Nexus Brief System" <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER, // notify yourself
    subject: `✅ Nexus Brief — Data Ingested · ${date}`,
    html: `
<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,sans-serif;background:#f9f9f9;padding:40px 16px;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e5e5;overflow:hidden;">
    <div style="background:#6366f1;padding:20px 28px;">
      <p style="margin:0;color:#fff;font-weight:600;font-size:15px;">Nexus Brief · Ingest Report</p>
      <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:12px;">${date}</p>
    </div>
    <div style="padding:28px;">
      <p style="font-size:28px;font-weight:700;color:#1a1a1a;margin:0 0 4px;">${totalChunks}</p>
      <p style="font-size:13px;color:#6b7280;margin:0 0 24px;">Total chunks ingested</p>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="text-align:left;font-size:11px;color:#9ca3af;padding-bottom:8px;">Source</th>
            <th style="text-align:right;font-size:11px;color:#9ca3af;padding-bottom:8px;">Result</th>
          </tr>
        </thead>
        <tbody>${sourceRows}</tbody>
      </table>
      <div style="margin-top:24px;padding:14px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
        <p style="margin:0;font-size:13px;color:#15803d;">
          ✓ Newsletter will be generated and sent to subscribers shortly.
        </p>
      </div>
    </div>
  </div>
</body>
</html>`,
  });

  console.log(`[Mailer] Ingest notification sent to admin`);
}

// Build HTML email from newsletter text
export function buildEmailHTML(newsletter: string): string {
  const sections = newsletter.split("\n\n").filter(Boolean);

  const bodyHTML = sections
    .map((block) => {
      if (block.startsWith("AI Newsletter")) {
        return `<h1 style="font-size:22px;font-weight:600;color:#1a1a1a;margin:0 0 8px;">${block}</h1>`;
      }
      if (block.startsWith("Sources:")) {
        const links = block.replace("Sources:", "").trim().split("\n");
        return `
          <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e5e5;">
            <p style="font-size:11px;color:#999;margin:0 0 6px;">Sources</p>
            ${links.map((l) => `<a href="${l.trim()}" style="display:block;font-size:11px;color:#6366f1;margin:2px 0;">${l.trim()}</a>`).join("")}
          </div>`;
      }
      if (block.length < 60 && !block.includes(".")) {
        return `<h2 style="font-size:16px;font-weight:600;color:#1a1a1a;margin:24px 0 8px;">${block}</h2>`;
      }
      return `<p style="font-size:15px;color:#374151;line-height:1.7;margin:0 0 14px;">${block}</p>`;
    })
    .join("");

  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr><td style="background:#6366f1;border-radius:12px 12px 0 0;padding:24px 32px;">
          <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.8);letter-spacing:0.05em;">NEXUS BRIEF</p>
          <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.6);">AI · Energy · Geopolitics · India</p>
        </td></tr>
        <tr><td style="background:#ffffff;padding:32px;border-left:1px solid #e5e5e5;border-right:1px solid #e5e5e5;">
          ${bodyHTML}
        </td></tr>
        <tr><td style="background:#f3f4f6;border-radius:0 0 12px 12px;padding:20px 32px;border:1px solid #e5e5e5;border-top:none;">
          <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
            You are receiving this because you subscribed to Nexus Brief.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// Send newsletter to list of emails
export async function sendNewsletter(
  to: string[],
  newsletter: string
): Promise<void> {
  const html = buildEmailHTML(newsletter);
  const date = new Date().toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  await transporter.sendMail({
    from: `"${process.env.GMAIL_FROM_NAME}" <${process.env.GMAIL_USER}>`,
    bcc: to,
    subject: `Nexus Brief · ${date}`,
    html,
  });

  console.log(`[Mailer] Newsletter sent to ${to.length} subscribers`);
}