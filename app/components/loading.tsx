import { LoaderCircle } from 'lucide-react'
import React from 'react'

const LoadingComponent = () => {
    return (
        <section className="w-screen h-screen fixed top-0 left-0 z-100 flex justify-center items-center">
            <LoaderCircle className='animate-spin size-10' />
        </section>
    )
}

export default LoadingComponent