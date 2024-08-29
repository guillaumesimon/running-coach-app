import SessionDetails from './SessionDetails'

export default function SessionPage({ params }: { params: { id: string } }) {
  return <SessionDetails id={params.id} />
}
