import { NextRequest, NextResponse } from 'next/server'
import { transporter, FROM, ADMIN_EMAIL } from '@/lib/mailer'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const { nombre, email, num_acompanantes, comentario } = await req.json()

  if (!nombre?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

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

  // Notificación al organizador
  await transporter.sendMail({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `🎉 Nueva confirmación — ${nombre.trim()}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8f5f0;">
        <h2 style="color: #1a3a6b;">Nueva confirmación de asistencia</h2>
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
