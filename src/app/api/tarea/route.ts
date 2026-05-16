import { NextRequest, NextResponse } from 'next/server'
import { transporter, FROM } from '@/lib/mailer'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const { titulo, descripcion, asignado_a, email_asignado } = await req.json()

  if (!titulo?.trim()) {
    return NextResponse.json({ error: 'Falta el título' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('tareas')
    .insert({
      titulo: titulo.trim(),
      descripcion: descripcion?.trim() || null,
      asignado_a: asignado_a?.trim() || null,
      email_asignado: email_asignado?.trim() || null,
      completada: false,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }

  if (email_asignado?.trim()) {
    const nombre = asignado_a?.trim() || email_asignado.trim()
    await transporter.sendMail({
      from: FROM,
      to: email_asignado.trim(),
      subject: `📋 Tienes una tarea para la fiesta de María`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #f8f5f0;">
          <h2 style="color: #1a3a6b; margin-bottom: 4px;">Hola, ${nombre} 👋</h2>
          <p style="color: #c9a84c; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-top: 0;">Fiesta de la Jura de María · 30 mayo 2026</p>
          <hr style="border: none; border-top: 1px solid #e0d8cc; margin: 24px 0;" />
          <p style="color: #333; line-height: 1.6;">Te han asignado una tarea para ayudar a preparar la fiesta:</p>
          <div style="background: white; border-left: 4px solid #c9a84c; padding: 16px 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 6px; font-size: 18px; font-weight: bold; color: #1a3a6b;">${titulo.trim()}</p>
            ${descripcion?.trim() ? `<p style="margin: 0; color: #666; font-size: 14px;">${descripcion.trim()}</p>` : ''}
          </div>
          <div style="background: #f0f4ff; border: 1px solid #c7d4f0; border-radius: 12px; padding: 16px 20px; margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 4px; font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 2px;">Tu código de acceso</p>
            <p style="margin: 0; font-size: 32px; font-weight: bold; color: #1a3a6b; letter-spacing: 8px;">${process.env.NEXT_PUBLIC_TASKS_PIN || '1234'}</p>
            <p style="margin: 8px 0 0; font-size: 12px; color: #6b7280;">Úsalo en <a href="https://fiesta-maria.vercel.app/tareas" style="color: #c9a84c;">fiesta-maria.vercel.app/tareas</a> para ver y gestionar las tareas</p>
          </div>
          <p style="color: #333; line-height: 1.6; margin-top: 16px;">O marca directamente tu tarea como completada:</p>
          <a href="https://fiesta-maria.vercel.app/tarea/${data.id}" style="display: inline-block; background: #1a3a6b; color: white; text-decoration: none; padding: 12px 28px; border-radius: 24px; font-weight: bold; margin-top: 8px; font-size: 14px;">
            ✓ Marcar como completada →
          </a>
          <p style="color: #999; font-size: 12px; margin-top: 32px;">¡Gracias por ayudar a que la fiesta de María sea perfecta! 🎉</p>
        </div>
      `,
    })
  }

  return NextResponse.json({ ok: true, tarea: data })
}
