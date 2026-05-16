import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const { nombre, email, mensaje } = await req.json()

  if (!nombre?.trim() || !mensaje?.trim()) {
    return NextResponse.json({ error: 'Faltan campos' }, { status: 400 })
  }

  const { error: dbError } = await supabase.from('comentarios').insert({
    nombre: nombre.trim(),
    email: email?.trim() || null,
    mensaje: mensaje.trim(),
  })

  if (dbError) {
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }

  await resend.emails.send({
    from: 'Fiesta María <onboarding@resend.dev>',
    to: 'ramiroperez12@hotmail.com',
    subject: `💬 Nuevo mensaje de ${nombre.trim()} — Fiesta Jura María`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 32px; background: #f8f5f0;">
        <h2 style="color: #1a3a6b; margin-bottom: 4px;">Nuevo mensaje en la web</h2>
        <p style="color: #c9a84c; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-top: 0;">Fiesta de la Jura de María · 30 mayo 2026</p>
        <hr style="border: none; border-top: 1px solid #e0d8cc; margin: 24px 0;" />
        <p style="margin: 0 0 4px;"><strong style="color: #1a3a6b;">Nombre:</strong></p>
        <p style="margin: 0 0 16px; color: #333;">${nombre.trim()}</p>
        ${email?.trim() ? `<p style="margin: 0 0 4px;"><strong style="color: #1a3a6b;">Email:</strong></p><p style="margin: 0 0 16px; color: #333;">${email.trim()}</p>` : ''}
        <p style="margin: 0 0 4px;"><strong style="color: #1a3a6b;">Mensaje:</strong></p>
        <p style="margin: 0; color: #333; line-height: 1.6; background: white; padding: 16px; border-radius: 8px;">${mensaje.trim()}</p>
      </div>
    `,
  })

  return NextResponse.json({ ok: true })
}
