"use client"
import { useState, ChangeEvent } from "react"

interface Props {
    onCriado?: () => void
}

export default function CriarUsuario({ onCriado }: Props) {
    const [novoUsuario, setNovoUsuario] = useState({
        nome_completo: "",
        email: "",
        senha: ""
    })

    const pegaInfo = (e: ChangeEvent<HTMLInputElement>, where: string) => {
        const value = e.target.value

        if (where === "nome") {
            setNovoUsuario({ ...novoUsuario, nome_completo: value })
        } else if (where === "email") {
            setNovoUsuario({ ...novoUsuario, email: value })
        } else {
            setNovoUsuario({ ...novoUsuario, senha: value })
        }
    }

    const criarUsuario = async () => {
        const url = 'http://localhost:8080/novoUsuario'
        try {
            const resposta = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novoUsuario)
            })
            const resposta_json = await resposta.json()
            console.log(resposta_json)
            alert("Usuário Criado com Sucesso!")
            setNovoUsuario({ nome_completo: "", email: "", senha: "" })
            if (onCriado) onCriado()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="w-[50vw] flex flex-col gap-5 rounded-2xl max-h-fit bg-white text-slate-800 p-6 shadow-md border border-slate-100">
            <div>
                <h2 className="text-lg font-bold text-slate-700">Novo Usuário</h2>
                <p className="text-sm text-slate-400">Preencha os dados para cadastrar</p>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-600">Nome completo</label>
                <input
                    type="text"
                    placeholder="Ex: João da Silva"
                    value={novoUsuario.nome_completo}
                    onChange={(e) => { pegaInfo(e, "nome") }}
                    className="p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-600">E-mail</label>
                <input
                    type="email"
                    placeholder="email@exemplo.com"
                    value={novoUsuario.email}
                    onChange={(e) => { pegaInfo(e, "email") }}
                    className="p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-600">Senha</label>
                <input
                    type="password"
                    placeholder="Crie uma senha"
                    value={novoUsuario.senha}
                    onChange={(e) => { pegaInfo(e, "senha") }}
                    className="p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-400 text-sm"
                />
            </div>

            <button
                onClick={criarUsuario}
                className="py-2 px-4 text-white rounded-lg bg-rose-500 hover:bg-rose-600 transition-colors font-medium cursor-pointer"
            >
                Cadastrar
            </button>
        </div>
    )
}
