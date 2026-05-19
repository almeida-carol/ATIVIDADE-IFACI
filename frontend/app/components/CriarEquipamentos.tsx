"use client"
import { useState, ChangeEvent } from "react"

interface Props {
    onCriado?: () => void
}

export default function CriarEquipamento({ onCriado }: Props) {
    const [novoEquipamento, setNovoEquipamento] = useState({
        nome: ""
    })

    const pegaInfo = (e: ChangeEvent<HTMLInputElement>) => {
        setNovoEquipamento({ nome: e.target.value })
    }

    const criarEquipamento = async () => {
        const url = "http://localhost:8080/equipamentos"
        try {
            const resposta = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novoEquipamento)
            })
            const resposta_json = await resposta.json()
            alert(resposta_json.msg)
            setNovoEquipamento({ nome: "" })
            if (onCriado) onCriado()
        }
        catch (erro) {
            console.log(erro)
        }
    }

    return (
        <div className="w-[50vw] flex flex-col gap-5 rounded-2xl max-h-fit bg-white text-slate-800 p-6 shadow-md border border-slate-100">
            <div>
                <h2 className="text-lg font-bold text-slate-700">Novo Equipamento</h2>
                <p className="text-sm text-slate-400">Adicione um equipamento ao sistema</p>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-600">Nome do equipamento</label>
                <input
                    type="text"
                    placeholder="Ex: Sensor de temperatura A1"
                    value={novoEquipamento.nome}
                    onChange={(e) => pegaInfo(e)}
                    className="p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
                />
            </div>

            <button
                onClick={criarEquipamento}
                className="py-2 px-4 text-white rounded-lg bg-sky-500 hover:bg-sky-600 transition-colors font-medium cursor-pointer"
            >
                Adicionar
            </button>
        </div>
    )
}