import WordSearchGrid from "@/components/WordSearchGrid"

async function getWords() {
    const res = await fetch('http://localhost:3000/api/words')

    return res.json()
}

export default async function Game(){

    const words = await getWords();


    const testLetters = [
        ['a','b','c','d','e','f','g','h','i','j'],
        ['k','l','m','n','o','p','q','r','r','t'],
        ['u','v','w','x','y','z']
    ]

    return (
        <>
        <header >
            <h1 className="text-center text-6xl text-blue-400 font-bold">Word Search</h1>
        </header>
            <main className='grow flex flex-col justify-center items-center'>
                <section className="grow bg-red-100 flex justify-center items-center">
                    <WordSearchGrid length={10} letters={testLetters}/>
                </section>
                <section className="grow-[2] border w-[50%] flex flex-col justify-center items-center">
                    {
                        words.data.map((word: string) => <p className='flex flex-wrap justify-center text-gray-500 text-2xl' >{word.toUpperCase()}</p>)
                    }
                </section>
            </main>
        </>
    )
}