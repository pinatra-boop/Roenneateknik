import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.SMTP_FROM ?? "Rønne Autoteknik <onboarding@resend.dev>";
const WORKSHOP = process.env.WORKSHOP_EMAIL ?? "";

interface BookingEmailData {
  customerName: string;
  email: string;
  phone: string;
  licensePlate: string;
  carBrand?: string;
  carModel?: string;
  carYear?: number;
  carFuel?: string;
  carVariant?: string;
  carEngine?: string;
  carVin?: string;
  serviceType: string;
  date: string;
  timeSlot: string;
  message?: string;
}

export async function sendBookingConfirmation(data: BookingEmailData) {
  const html = `
    <!DOCTYPE html>
    <html lang="da">
    <head><meta charset="UTF-8"><title>Bookingbekræftelse</title></head>
    <body style="font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="background: #0f2d5a; padding: 30px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 24px;">Rønne Autoteknik</h1>
          <p style="color: #e8931a; margin: 8px 0 0;">Bookingbekræftelse</p>
        </div>
        <div style="padding: 30px;">
          <p style="color: #333; font-size: 16px;">Hej ${data.customerName},</p>
          <p style="color: #555;">Vi har modtaget din booking. Her er en oversigt:</p>
          <div style="background: #f9f9f9; border-radius: 6px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #888; width: 40%;">Service:</td><td style="color: #333; font-weight: bold;">${data.serviceType}</td></tr>
              <tr><td style="padding: 8px 0; color: #888;">Dato:</td><td style="color: #333; font-weight: bold;">${data.date}</td></tr>
              <tr><td style="padding: 8px 0; color: #888;">Tidspunkt:</td><td style="color: #333; font-weight: bold;">${data.timeSlot}</td></tr>
              <tr><td style="padding: 8px 0; color: #888;">Nummerplade:</td><td style="color: #333; font-weight: bold;">${data.licensePlate}</td></tr>
              ${data.carBrand ? `<tr><td style="padding: 8px 0; color: #888;">Bil:</td><td style="color: #333; font-weight: bold;">${data.carBrand} ${data.carModel || ""} (${data.carYear || ""})</td></tr>` : ""}
              ${data.message ? `<tr><td style="padding: 8px 0; color: #888;">Besked:</td><td style="color: #333;">${data.message}</td></tr>` : ""}
            </table>
          </div>
          <p style="color: #555;">Vi bekræfter din booking snarest. Har du spørgsmål, er du velkommen til at kontakte os.</p>
          <div style="background: #0f2d5a; border-radius: 6px; padding: 15px; margin-top: 20px; text-align: center;">
            <p style="color: #e8931a; margin: 0; font-weight: bold;">📞 +45 56 00 00 00</p>
            <p style="color: #aaa; margin: 5px 0 0; font-size: 14px;">Mandag–Fredag: 08:00–17:00</p>
          </div>
        </div>
        <div style="background: #f0f0f0; padding: 15px; text-align: center;">
          <p style="color: #888; font-size: 12px; margin: 0;">Rønne Autoteknik · Storegade 1, 3700 Rønne · info@ronneautoteknik.dk</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: FROM,
    to: data.email,
    subject: `Bookingbekræftelse – ${data.serviceType} d. ${data.date}`,
    html,
  });
}

export async function sendBookingNotification(data: BookingEmailData) {
  const carRows = [
    ["Nummerplade", data.licensePlate],
    data.carBrand ? ["Mærke", data.carBrand] : null,
    data.carModel ? ["Model", data.carModel] : null,
    data.carVariant ? ["Variant", data.carVariant] : null,
    data.carYear ? ["Årgang", String(data.carYear)] : null,
    data.carFuel ? ["Brændstof", data.carFuel] : null,
    data.carEngine ? ["Motor", data.carEngine] : null,
    data.carVin ? ["Stelnummer (VIN)", data.carVin] : null,
  ]
    .filter((x): x is [string, string] => x !== null)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:7px 12px;color:#555;width:45%;border-bottom:1px solid #eee;">${label}</td><td style="padding:7px 12px;color:#111;font-weight:600;border-bottom:1px solid #eee;">${value}</td></tr>`
    )
    .join("");

  const html = `
    <!DOCTYPE html>
    <html lang="da">
    <head><meta charset="UTF-8"><title>Ny Booking</title></head>
    <body style="font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:20px;">
      <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
        <div style="background:#0f2d5a;padding:24px 30px;">
          <h1 style="color:#fff;margin:0;font-size:20px;">Rønne Autoteknik</h1>
          <p style="color:#e8931a;margin:6px 0 0;font-size:15px;">Ny booking modtaget</p>
        </div>
        <div style="padding:28px 30px;">
          <h2 style="color:#0f2d5a;font-size:16px;margin:0 0 16px;">Kundeoplysninger</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr><td style="padding:7px 12px;color:#555;width:45%;border-bottom:1px solid #eee;">Navn</td><td style="padding:7px 12px;color:#111;font-weight:600;border-bottom:1px solid #eee;">${data.customerName}</td></tr>
            <tr><td style="padding:7px 12px;color:#555;border-bottom:1px solid #eee;">Email</td><td style="padding:7px 12px;border-bottom:1px solid #eee;"><a href="mailto:${data.email}" style="color:#0f2d5a;">${data.email}</a></td></tr>
            <tr><td style="padding:7px 12px;color:#555;border-bottom:1px solid #eee;">Telefon</td><td style="padding:7px 12px;border-bottom:1px solid #eee;"><a href="tel:${data.phone}" style="color:#0f2d5a;">${data.phone}</a></td></tr>
          </table>
          <h2 style="color:#0f2d5a;font-size:16px;margin:0 0 16px;">Booking</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr><td style="padding:7px 12px;color:#555;width:45%;border-bottom:1px solid #eee;">Service</td><td style="padding:7px 12px;color:#111;font-weight:600;border-bottom:1px solid #eee;">${data.serviceType}</td></tr>
            <tr><td style="padding:7px 12px;color:#555;border-bottom:1px solid #eee;">Dato</td><td style="padding:7px 12px;color:#111;font-weight:600;border-bottom:1px solid #eee;">${data.date}</td></tr>
            <tr><td style="padding:7px 12px;color:#555;border-bottom:1px solid #eee;">Tidspunkt</td><td style="padding:7px 12px;color:#111;font-weight:600;border-bottom:1px solid #eee;">${data.timeSlot}</td></tr>
            ${data.message ? `<tr><td style="padding:7px 12px;color:#555;border-bottom:1px solid #eee;">Besked</td><td style="padding:7px 12px;color:#333;border-bottom:1px solid #eee;">${data.message}</td></tr>` : ""}
          </table>
          <h2 style="color:#0f2d5a;font-size:16px;margin:0 0 16px;">Køretøjsoplysninger</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;background:#f9f9f9;border-radius:6px;">
            ${carRows}
          </table>
          <div style="text-align:center;margin-top:8px;">
            <a href="${process.env.NEXTAUTH_URL}/admin/bookings" style="display:inline-block;background:#0f2d5a;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">Se booking i admin</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: FROM,
    to: WORKSHOP,
    subject: `[Ny Booking] ${data.customerName} – ${data.serviceType} d. ${data.date}`,
    html,
  });
}

export async function sendContactNotification(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
  licensePlate?: string;
}) {
  const html = `
    <h2>Ny kontaktbesked</h2>
    <p><strong>Navn:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Telefon:</strong> ${data.phone}</p>
    ${data.licensePlate ? `<p><strong>Nummerplade:</strong> ${data.licensePlate}</p>` : ""}
    <p><strong>Besked:</strong><br>${data.message}</p>
    <p><a href="${process.env.NEXTAUTH_URL}/admin/contacts">Se i admin</a></p>
  `;

  await resend.emails.send({
    from: FROM,
    to: WORKSHOP,
    subject: `[Ny Kontakt] ${data.name}`,
    html,
  });
}
