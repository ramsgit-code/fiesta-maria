import PinGate from '@/components/PinGate'
import AdminPanel from '@/components/AdminPanel'

export default function AdminPage() {
  return (
    <PinGate level="admin">
      <AdminPanel />
    </PinGate>
  )
}
