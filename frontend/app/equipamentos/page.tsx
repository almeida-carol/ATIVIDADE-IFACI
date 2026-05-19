"use client"
import { useRef } from "react"
import CriarEquipamento from "../components/CriarEquipamentos"
import Header from "../components/Header"
import ListarEquipamentos, { ListarEquipamentosRef } from "../components/ListarEquipamentos"

export default function Equipamentos() {
    const listarRef = useRef<ListarEquipamentosRef>(null)

    return (
        <div className="min-h-screen bg-slate-100">
            <Header />
            <div className="flex gap-4 p-6">
                <CriarEquipamento onCriado={() => listarRef.current?.refresh()} />
                <ListarEquipamentos ref={listarRef} />
            </div>
        </div>
    )
}
