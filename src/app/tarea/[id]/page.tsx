import TareaIndividual from '@/components/TareaIndividual'

export default function TareaPage({ params }: { params: { id: string } }) {
  return <TareaIndividual id={params.id} />
}
