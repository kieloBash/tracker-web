import Navbar from "@/app/components/navbar"

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="relative w-full min-h-screen pb-14">
            {children}
            <Navbar />
        </main>
    )
}

export default ProtectedLayout