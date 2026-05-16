import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const { id, completada } = await req.json()

  if (!id) return NextResponse.json({ error: 'Falta el id' }, { status: 400 })

  const { data: tarea } = await supabase
    .from('tareas')
    .select('*')
    .eq('id', id)
    .single()

  if (!tarea) return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 })

  await supabase.from('tareas').update({ completada }).eq('id', id)

  if (completada && tarea.asignado_a) {
    await resend.emails.send({
      from: 'Fiesta María <onboarding@resend.dev>',
      to: 'ramiroperez12@hotmail.com',
      subject: `✅ Tarea completada — ${tarea.titulo}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #f8f5f0;">
          <h2 style="color: #1a3a6b; margin-bottom: 4px;">Tarea completada</h2>
          <p style="color: #c9a84c; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-top: 0;">Fiesta de la Jura de María · 30 mayo 2026</p>
          <hr style="border: none; border-top: 1px solid #e0d8cc; margin: 24px 0;" />
          <div style="background: white; border-left: 4px solid #22c55e; padding: 16px 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 6px; font-size: 18px; font-weight: bold; color: #1a3a6b;">✅ ${tarea.titulo}</p>
            <p style="margin: 0; color: #666; font-size: 14px;">Completada por: <strong>${tarea.asignado_a}</strong>${tarea.email_asignado ? ` (${tarea.email_asignado})` : ''}</p>
          </div>
          <a href="https://fiesta-maria.vercel.app/tareas" style="display: inline-block; background: #1a3a6b; color: white; text-decoration: none; padding: 12px 28px; border-radius: 24px; font-weight: bold; margin-top: 8px; font-size: 14px;">
            Ver todas las tareas →
          </a>
        </div>
      `,
    })
  }

  return NextResponse.json({ ok: true })
}
