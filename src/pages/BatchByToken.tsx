import { useParams, useNavigate } from 'react-router-dom'
import { useBatchByToken } from '../hooks/useBatchByToken'
import { useEffect } from 'react'

export function BatchByToken() {
  const { token } = useParams()
  const navigate = useNavigate()

  const { data, isLoading } = useBatchByToken(token!)

  useEffect(() => {
    if (data?.id) {
      navigate(`/ciclo/${data.id}/certificado`)
    }
  }, [data, navigate])

  if (isLoading) {
    return (
        <div className="app-shell flex items-center justify-center">
            <div className="animate-pulse text-on-surface-variant font-bold uppercase tracking-widest text-xs">
                Localizando seu ciclo...
            </div>
        </div>
    )
  }

  return (
    <div className="app-shell flex items-center justify-center">
        <div className="text-center space-y-4">
            <div className="text-4xl text-red-400">🔍</div>
            <p className="text-on-surface-variant font-bold">Ciclo não encontrado ou token inválido.</p>
            <button 
                onClick={() => navigate('/')}
                className="text-primary font-black uppercase text-xs tracking-widest underline underline-offset-4"
            >
                Voltar ao início
            </button>
        </div>
    </div>
  )
}
