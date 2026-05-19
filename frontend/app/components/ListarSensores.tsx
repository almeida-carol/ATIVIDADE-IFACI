"use client"
import { useState, useEffect } from "react"

type Sensor = {
    id: number
    temperatura: number
    pressao: number
    umidade: number
    sensor_presenca: boolean
    trava_seguranca: boolean
}

export default function ListarSensores() {
    const [sensores, setSensores] = useState<Sensor[]>([])

    const pegaSensores = async () => {
        const url = "http://localhost:8080/iot"
        try {
            const resposta = await fetch(url)
            const resposta_json = await resposta.json()
            setSensores(resposta_json)
        } catch (erro) {
            console.log(erro)
        }
    }

    useEffect(() => {
        pegaSensores()
        const intervalo = setInterval(pegaSensores, 5000)
        return () => clearInterval(intervalo)
    }, [])

    return (
        <div className="w-full max-h-[88vh] overflow-y-auto bg-white text-slate-800 rounded-2xl flex flex-col gap-4 p-6 shadow-md border border-slate-100">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-slate-700">Sensores IoT</h2>
                    <p className="text-sm text-slate-400">Dados recebidos via Node-RED — atualização a cada 5s</p>
                </div>
                <button
                    onClick={pegaSensores}
                    className="px-3 py-2 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition-colors cursor-pointer"
                >
                    Atualizar
                </button>
            </div>

            {sensores.length === 0 && (
                <p className="text-slate-400 text-sm italic">Nenhum dado recebido ainda. Aguardando Node-RED...</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {sensores.map((sensor) => (
                    <div key={sensor.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3 shadow-sm">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Sensor #{sensor.id}</span>

                        <div className="flex flex-col gap-2 text-sm">
                            <div className="flex items-center justify-between bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
                                <span className="text-slate-500">🌡️ Temperatura</span>
                                <span className="font-semibold text-orange-600">{sensor.temperatura?.toFixed(2)} °C</span>
                            </div>
                            <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                                <span className="text-slate-500">📊 Pressão</span>
                                <span className="font-semibold text-blue-600">{sensor.pressao?.toFixed(4)} hPa</span>
                            </div>
                            <div className="flex items-center justify-between bg-cyan-50 border border-cyan-100 rounded-lg px-3 py-2">
                                <span className="text-slate-500">💧 Umidade</span>
                                <span className="font-semibold text-cyan-600">{sensor.umidade?.toFixed(4)} %</span>
                            </div>
                            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                                <span className="text-slate-500">👁️ Presença</span>
                                <span className={sensor.sensor_presenca ? "text-emerald-600 font-semibold" : "text-slate-400 font-medium"}>
                                    {sensor.sensor_presenca ? "Detectada" : "Não detectada"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                                <span className="text-slate-500">🔒 Trava</span>
                                <span className={sensor.trava_seguranca ? "text-rose-500 font-semibold" : "text-emerald-600 font-semibold"}>
                                    {sensor.trava_seguranca ? "Ativada" : "Desativada"}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
