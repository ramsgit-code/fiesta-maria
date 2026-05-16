import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const { nombre, email, num_acompanantes, comentario } = await req.json()

  if (!nombre?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  // Comprobar si ya existe
  const { data: existente } = await supabase
    .from('invitados')
    .select('id')
    .eq('email', email.trim().toLowerCase())
    .single()

  if (existente) {
    return NextResponse.json({ error: 'ya_registrado' }, { status: 409 })
  }

  const { error: dbError } = await supabase.from('invitados').insert({
    nombre: nombre.trim(),
    email: email.trim().toLowerCase(),
    num_acompanantes: num_acompanantes || 0,
    comentario: comentario?.trim() || null,
    confirmado: true,
  })

  if (dbError) {
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }

  // Email de confirmación al invitado
  await resend.emails.send({
    from: 'Fiesta María <onboarding@resend.dev>',
    to: email.trim(),
    subject: `¡Confirmado! Te esperamos el 30 de mayo 🎉`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; background: #f8f5f0; padding: 0;">
        <div style="background: #1a3a6b; padding: 40px 32px; text-align: center;">
          <p style="color: #c9a84c; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; margin: 0 0 12px;">Policía Nacional Escala Básica · Promoción 40</p>
          <h1 style="color: white; font-size: 28px; margin: 0; font-weight: bold;">¡Te esperamos, ${nombre.trim()}!</h1>
        </div>
        <div style="padding: 32px;">
          <p style="color: #333; line-height: 1.7; margin: 0 0 24px;">Tu asistencia a la fiesta de la Jura de María ha quedado confirmada. ¡Nos alegra mucho que puedas venir!</p>

          <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 20px;">📅</span>
                <div>
                  <p style="margin: 0; font-size: 11px; color: #c9a84c; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Fecha</p>
                  <p style="margin: 0; color: #1a3a6b; font-weight: bold;">Sábado, 30 de mayo de 2026</p>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 20px;">🕐</span>
                <div>
                  <p style="margin: 0; font-size: 11px; color: #c9a84c; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Hora</p>
                  <p style="margin: 0; color: #1a3a6b; font-weight: bold;">A partir de las 12:00h</p>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 20px;">📍</span>
                <div>
                  <p style="margin: 0; font-size: 11px; color: #c9a84c; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Lugar</p>
                  <p style="margin: 0; color: #1a3a6b; font-weight: bold;">Finca familiar · Gemuño, Ávila</p>
                </div>
              </div>
            </div>
          </div>

          <a href="https://maps.app.goo.gl/XSDpEvBDrP2LtbAY7" style="display: inline-block; background: #1a3a6b; color: white; text-decoration: none; padding: 12px 24px; border-radius: 24px; font-size: 13px; font-weight: bold; margin-bottom: 24px;">
            Ver ubicación en Google Maps →
          </a>

          <p style="color: #999; font-size: 12px; border-top: 1px solid #e0d8cc; padding-top: 20px; margin: 0;">
            Si tienes alguna pregunta, puedes responder a este email o visitar la web de la fiesta en <a href="https://fiesta-maria.vercel.app" style="color: #c9a84c;">fiesta-maria.vercel.app</a>
          </p>
        </div>
      </div>
    `,
  })

  // Notificar al organizador
  await resend.emails.send({
    from: 'Fiesta María <onboarding@resend.dev>',
    to: 'ramiroperez12@hotmail.com',
    subject: `🎉 Nueva confirmación — ${nombre.trim()}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8f5f0;">
        <h2 style="color: #1a3a6b; margin-bottom: 4px;">Nueva confirmación de asistencia</h2>
        <hr style="border: none; border-top: 1px solid #e0d8cc; margin: 16px 0;" />
        <p style="margin: 0 0 4px;"><strong style="color: #1a3a6b;">Nombre:</strong> ${nombre.trim()}</p>
        <p style="margin: 0 0 4px;"><strong style="color: #1a3a6b;">Email:</strong> ${email.trim()}</p>
        <p style="margin: 0 0 4px;"><strong style="color: #1a3a6b;">Acompañantes:</strong> ${num_acompanantes || 0}</p>
        ${comentario?.trim() ? `<p style="margin: 8px 0 0;"><strong style="color: #1a3a6b;">Nota:</strong> ${comentario.trim()}</p>` : ''}
      </div>
    `,
  })

  return NextResponse.json({ ok: true })
}
