"use client"
import { useState, useEffect, useRef, ChangeEvent, useImperativeHandle, forwardRef } from "react"

export interface ListarUsuarioRef {
    refresh: () => void
}

const ListarUsuario = forwardRef<ListarUsuarioRef>(function ListarUsuario(_, ref) {
    const [usuarios, setUsuarios] = useState([{
        id: 0,
        nome_completo: "",
        email: "",
        senha: ""
    }])
    const [novoUsuario, setNovoUsuario] = useState({
        nome_completo: "",
        email: "",
        senha: ""
    })
    const [modalAberto, setModalAberto] = useState(false)
    const userId = useRef(0)

    const pegaInfoBackend = async () => {
        const url = "http://localhost:8080/usuarios"
        try {
            const resposta = await fetch(url)
            const resposta_json = await resposta.json()
            setUsuarios(resposta_json)
        } catch (erro) {
            console.log(erro)
        }
    }

    useImperativeHandle(ref, () => ({
        refresh: pegaInfoBackend
    }))

    const deletaUsuario = async (id: number) => {
        const url = `http://localhost:8080/usuarios/${id}`
        try {
            const resposta = await fetch(url, { method: "DELETE" })
            const resposta_json = await resposta.json()
            alert(resposta_json.msg)
            pegaInfoBackend()
        } catch (erro) {
            console.log(erro)
        }
    }

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

    const editarUsuario = async (id: number) => {
        const url = `http://localhost:8080/usuarios/${id}`
        try {
            const resposta = await fetch(url, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novoUsuario)
            })
            const resposta_json = await resposta.json()
            alert(resposta_json.msg)
            setNovoUsuario({ nome_completo: "", email: "", senha: "" })
            pegaInfoBackend()
        } catch (erro) {
            alert("Erro ao editar o usuário")
        }
    }

    useEffect(() => {
        pegaInfoBackend()
    }, [])

    return (
        <div className="w-[50vw] max-h-[88vh] overflow-y-auto bg-white text-slate-800 rounded-2xl flex flex-col gap-4 p-6 shadow-md border border-slate-100">
            <div>
                <h2 className="text-lg font-bold text-slate-700">Usuários cadastrados</h2>
                <p className="text-sm text-slate-400">Gerencie os usuários do sistema</p>
            </div>
            {usuarios.map((indice, idx) => {
                return (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-2 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">ID #{indice.id}</span>
                        </div>
                        <h3 className="text-base font-semibold text-slate-700">{indice.nome_completo}</h3>
                        <p className="text-sm text-slate-500">{indice.email}</p>
                        <p className="text-sm text-slate-400">Senha: {indice.senha}</p>
                        <div className="flex w-full justify-end gap-3 mt-1">
                            <button
                                onClick={() => { setModalAberto(true); userId.current = indice.id }}
                                className="rounded-lg px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium transition-colors cursor-pointer"
                            >
                                Editar
                            </button>
                            <button
                                onClick={() => { deletaUsuario(indice.id) }}
                                className="rounded-lg px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-sm font-medium transition-colors cursor-pointer"
                            >
                                Remover
                            </button>
                        </div>
                    </div>
                )
            })}

            {modalAberto &&
                <div className="w-screen h-screen inset-0 absolute bg-slate-900/60 flex justify-center items-center">
                    <div className="w-[50vw] h-fit rounded-2xl shadow-xl bg-white flex flex-col px-6 py-6 gap-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-700">Editar Usuário #{userId.current}</h2>
                            <p className="text-sm text-slate-400">Altere os campos desejados</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-600">Nome completo</label>
                                <input
                                    type="text"
                                    placeholder="Novo nome"
                                    value={novoUsuario.nome_completo}
                                    onChange={(e) => { pegaInfo(e, "nome") }}
                                    className="p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-600">E-mail</label>
                                <input
                                    type="email"
                                    placeholder="Novo e-mail"
                                    value={novoUsuario.email}
                                    onChange={(e) => { pegaInfo(e, "email") }}
                                    className="p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-slate-600">Senha</label>
                                <input
                                    type="password"
                                    placeholder="Nova senha"
                                    value={novoUsuario.senha}
                                    onChange={(e) => { pegaInfo(e, "senha") }}
                                    className="p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400 text-sm"
                                />
                            </div>
                            <div className="flex gap-3 justify-end w-full">
                                <button
                                    onClick={() => { editarUsuario(userId.current); setModalAberto(false) }}
                                    className="rounded-lg px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium transition-colors cursor-pointer"
                                >
                                    Salvar
                                </button>
                                <button
                                    onClick={() => { setModalAberto(false) }}
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

export default ListarUsuario
