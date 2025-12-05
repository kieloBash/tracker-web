'use client'
import { Button } from "@/components/ui/button"
import { ChartBarIncreasingIcon, CreditCardIcon, HandshakeIcon, HomeIcon, NotepadTextIcon, PlusIcon, SettingsIcon } from "lucide-react"
import { useRouter } from "next/navigation"

const Navbar = () => {
    const router = useRouter();

    return (
        <nav className='flex justify-center items-center gap-2 fixed bottom-0 left-0 w-screen px-2 py-1.5 bg-background z-10 h-14'>
            <Button type="button" onClick={() => {
                router.push("/home")
            }} variant={"ghost"} size={"icon"}><HomeIcon /></Button>
            <Button type="button" onClick={() => {
                router.push("/transactions")
            }} variant={"ghost"} size={"icon"}><CreditCardIcon /></Button>
            <Button type="button" onClick={() => {
                router.push("/budget")
            }} variant={"ghost"} size={"icon"}><NotepadTextIcon /></Button>
            <Button type="button" onClick={() => {
                router.push("/calculator")
            }} variant={"default"} size={"icon-lg"}><PlusIcon /></Button>
            <Button type="button" onClick={() => {
                router.push("/tracker")
            }} variant={"ghost"} size={"icon"}><ChartBarIncreasingIcon /></Button>
            <Button type="button" onClick={() => {
                router.push("/party")
            }} variant={"ghost"} size={"icon"}><HandshakeIcon /></Button>
            <Button type="button" onClick={() => {
                router.push("/settings")
            }} variant={"ghost"} size={"icon"}><SettingsIcon /></Button>
        </nav>
    )
}

export default Navbar