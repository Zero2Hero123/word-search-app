import { ReactNode, Suspense } from "react";


export default function Layout({children}: {children: ReactNode}){


    return <Suspense fallback={<h1>LOADING...</h1>}>
        {children}
    </Suspense>
}