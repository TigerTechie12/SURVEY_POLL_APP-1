import { Card1 } from '../components/Card1'
import { Card2 } from '../components/Card2'
import { Card3 } from '../components/Card3'
import { Card4 } from '../components/Card4'

export function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Card1 />
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <Card2 />
        <Card3 />
        <Card4 />
      </div>
    </div>
  )
}
