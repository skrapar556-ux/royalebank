export async function sendOTPEmail(email: string, otp: string) {
  // Check if SMTP credentials are configured
  const hasSmtpConfig = process.env.SMTP_USER && process.env.SMTP_PASS

  if (!hasSmtpConfig) {
    // Preview/Demo mode - log OTP to console instead of sending email
    console.log("=".repeat(50))
    console.log("📧 EMAIL PREVIEW MODE")
    console.log("=".repeat(50))
    console.log(`To: ${email}`)
    console.log(`Subject: RoyaleBank - Your OTP Code`)
    console.log(`OTP Code: ${otp}`)
    console.log("=".repeat(50))
    console.log("⚠️  In production, configure SMTP environment variables to send real emails")
    console.log("=".repeat(50))
    return true
  }

  // Production mode - send real email
  try {
    const nodemailer = await import("nodemailer")
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.SMTP_FROM || "noreply@royalebank.com",
      to: email,
      subject: "RoyaleBank - Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0ea5e9;">RoyaleBank</h2>
          <p>Your OTP code is:</p>
          <h1 style="color: #0ea5e9; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 12px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    })
    return true
  } catch (error) {
    console.error("Email send error:", error)
    return false
  }
}
