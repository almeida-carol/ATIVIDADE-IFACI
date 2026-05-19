import Link from "next/link"

export default function Header() {
    return (
        <header className="w-full bg-slate-800 text-white px-6 py-4 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
                <span className="text-xl">📡</span>
                <h1 className="text-xl font-bold tracking-tight">Painel IoT</h1>
            </div>
            <nav className="flex gap-2">
                <Link href="/" className="px-4 py-2 rounded-lg hover:bg-slate-700 text-slate-200 font-medium transition-colors">
                    Usuários
                </Link>
                <Link href="/equipamentos" className="px-4 py-2 rounded-lg hover:bg-slate-700 text-slate-200 font-medium transition-colors">
                    Equipamentos
                </Link>
            </nav>
        </header>
    )
}