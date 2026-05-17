import { NextRequest, NextResponse } from 'next/server'
import { transporter, FROM, ADMIN_EMAIL } from '@/lib/mailer'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const { nombre, num_acompanantes, comentario, bebida, bebidas_acompanantes } = await req.json()

  if (!nombre?.trim()) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  const { error: dbError } = await supabase.from('invitados').insert({
    nombre: nombre.trim(),
    num_acompanantes: num_acompanantes || 0,
    comentario: comentario?.trim() || null,
    bebida: bebida?.trim() || null,
    bebidas_acompanantes: bebidas_acompanantes?.length ? bebidas_acompanantes : null,
    confirmado: true,
  })

  if (dbError) {
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }

  try {
    await transporter.sendMail({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `🎉 Nueva confirmación — ${nombre.trim()}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8f5f0;">
          <h2 style="color: #1a3a6b;">Nueva confirmación de asistencia</h2>
          <hr style="border: none; border-top: 1px solid #e0d8cc; margin: 16px 0;" />
          <p style="margin: 0 0 4px;"><strong style="color: #1a3a6b;">Nombre:</strong> ${nombre.trim()}</p>
          <p style="margin: 0 0 4px;"><strong style="color: #1a3a6b;">Acompañantes:</strong> ${num_acompanantes || 0}</p>
          ${bebida?.trim() ? `<p style="margin: 0 0 4px;"><strong style="color: #1a3a6b;">Bebida:</strong> ${bebida.trim()}</p>` : ''}
          ${comentario?.trim() ? `<p style="margin: 8px 0 0;"><strong style="color: #1a3a6b;">Nota:</strong> ${comentario.trim()}</p>` : ''}
        </div>
      `,
    })
  } catch (e) {
    console.error('Email error:', e)
  }

  return NextResponse.json({ ok: true })
}
