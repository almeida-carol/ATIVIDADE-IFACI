"use client"
import { useState, useEffect, useRef, ChangeEvent, useImperativeHandle, forwardRef } from "react"

export interface ListarEquipamentosRef {
    refresh: () => void
}

type SensorIoT = {
    id: number
    temperatura: number
    pressao: number
    umidade: number
    sensor_presenca: boolean
    trava_seguranca: boolean
}

const ListarEquipamentos = forwardRef<ListarEquipamentosRef>(function ListarEquipamentos(_, ref) {

    // === EQUIPAMENTOS ===
    const [equipamentos, setEquipamentos] = useState([{ id: 0, nome: "" }])
    const [novoEquipamento, setNovoEquipamento] = useState({ nome: "" })
    const [modalEditarEquip, setModalEditarEquip] = useState(false)
    const equipamentoId = useRef(0)

    const pegaEquipamentosBackend = async () => {
        try {
            const resposta = await fetch("http://localhost:8080/equipamentos")
            const json = await resposta.json()
            setEquipamentos(json)
        } catch (erro) {
            console.log(erro)
        }
    }

    useImperativeHandle(ref, () => ({
        refresh: pegaEquipamentosBackend
    }))

    const deletaEquipamento = async (id: number) => {
        try {
            const resposta = await fetch(`http://localhost:8080/equipamentos/${id}`, { method: "DELETE" })
            const json = await resposta.json()
            alert(json.msg)
            pegaEquipamentosBackend()
        } catch (erro) {
            console.log(erro)
        }
    }

    const editaEquipamento = async (id: number) => {
        try {
            const resposta = await fetch(`http://localhost:8080/equipamentos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novoEquipamento)
            })
            const json = await resposta.json()
            alert(json.msg)
            setNovoEquipamento({ nome: "" })
            pegaEquipamentosBackend()
        } catch (erro) {
            console.log(erro)
        }
    }

    // === SENSORES IoT (Node-RED) ===
    const [sensoresIoT, setSensoresIoT] = useState<SensorIoT[]>([])

    const pegaSensoresIoT = async () => {
        try {
            const resposta = await fetch("http://localhost:8080/iot")
            const json = await resposta.json()
            setSensoresIoT(json)
        } catch (erro) {
            console.log(erro)
        }
    }

    useEffect(() => {
        pegaEquipamentosBackend()
        pegaSensoresIoT()
        const intervalo = setInterval(pegaSensoresIoT, 5000)
        return () => clearInterval(intervalo)
    }, [])

    return (
        <div className="w-[50vw] max-h-[88vh] overflow-y-auto bg-white text-slate-800 rounded-2xl flex flex-col gap-4 p-6 shadow-md border border-slate-100">
            <div>
                <h2 className="text-lg font-bold text-slate-700">Equipamentos</h2>
                <p className="text-sm text-slate-400">Visualize e gerencie os equipamentos cadastrados</p>
            </div>

            {equipamentos.map((equip, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">ID #{equip.id}</span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-700">{equip.nome}</h3>

                    {/* Dados do sensor IoT vinculado pelo id */}
                    {(() => {
                        const sensor = sensoresIoT.find(s => s.id === equip.id)
                        if (!sensor) return (
                            <p className="text-xs text-slate-400 italic">Aguardando dados do sensor IoT...</p>
                        )
                        return (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex flex-col gap-1 text-sm">
                                <p className="font-semibold text-amber-700 text-xs uppercase tracking-wide mb-1">Sensor IoT — Node-RED</p>
                                <p className="text-slate-600">🌡️ Temperatura: <span className="font-medium">{sensor.temperatura?.toFixed(2)} °C</span></p>
                                <p className="text-slate-600">📊 Pressão: <span className="font-medium">{sensor.pressao?.toFixed(4)} hPa</span></p>
                                <p className="text-slate-600">💧 Umidade: <span className="font-medium">{sensor.umidade?.toFixed(4)} %</span></p>
                                <p className="text-slate-600">👁️ Presença: <span className={sensor.sensor_presenca ? "text-emerald-600 font-semibold" : "text-slate-400"}>{sensor.sensor_presenca ? "Detectada" : "Não detectada"}</span></p>
                                <p className="text-slate-600">🔒 Trava: <span className={sensor.trava_seguranca ? "text-rose-500 font-semibold" : "text-emerald-600 font-semibold"}>{sensor.trava_seguranca ? "Ativada" : "Desativada"}</span></p>
                            </div>
                        )
                    })()}

                    <div className="flex w-full justify-end gap-3 mt-1">
                        <button
                            onClick={() => { equipamentoId.current = equip.id; setModalEditarEquip(true) }}
                            className="rounded-lg px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium transition-colors cursor-pointer"
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => deletaEquipamento(equip.id)}
                            className="rounded-lg px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium transition-colors cursor-pointer"
                        >
                            Remover
                        </button>
                    </div>
                </div>
            ))}

            {/* === MODAL EDITAR EQUIPAMENTO === */}
            {modalEditarEquip &&
                <div className="w-screen h-screen inset-0 absolute bg-slate-900/60 flex justify-center items-center">
                    <div className="w-[50vw] h-fit rounded-2xl shadow-xl bg-white flex flex-col px-6 py-6 gap-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-700">Editar Equipamento #{equipamentoId.current}</h2>
                            <p className="text-sm text-slate-400">Altere o nome do equipamento</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-600">Novo nome</label>
                                <input type="text" placeholder="Nome do equipamento" value={novoEquipamento.nome}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNovoEquipamento({ nome: e.target.value })}
                                    className="p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
                                />
                            </div>
                            <div className="flex gap-3 justify-end w-full">
                                <button
                                    onClick={() => { editaEquipamento(equipamentoId.current); setModalEditarEquip(false) }}
                                    className="rounded-lg px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium transition-colors cursor-pointer"
                                >
                                    Salvar
                                </button>
                                <button
                                    onClick={() => setModalEditarEquip(false)}
                                    className="rounded-lg px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-medium transition-colors cursor-pointer"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
})

export default ListarEquipamentos
