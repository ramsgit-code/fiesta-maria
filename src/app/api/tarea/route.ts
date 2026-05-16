import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const { titulo, descripcion, asignado_a } = await req.json()

  if (!titulo?.trim()) {
    return NextResponse.json({ error: 'Falta el título' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('tareas')
    .insert({
      titulo: titulo.trim(),
      descripcion: descripcion?.trim() || null,
      asignado_a: asignado_a?.trim() || null,
      completada: false,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, tarea: data })
}
