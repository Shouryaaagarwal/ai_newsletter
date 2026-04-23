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



// import nodemailer from "nodemailer";

// export const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_APP_PASSWORD,
//   },
// });

// // Send ingest success notification to admin
// export async function sendIngestNotification(
//   totalChunks: number,
//   perSource: Record<string, number | string>
// ): Promise<void> {
//   const date = new Date().toLocaleDateString("en-US", {
//     month: "long", day: "numeric", year: "numeric",
//   });

//   const sourceRows = Object.entries(perSource)
//     .map(([url, count]) => {
//       const isError = typeof count === "string" && count.startsWith("ERROR");
//       const color = isError ? "#ef4444" : "#10b981";
//       const label = isError ? count : `${count} chunks`;
//       return `<tr>
//         <td style="padding:6px 0;font-size:12px;color:#374151;border-bottom:1px solid #f3f4f6;">${url}</td>
//         <td style="padding:6px 0;font-size:12px;color:${color};text-align:right;border-bottom:1px solid #f3f4f6;">${label}</td>
//       </tr>`;
//     })
//     .join("");

//   await transporter.sendMail({
//     from: `"Nexus Brief System" <${process.env.GMAIL_USER}>`,
//     to: process.env.GMAIL_USER, // notify yourself
//     subject: `✅ Nexus Brief — Data Ingested · ${date}`,
//     html: `
// <!DOCTYPE html>
// <html>
// <body style="font-family:-apple-system,sans-serif;background:#f9f9f9;padding:40px 16px;">
//   <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;border:1px solid #e5e5e5;overflow:hidden;">
//     <div style="background:#6366f1;padding:20px 28px;">
//       <p style="margin:0;color:#fff;font-weight:600;font-size:15px;">Nexus Brief · Ingest Report</p>
//       <p style="margin:4px 0 0;color:rgba(255,255,255,0.7);font-size:12px;">${date}</p>
//     </div>
//     <div style="padding:28px;">
//       <p style="font-size:28px;font-weight:700;color:#1a1a1a;margin:0 0 4px;">${totalChunks}</p>
//       <p style="font-size:13px;color:#6b7280;margin:0 0 24px;">Total chunks ingested</p>
//       <table style="width:100%;border-collapse:collapse;">
//         <thead>
//           <tr>
//             <th style="text-align:left;font-size:11px;color:#9ca3af;padding-bottom:8px;">Source</th>
//             <th style="text-align:right;font-size:11px;color:#9ca3af;padding-bottom:8px;">Result</th>
//           </tr>
//         </thead>
//         <tbody>${sourceRows}</tbody>
//       </table>
//       <div style="margin-top:24px;padding:14px;background:#f0fdf4;border-radius:8px;border:1px solid #bbf7d0;">
//         <p style="margin:0;font-size:13px;color:#15803d;">
//           ✓ Newsletter will be generated and sent to subscribers shortly.
//         </p>
//       </div>
//     </div>
//   </div>
// </body>
// </html>`,
//   });

//   console.log(`[Mailer] Ingest notification sent to admin`);
// }

// // Build HTML email from newsletter text
// export function buildEmailHTML(newsletter: string): string {
//   const sections = newsletter.split("\n\n").filter(Boolean);

//   const bodyHTML = sections
//     .map((block) => {

//       // 🔥 Detect **Heading**
//       const match = block.match(/^\*\*(.*?)\*\*\s*(.*)/s);

//       if (match) {
//         const title = match[1];
//         let content = match[2];

//         // 🔥 Highlight numbers like 38–42%
//         content = content.replace(
//           /(\d+–?\d*%?)/g,
//           `<strong style="color:#6366f1;">$1</strong>`
//         );

//         return `
//         <div style="
//           margin-bottom:28px;
//           padding:20px;
//           border:1px solid #e5e7eb;
//           border-radius:12px;
//           background:#fafafa;
//         ">
//           <h2 style="
//             font-size:18px;
//             font-weight:600;
//             color:#111827;
//             margin:0 0 10px;
//           ">
//             ${title}
//           </h2>

//           <p style="
//             font-size:15px;
//             color:#374151;
//             line-height:1.7;
//             margin:0;
//           ">
//             ${content}
//           </p>
//         </div>
//         `;
//       }

//       // 🔹 Title line
//       if (block.startsWith("AI Newsletter")) {
//         return `
//           <h1 style="
//             font-size:22px;
//             font-weight:700;
//             color:#111827;
//             margin:0 0 20px;
//           ">
//             ${block}
//           </h1>
//         `;
//       }

//       // 🔹 Default paragraph
//       return `
//         <p style="
//           font-size:15px;
//           color:#374151;
//           line-height:1.7;
//           margin-bottom:14px;
//         ">
//           ${block}
//         </p>
//       `;
//     })
//     .join("");

//   return `
// <!DOCTYPE html>
// <html>
// <body style="
//   margin:0;
//   padding:0;
//   background:#f3f4f6;
//   font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
// ">

// <table width="100%">
// <tr>
// <td align="center" style="padding:40px 16px;">

// <table width="600" style="
//   background:#ffffff;
//   border-radius:14px;
//   overflow:hidden;
// ">

// <!-- HEADER -->
// <tr>
// <td style="background:#6366f1;padding:28px;">
//   <h1 style="margin:0;font-size:22px;color:#ffffff;">
//     Nexus Brief
//   </h1>
//   <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">
//     AI · Energy · Geopolitics · India
//   </p>
// </td>
// </tr>

// <!-- BODY -->
// <tr>
// <td style="padding:28px;">
//   ${bodyHTML}
// </td>
// </tr>

// <!-- FOOTER -->
// <tr>
// <td style="
//   padding:20px;
//   text-align:center;
//   font-size:12px;
//   color:#9ca3af;
//   border-top:1px solid #e5e7eb;
// ">
//   You are receiving this because you subscribed to Nexus Brief.
// </td>
// </tr>

// </table>

// </td>
// </tr>
// </table>

// </body>
// </html>
// `;
// }

// // Send newsletter to list of emails
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
//     bcc: to,
//     subject: `Nexus Brief · ${date}`,
//     html,
//   });

//   console.log(`[Mailer] Newsletter sent to ${to.length} subscribers`);
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
    to: process.env.GMAIL_USER,
    subject: `✅ Nexus Brief — Data Ingested · ${date}`,
    html: `...`, // unchanged
  });

  console.log(`[Mailer] Ingest notification sent to admin`);
}

// // 🔥 UPDATED: now accepts readTime
// export function buildEmailHTML(
//   newsletter: string,
//   readTime: number
// ): string {
//   const sections = newsletter.split("\n\n").filter(Boolean);

//   const bodyHTML = sections
//     .map((block) => {
//       const match = block.match(/^\*\*(.*?)\*\*\s*(.*)/s);

//       if (match) {
//         const title = match[1];
//         let content = match[2];

//         content = content.replace(
//           /(\d+–?\d*%?)/g,
//           `<strong style="color:#6366f1;">$1</strong>`
//         );

//         return `
//         <div style="
//           margin-bottom:28px;
//           padding:20px;
//           border:1px solid #e5e7eb;
//           border-radius:12px;
//           background:#fafafa;
//         ">
//           <h2 style="
//             font-size:18px;
//             font-weight:600;
//             color:#111827;
//             margin:0 0 10px;
//           ">
//             ${title}
//           </h2>

//           <p style="
//             font-size:15px;
//             color:#374151;
//             line-height:1.7;
//             margin:0;
//           ">
//             ${content}
//           </p>
//         </div>
//         `;
//       }

//       if (block.startsWith("AI Newsletter")) {
//         return `
//           <h1 style="
//             font-size:22px;
//             font-weight:700;
//             color:#111827;
//             margin:0 0 10px;
//           ">
//             ${block}
//           </h1>

//           <!-- 🔥 READ TIME ADDED HERE -->
//           <p style="
//             font-size:12px;
//             color:#6b7280;
//             margin-bottom:20px;
//           ">
//             🕒 ${readTime} min read
//           </p>
//         `;
//       }

//       return `
//         <p style="
//           font-size:15px;
//           color:#374151;
//           line-height:1.7;
//           margin-bottom:14px;
//         ">
//           ${block}
//         </p>
//       `;
//     })
//     .join("");

//   return `
// <!DOCTYPE html>
// <html>
// <body style="
//   margin:0;
//   padding:0;
//   background:#f3f4f6;
//   font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
// ">

// <table width="100%">
// <tr>
// <td align="center" style="padding:40px 16px;">

// <table width="600" style="
//   background:#ffffff;
//   border-radius:14px;
//   overflow:hidden;
// ">

// <tr>
// <td style="background:#6366f1;padding:28px;">
//   <h1 style="margin:0;font-size:22px;color:#ffffff;">
//     Nexus Brief
//   </h1>
//   <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">
//     AI · Energy · Geopolitics · India
//   </p>
// </td>
// </tr>

// <tr>
// <td style="padding:28px;">
//   ${bodyHTML}
// </td>
// </tr>

// <tr>
// <td style="
//   padding:20px;
//   text-align:center;
//   font-size:12px;
//   color:#9ca3af;
//   border-top:1px solid #e5e7eb;
// ">
//   You are receiving this because you subscribed to Nexus Brief.
// </td>
// </tr>

// </table>

// </td>
// </tr>
// </table>

// </body>
// </html>
// `;
// }

// // 🔥 UPDATED: now accepts readTime
// export async function sendNewsletter(
//   to: string[],
//   newsletter: string,
//   readTime: number
// ): Promise<void> {
//   const html = buildEmailHTML(newsletter, readTime);

//   const date = new Date().toLocaleDateString("en-US", {
//     month: "long", day: "numeric", year: "numeric",
//   });

//   await transporter.sendMail({
//     from: `"${process.env.GMAIL_FROM_NAME}" <${process.env.GMAIL_USER}>`,
//     bcc: to,
//     subject: `Nexus Brief · ${date}`,
//     html,
//   });

//   console.log(`[Mailer] Newsletter sent to ${to.length} subscribers`);
// }     

export function buildEmailHTML(
  newsletter: string,
  readTime: number
): string {
  const date = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const sections = newsletter.split("\n\n").filter(Boolean);

  let issueNumber = "";
  let issueDate = date;
  let bodyBlocks: string[] = [];

  sections.forEach((block) => {
    if (block.startsWith("AI Newsletter") || block.startsWith("Meridian")) {
      // skip — we render our own header
    } else {
      bodyBlocks.push(block);
    }
  });

  // ── Render each content block ──────────────────────────────────────────────
  const renderBlock = (block: string, idx: number): string => {
    const sectionMatch = block.match(/^\*\*(.*?)\*\*\s*([\s\S]*)/);

    if (sectionMatch) {
      const title = sectionMatch[1];
      let content = sectionMatch[2].trim();

      // Highlight numbers / percentages
      content = content.replace(
        /(\b\d[\d,]*(?:\.\d+)?(?:[%x]|\s?(?:bn|mn|trillion|billion|million))?\b)/g,
        `<span style="color:#c084fc;font-weight:300;">$1</span>`
      );

      const tagLabels: Record<number, string> = {
        0: "01",
        1: "02",
        2: "03",
        3: "04",
        4: "05",
        5: "06",
      };
      const tag = tagLabels[idx % 6] ?? String(idx + 1).padStart(2, "0");

      return `
      <!-- Section Block -->
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
        style="margin-bottom:16px;">
        <tr>
          <td style="
            background:rgba(168,85,247,0.05);
            border:1px solid rgba(168,85,247,0.14);
            border-radius:8px;
            padding:22px 24px;
          ">
            <!-- Tag row -->
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
              style="margin-bottom:12px;">
              <tr>
                <td>
                  <span style="
                    font-family:'Libre Franklin',Arial,sans-serif;
                    font-size:9px;
                    font-weight:300;
                    letter-spacing:0.2em;
                    text-transform:uppercase;
                    color:rgba(168,85,247,0.55);
                  ">${tag}</span>
                </td>
              </tr>
            </table>
            <!-- Title -->
            <p style="
              font-family:'Libre Franklin',Arial,sans-serif;
              font-size:15px;
              font-weight:300;
              color:rgba(255,255,255,0.88);
              line-height:22px;
              margin:0 0 10px 0;
              padding:0;
            ">${title}</p>
            <!-- Divider -->
            <div style="height:1px;background:rgba(168,85,247,0.1);margin-bottom:12px;"></div>
            <!-- Body -->
            <p style="
              font-family:'Libre Franklin',Arial,sans-serif;
              font-size:13px;
              font-weight:300;
              color:rgba(255,255,255,0.52);
              line-height:22px;
              margin:0;
              padding:0;
            ">${content}</p>
          </td>
        </tr>
      </table>`;
    }

    // Plain paragraph
    return `
    <p style="
      font-family:'Libre Franklin',Arial,sans-serif;
      font-size:13px;
      font-weight:300;
      color:rgba(255,255,255,0.45);
      line-height:22px;
      margin:0 0 14px 0;
      padding:0;
    ">${block}</p>`;
  };

  const bodyHTML = bodyBlocks.map(renderBlock).join("");

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <meta name="color-scheme" content="dark"/>
  <meta name="supported-color-schemes" content="dark"/>
  <title>Meridian · ${date}</title>
  <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,200;0,300;0,400;1,200;1,300&display=swap" rel="stylesheet"/>
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,200;0,300;0,400;1,200;1,300&display=swap');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
    a { color: #a855f7; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .hero-pad { padding: 36px 20px 28px !important; }
      .body-pad { padding: 28px 20px !important; }
      .footer-pad { padding: 20px 20px !important; }
      .headline { font-size: 24px !important; line-height: 30px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#09080f;font-family:'Libre Franklin',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

<!-- Preheader -->
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#09080f;mso-hide:all;">
  Your Meridian briefing for ${date} — AI, energy, geopolitics, and more.&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌
</div>

<!-- Wrapper -->
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
  style="background-color:#09080f;min-height:100vh;">
  <tr>
    <td align="center" valign="top" style="padding:32px 16px;">

      <!-- Email container -->
      <table class="email-container" role="presentation" border="0" cellpadding="0" cellspacing="0"
        width="560" style="max-width:560px;width:100%;">

        <!-- ── HERO / MASTHEAD ── -->
        <tr>
          <td style="border-radius:10px 10px 0 0;overflow:hidden;">
            <div style="
              background: linear-gradient(145deg, #140b24 0%, #0f0a1c 40%, #0c0818 100%);
              border: 1px solid rgba(168,85,247,0.15);
              border-radius: 10px 10px 0 0;
            ">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td class="hero-pad" style="padding:44px 44px 36px;">

                    <!-- Logo row -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <!-- Brand mark -->
                        <td valign="middle">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="
                                width:22px; height:22px;
                                border:1px solid rgba(168,85,247,0.45);
                                border-radius:3px;
                                text-align:center;
                                vertical-align:middle;
                              ">
                                <span style="
                                  display:inline-block;
                                  font-size:11px;
                                  line-height:20px;
                                  color:#a855f7;
                                  font-weight:200;
                                ">◎</span>
                              </td>
                              <td style="padding-left:10px;">
                                <span style="
                                  font-family:'Libre Franklin',Arial,sans-serif;
                                  font-size:11px;
                                  font-weight:200;
                                  letter-spacing:0.28em;
                                  text-transform:uppercase;
                                  color:rgba(255,255,255,0.7);
                                ">Meridian</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <!-- Date + read time pill -->
                        <td align="right" valign="middle">
                          <span style="
                            font-family:'Libre Franklin',Arial,sans-serif;
                            font-size:9px;
                            font-weight:300;
                            letter-spacing:0.14em;
                            color:rgba(168,85,247,0.55);
                            text-transform:uppercase;
                          ">${date}&nbsp;&nbsp;·&nbsp;&nbsp;${readTime} min read</span>
                        </td>
                      </tr>
                    </table>

                    <!-- Spacer -->
                    <div style="height:28px;">&nbsp;</div>

                    <!-- Headline -->
                    <h1 class="headline" style="
                      font-family:'Libre Franklin',Arial,sans-serif;
                      font-size:32px;
                      font-weight:200;
                      line-height:40px;
                      letter-spacing:-0.01em;
                      color:#ffffff;
                      margin:0 0 14px 0;
                      padding:0;
                      mso-line-height-rule:exactly;
                    ">
                      Today's briefing.<br/>
                      <span style="font-style:italic;font-weight:200;color:#c084fc;">
                        Signal over noise.
                      </span>
                    </h1>

                    <!-- Sub-headline -->
                    <p style="
                      font-family:'Libre Franklin',Arial,sans-serif;
                      font-size:13px;
                      font-weight:300;
                      line-height:22px;
                      color:rgba(255,255,255,0.32);
                      margin:0;
                      padding:0;
                      max-width:360px;
                    ">
                      AI, energy, geopolitics, and emerging trends —
                      distilled and delivered.
                    </p>

                    <!-- Divider -->
                    <div style="height:1px;background:rgba(168,85,247,0.12);margin-top:32px;">&nbsp;</div>

                    <!-- Coverage tags -->
                    <div style="height:20px;">&nbsp;</div>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right:8px;">
                          <span style="
                            display:inline-block;
                            font-family:'Libre Franklin',Arial,sans-serif;
                            font-size:9px;
                            font-weight:300;
                            letter-spacing:0.16em;
                            text-transform:uppercase;
                            color:rgba(168,85,247,0.6);
                            border:1px solid rgba(168,85,247,0.18);
                            border-radius:4px;
                            padding:4px 10px;
                          ">AI &amp; Tech</span>
                        </td>
                        <td style="padding-right:8px;">
                          <span style="
                            display:inline-block;
                            font-family:'Libre Franklin',Arial,sans-serif;
                            font-size:9px;
                            font-weight:300;
                            letter-spacing:0.16em;
                            text-transform:uppercase;
                            color:rgba(168,85,247,0.6);
                            border:1px solid rgba(168,85,247,0.18);
                            border-radius:4px;
                            padding:4px 10px;
                          ">Energy</span>
                        </td>
                        <td style="padding-right:8px;">
                          <span style="
                            display:inline-block;
                            font-family:'Libre Franklin',Arial,sans-serif;
                            font-size:9px;
                            font-weight:300;
                            letter-spacing:0.16em;
                            text-transform:uppercase;
                            color:rgba(168,85,247,0.6);
                            border:1px solid rgba(168,85,247,0.18);
                            border-radius:4px;
                            padding:4px 10px;
                          ">Geopolitics</span>
                        </td>
                        <td>
                          <span style="
                            display:inline-block;
                            font-family:'Libre Franklin',Arial,sans-serif;
                            font-size:9px;
                            font-weight:300;
                            letter-spacing:0.16em;
                            text-transform:uppercase;
                            color:rgba(168,85,247,0.6);
                            border:1px solid rgba(168,85,247,0.18);
                            border-radius:4px;
                            padding:4px 10px;
                          ">India</span>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </div>
          </td>
        </tr>

        <!-- ── BODY ── -->
        <tr>
          <td style="
            background:#0e0c19;
            border-left:1px solid rgba(168,85,247,0.1);
            border-right:1px solid rgba(168,85,247,0.1);
          ">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td class="body-pad" style="padding:36px 44px;">

                  <!-- Section label -->
                  <p style="
                    font-family:'Libre Franklin',Arial,sans-serif;
                    font-size:9px;
                    font-weight:300;
                    letter-spacing:0.2em;
                    text-transform:uppercase;
                    color:rgba(168,85,247,0.55);
                    margin:0 0 20px 0;
                    padding:0;
                  ">Today's Intelligence</p>

                  <!-- Dynamic content blocks -->
                  ${bodyHTML}

                  <!-- Closing divider -->
                  <div style="height:1px;background:rgba(255,255,255,0.05);margin-top:32px;margin-bottom:32px;">&nbsp;</div>

                  <!-- Quote / tagline -->
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="
                        border-left:2px solid rgba(168,85,247,0.4);
                        padding-left:18px;
                      ">
                        <p style="
                          font-family:'Libre Franklin',Arial,sans-serif;
                          font-size:14px;
                          font-weight:200;
                          font-style:italic;
                          color:rgba(255,255,255,0.4);
                          line-height:22px;
                          margin:0;
                        ">
                          &ldquo;The world, clearly rendered.&rdquo;
                        </p>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── FOOTER ── -->
        <tr>
          <td style="
            background:#0b0915;
            border:1px solid rgba(168,85,247,0.08);
            border-top:1px solid rgba(168,85,247,0.12);
            border-radius:0 0 10px 10px;
          ">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td class="footer-pad" style="padding:28px 44px 32px;">

                  <!-- Footer brand -->
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <span style="
                          font-family:'Libre Franklin',Arial,sans-serif;
                          font-size:9px;
                          font-weight:200;
                          letter-spacing:0.26em;
                          text-transform:uppercase;
                          color:rgba(255,255,255,0.22);
                        ">Meridian</span>
                      </td>
                      <td style="padding:0 10px;">
                        <span style="color:rgba(168,85,247,0.25);font-size:9px;">·</span>
                      </td>
                      <td>
                        <span style="
                          font-family:'Libre Franklin',Arial,sans-serif;
                          font-size:9px;
                          font-weight:300;
                          color:rgba(255,255,255,0.14);
                        ">Daily Intelligence</span>
                      </td>
                    </tr>
                  </table>

                  <div style="height:14px;">&nbsp;</div>

                  <!-- Footer meta -->
                  <p style="
                    font-family:'Libre Franklin',Arial,sans-serif;
                    font-size:10px;
                    font-weight:300;
                    line-height:17px;
                    color:rgba(255,255,255,0.18);
                    margin:0 0 10px 0;
                  ">
                    You're receiving this because you subscribed to Meridian at
                    <span style="color:rgba(168,85,247,0.5);">meridian.so</span>.
                  </p>

                  <!-- Unsubscribe -->
                  <p style="
                    font-family:'Libre Franklin',Arial,sans-serif;
                    font-size:10px;
                    font-weight:300;
                    line-height:17px;
                    color:rgba(255,255,255,0.14);
                    margin:0;
                  ">
                    <a href="{{unsubscribe_url}}" style="color:rgba(168,85,247,0.4);text-decoration:none;">Unsubscribe</a>
                    &nbsp;·&nbsp;
                    <a href="{{preferences_url}}" style="color:rgba(168,85,247,0.4);text-decoration:none;">Manage preferences</a>
                    &nbsp;·&nbsp;
                    <a href="{{privacy_url}}" style="color:rgba(168,85,247,0.4);text-decoration:none;">Privacy policy</a>
                  </p>

                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Bottom spacer -->
        <tr>
          <td style="height:32px;">&nbsp;</div></td>
        </tr>

      </table>
      <!-- /Email container -->

    </td>
  </tr>
</table>

</body>
</html>`;
}

export async function sendNewsletter(
  to: string[],
  newsletter: string,
  readTime: number
): Promise<void> {
  const html = buildEmailHTML(newsletter, readTime);

  const date = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  await transporter.sendMail({
    from: `"Meridian" <${process.env.EMAIL_FROM}>`,
    bcc: to,
    subject: `Meridian · ${date}`,
    html,
  });

  console.log(`[Mailer] Newsletter sent to ${to.length} subscribers`);
}

export async function sendWelcomeEmail(email: string) {
  const subject = "Welcome to Meridian";

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <meta name="color-scheme" content="dark"/>
  <meta name="supported-color-schemes" content="dark"/>
  <title>Welcome to Meridian</title>
  <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,200;0,300;0,400;1,200;1,300&display=swap" rel="stylesheet"/>
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,200;0,300;0,400;1,200;1,300&display=swap');
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
    a { color: #a855f7; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .hero-pad { padding: 40px 24px 32px !important; }
      .body-pad { padding: 32px 24px !important; }
      .footer-pad { padding: 24px 24px !important; }
      .headline { font-size: 28px !important; line-height: 34px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#09080f;font-family:'Libre Franklin',Arial,sans-serif;-webkit-font-smoothing:antialiased;">

<!-- Preheader (hidden preview text) -->
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#09080f;mso-hide:all;">
  Your daily intelligence brief is ready. AI, energy, geopolitics, and more — distilled for you.&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌
</div>

<!-- Wrapper -->
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
  style="background-color:#09080f;min-height:100vh;">
  <tr>
    <td align="center" valign="top" style="padding:32px 16px;">

      <!-- Email container -->
      <table class="email-container" role="presentation" border="0" cellpadding="0" cellspacing="0"
        width="560" style="max-width:560px;width:100%;">

        <!-- ── HERO BLOCK ── -->
        <tr>
          <td style="border-radius:10px 10px 0 0;overflow:hidden;">
            <!--[if gte mso 9]>
            <v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:560px;">
            <v:fill type="gradient" color="#1a0a2e" color2="#0c0819" angle="135"/>
            <v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0">
            <![endif]-->
            <div style="
              background: linear-gradient(145deg, #140b24 0%, #0f0a1c 40%, #0c0818 100%);
              border: 1px solid rgba(168,85,247,0.15);
              border-radius: 10px 10px 0 0;
              position: relative;
            ">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td class="hero-pad" style="padding:52px 44px 44px;">

                    <!-- Logo -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="
                          width:22px; height:22px;
                          border:1px solid rgba(168,85,247,0.45);
                          border-radius:3px;
                          text-align:center;
                          vertical-align:middle;
                        ">
                          <!-- Globe SVG as inline image fallback -->
                          <img src="https://raw.githubusercontent.com/twbs/icons/main/icons/globe2.svg"
                            width="12" height="12" alt=""
                            style="display:block;margin:4px auto;opacity:0;height:0;width:0;"/>
                          <!--[if !mso]><!-->
                          <span style="
                            display:inline-block;
                            font-size:11px;
                            line-height:20px;
                            color:#a855f7;
                            font-weight:200;
                          ">◎</span>
                          <!--<![endif]-->
                        </td>
                        <td style="padding-left:10px;">
                          <span style="
                            font-family:'Libre Franklin',Arial,sans-serif;
                            font-size:11px;
                            font-weight:200;
                            letter-spacing:0.28em;
                            text-transform:uppercase;
                            color:rgba(255,255,255,0.7);
                          ">Meridian</span>
                        </td>
                      </tr>
                    </table>

                    <!-- Spacer -->
                    <div style="height:32px;">&nbsp;</div>

                    <!-- Headline -->
                    <h1 class="headline" style="
                      font-family:'Libre Franklin',Arial,sans-serif;
                      font-size:36px;
                      font-weight:200;
                      line-height:42px;
                      letter-spacing:-0.01em;
                      color:#ffffff;
                      margin:0 0 16px 0;
                      padding:0;
                      mso-line-height-rule:exactly;
                    ">
                      You're in.<br/>
                      <span style="font-style:italic;font-weight:200;color:#c084fc;">
                        Welcome to the briefing.
                      </span>
                    </h1>

                    <!-- Sub-headline -->
                    <p style="
                      font-family:'Libre Franklin',Arial,sans-serif;
                      font-size:13px;
                      font-weight:300;
                      line-height:22px;
                      color:rgba(255,255,255,0.32);
                      margin:0;
                      padding:0;
                      max-width:340px;
                    ">
                      Your daily intelligence brief on AI, energy, geopolitics,
                      and emerging trends — distilled and delivered.
                    </p>

                    <!-- Divider -->
                    <div style="height:32px;border-bottom:1px solid rgba(168,85,247,0.1);">&nbsp;</div>

                    <!-- Spacer -->
                    <div style="height:28px;">&nbsp;</div>

                    <!-- What to expect label -->
                    <p style="
                      font-family:'Libre Franklin',Arial,sans-serif;
                      font-size:9px;
                      font-weight:300;
                      letter-spacing:0.2em;
                      text-transform:uppercase;
                      color:rgba(168,85,247,0.55);
                      margin:0 0 16px 0;
                      padding:0;
                    ">What you'll receive</p>

                    <!-- Topics grid — 2 col table -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <!-- Col 1 -->
                        <td width="48%" valign="top" style="padding-right:8px;padding-bottom:8px;">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="
                                background:rgba(168,85,247,0.07);
                                border:1px solid rgba(168,85,247,0.14);
                                border-radius:6px;
                                padding:14px 16px;
                              ">
                                <p style="margin:0 0 4px 0;font-family:'Libre Franklin',Arial,sans-serif;font-size:9px;font-weight:300;letter-spacing:0.18em;text-transform:uppercase;color:rgba(168,85,247,0.6);">01</p>
                                <p style="margin:0;font-family:'Libre Franklin',Arial,sans-serif;font-size:13px;font-weight:300;color:rgba(255,255,255,0.75);line-height:18px;">AI &amp; Technology</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <!-- Col 2 -->
                        <td width="48%" valign="top" style="padding-left:8px;padding-bottom:8px;">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="
                                background:rgba(168,85,247,0.07);
                                border:1px solid rgba(168,85,247,0.14);
                                border-radius:6px;
                                padding:14px 16px;
                              ">
                                <p style="margin:0 0 4px 0;font-family:'Libre Franklin',Arial,sans-serif;font-size:9px;font-weight:300;letter-spacing:0.18em;text-transform:uppercase;color:rgba(168,85,247,0.6);">02</p>
                                <p style="margin:0;font-family:'Libre Franklin',Arial,sans-serif;font-size:13px;font-weight:300;color:rgba(255,255,255,0.75);line-height:18px;">Energy &amp; Markets</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <!-- Col 1 -->
                        <td width="48%" valign="top" style="padding-right:8px;">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="
                                background:rgba(168,85,247,0.07);
                                border:1px solid rgba(168,85,247,0.14);
                                border-radius:6px;
                                padding:14px 16px;
                              ">
                                <p style="margin:0 0 4px 0;font-family:'Libre Franklin',Arial,sans-serif;font-size:9px;font-weight:300;letter-spacing:0.18em;text-transform:uppercase;color:rgba(168,85,247,0.6);">03</p>
                                <p style="margin:0;font-family:'Libre Franklin',Arial,sans-serif;font-size:13px;font-weight:300;color:rgba(255,255,255,0.75);line-height:18px;">Geopolitics</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                        <!-- Col 2 -->
                        <td width="48%" valign="top" style="padding-left:8px;">
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                              <td style="
                                background:rgba(168,85,247,0.07);
                                border:1px solid rgba(168,85,247,0.14);
                                border-radius:6px;
                                padding:14px 16px;
                              ">
                                <p style="margin:0 0 4px 0;font-family:'Libre Franklin',Arial,sans-serif;font-size:9px;font-weight:300;letter-spacing:0.18em;text-transform:uppercase;color:rgba(168,85,247,0.6);">04</p>
                                <p style="margin:0;font-family:'Libre Franklin',Arial,sans-serif;font-size:13px;font-weight:300;color:rgba(255,255,255,0.75);line-height:18px;">India &amp; Global Trends</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>
            </div>
            <!--[if gte mso 9]></v:textbox></v:rect><![endif]-->
          </td>
        </tr>

        <!-- ── BODY BLOCK ── -->
        <tr>
          <td style="
            background:#0e0c19;
            border-left:1px solid rgba(168,85,247,0.1);
            border-right:1px solid rgba(168,85,247,0.1);
          ">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td class="body-pad" style="padding:36px 44px;">

                  <!-- What happens next -->
                  <p style="
                    font-family:'Libre Franklin',Arial,sans-serif;
                    font-size:9px;
                    font-weight:300;
                    letter-spacing:0.2em;
                    text-transform:uppercase;
                    color:rgba(168,85,247,0.55);
                    margin:0 0 20px 0;
                  ">What happens next</p>

                  <!-- Step 1 -->
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
                    style="margin-bottom:16px;">
                    <tr>
                      <td width="32" valign="top" style="padding-top:1px;">
                        <div style="
                          width:24px; height:24px;
                          border-radius:50%;
                          background:rgba(124,58,237,0.15);
                          border:1px solid rgba(124,58,237,0.3);
                          text-align:center;
                          line-height:24px;
                          font-family:'Libre Franklin',Arial,sans-serif;
                          font-size:10px;
                          font-weight:300;
                          color:rgba(168,85,247,0.8);
                        ">1</div>
                      </td>
                      <td valign="top" style="padding-left:14px;">
                        <p style="
                          font-family:'Libre Franklin',Arial,sans-serif;
                          font-size:13px;
                          font-weight:300;
                          color:rgba(255,255,255,0.7);
                          line-height:20px;
                          margin:0 0 4px 0;
                        ">Confirm your subscription</p>
                        <p style="
                          font-family:'Libre Franklin',Arial,sans-serif;
                          font-size:12px;
                          font-weight:300;
                          color:rgba(255,255,255,0.28);
                          line-height:18px;
                          margin:0;
                        ">Check your inbox and click confirm to activate delivery.</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Step 2 -->
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
                    style="margin-bottom:16px;">
                    <tr>
                      <td width="32" valign="top" style="padding-top:1px;">
                        <div style="
                          width:24px; height:24px;
                          border-radius:50%;
                          background:rgba(124,58,237,0.15);
                          border:1px solid rgba(124,58,237,0.3);
                          text-align:center;
                          line-height:24px;
                          font-family:'Libre Franklin',Arial,sans-serif;
                          font-size:10px;
                          font-weight:300;
                          color:rgba(168,85,247,0.8);
                        ">2</div>
                      </td>
                      <td valign="top" style="padding-left:14px;">
                        <p style="
                          font-family:'Libre Franklin',Arial,sans-serif;
                          font-size:13px;
                          font-weight:300;
                          color:rgba(255,255,255,0.7);
                          line-height:20px;
                          margin:0 0 4px 0;
                        ">Receive your first brief tomorrow</p>
                        <p style="
                          font-family:'Libre Franklin',Arial,sans-serif;
                          font-size:12px;
                          font-weight:300;
                          color:rgba(255,255,255,0.28);
                          line-height:18px;
                          margin:0;
                        ">Delivered each morning — curated overnight by AI agents.</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Step 3 -->
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td width="32" valign="top" style="padding-top:1px;">
                        <div style="
                          width:24px; height:24px;
                          border-radius:50%;
                          background:rgba(124,58,237,0.15);
                          border:1px solid rgba(124,58,237,0.3);
                          text-align:center;
                          line-height:24px;
                          font-family:'Libre Franklin',Arial,sans-serif;
                          font-size:10px;
                          font-weight:300;
                          color:rgba(168,85,247,0.8);
                        ">3</div>
                      </td>
                      <td valign="top" style="padding-left:14px;">
                        <p style="
                          font-family:'Libre Franklin',Arial,sans-serif;
                          font-size:13px;
                          font-weight:300;
                          color:rgba(255,255,255,0.7);
                          line-height:20px;
                          margin:0 0 4px 0;
                        ">Stay ahead</p>
                        <p style="
                          font-family:'Libre Franklin',Arial,sans-serif;
                          font-size:12px;
                          font-weight:300;
                          color:rgba(255,255,255,0.28);
                          line-height:18px;
                          margin:0;
                        ">Signal over noise. Precision over volume. Every single day.</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Divider -->
                  <div style="height:32px;border-top:1px solid rgba(255,255,255,0.05);margin-top:32px;">&nbsp;</div>

                  <!-- Quote / tagline block -->
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td style="
                        border-left:2px solid rgba(168,85,247,0.4);
                        padding-left:18px;
                      ">
                        <p style="
                          font-family:'Libre Franklin',Arial,sans-serif;
                          font-size:15px;
                          font-weight:200;
                          font-style:italic;
                          color:rgba(255,255,255,0.5);
                          line-height:24px;
                          margin:0;
                        ">
                          &ldquo;The world, clearly rendered.&rdquo;
                        </p>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── FOOTER ── -->
        <tr>
          <td style="
            background:#0b0915;
            border:1px solid rgba(168,85,247,0.08);
            border-top:1px solid rgba(168,85,247,0.12);
            border-radius:0 0 10px 10px;
          ">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td class="footer-pad" style="padding:28px 44px 32px;">

                  <!-- Footer brand -->
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <span style="
                          font-family:'Libre Franklin',Arial,sans-serif;
                          font-size:9px;
                          font-weight:200;
                          letter-spacing:0.26em;
                          text-transform:uppercase;
                          color:rgba(255,255,255,0.22);
                        ">Meridian</span>
                      </td>
                      <td style="padding:0 10px;">
                        <span style="color:rgba(168,85,247,0.25);font-size:9px;">·</span>
                      </td>
                      <td>
                        <span style="
                          font-family:'Libre Franklin',Arial,sans-serif;
                          font-size:9px;
                          font-weight:300;
                          color:rgba(255,255,255,0.14);
                        ">Daily Intelligence</span>
                      </td>
                    </tr>
                  </table>

                  <div style="height:14px;">&nbsp;</div>

                  <!-- Footer meta -->
                  <p style="
                    font-family:'Libre Franklin',Arial,sans-serif;
                    font-size:10px;
                    font-weight:300;
                    line-height:17px;
                    color:rgba(255,255,255,0.18);
                    margin:0 0 10px 0;
                  ">
                    You're receiving this because you subscribed at meridian.so with
                    <span style="color:rgba(168,85,247,0.5);">${email}</span>.
                  </p>

                  <!-- Unsubscribe -->
                  <p style="
                    font-family:'Libre Franklin',Arial,sans-serif;
                    font-size:10px;
                    font-weight:300;
                    line-height:17px;
                    color:rgba(255,255,255,0.14);
                    margin:0;
                  ">
                    <a href="{{unsubscribe_url}}" style="color:rgba(168,85,247,0.4);text-decoration:none;">Unsubscribe</a>
                    &nbsp;·&nbsp;
                    <a href="{{preferences_url}}" style="color:rgba(168,85,247,0.4);text-decoration:none;">Manage preferences</a>
                    &nbsp;·&nbsp;
                    <a href="{{privacy_url}}" style="color:rgba(168,85,247,0.4);text-decoration:none;">Privacy policy</a>
                  </p>

                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Bottom spacer -->
        <tr>
          <td style="height:32px;">&nbsp;</td>
        </tr>

      </table>
      <!-- /Email container -->

    </td>
  </tr>
</table>

</body>
</html>`;

  await transporter.sendMail({
    from: `"Meridian" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject,
    html,
  });
}  


export async function sendIngestReportEmail(
  report: Record<string, number | string>
) {
  const subject = "📊 Meridian Ingestion Report";

  const rows = Object.entries(report)
    .map(([source, result]) => {
      const isError = typeof result === "string";

      return `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #eee;">${source}</td>
          <td style="padding:8px;border-bottom:1px solid #eee;
            color:${isError ? "#c30e16" : "#15803d"};">
            ${result}
          </td>
        </tr>
      `;
    })
    .join("");

  const html = `
    <div style="font-family:Arial;padding:20px;">
      <h2>📊 Meridian Ingestion Report</h2>

      <p>Here’s the latest ingestion summary:</p>

      <table style="width:100%;border-collapse:collapse;margin-top:20px;">
        <thead>
          <tr style="text-align:left;">
            <th style="padding:8px;border-bottom:2px solid #ddd;">Source</th>
            <th style="padding:8px;border-bottom:2px solid #ddd;">Result</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>

      <p style="margin-top:20px;font-size:12px;color:#666;">
        ✔ Green = success<br/>
        ❌ Red = failed source
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Meridian Reports" <${process.env.EMAIL_FROM}>`,
    to: process.env.ADMIN_EMAIL, // 👈 your email
    subject,
    html,
  });
}