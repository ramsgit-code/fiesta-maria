import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const { id, completada } = await req.json()

  if (!id) return NextResponse.json({ error: 'Falta el id' }, { status: 400 })

  const { error } = await supabase.from('tareas').update({ completada }).eq('id', id)

  if (error) return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
