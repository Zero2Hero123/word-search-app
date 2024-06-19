
interface Position {
    x: number;
    y: number;
}

interface ValidDirection extends Position {
    directions: Direction[]
}

interface WordGenerator {
    words: string[]
    generateGrid: () => Promise<string[][]>
}

type Params = {
    newGrid: string[][]
    length: number
    words: string[]
}

type Direction = 'right' | 'up' | 'down' | 'left' | 'right-up' | 'right-down' | 'left-up' | 'left-down'
// const newGrid = new Array<string[]>(length); 
// for(let i=0;i<length;i++) newGrid.push(new Array<string>(length)); 

const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','r','t','u','v','w','x','y','z']

const directions: Direction[] = ["right" , "up" , "down" , "left", "right-up", "right-down", "left-up", "left-down" ];

function createGenerator(words: string[],gridLength: number): WordGenerator{

    const newGrid = new Array<string[]>(gridLength); 
    for(let i=0;i<gridLength;i++) {
        newGrid[i] = new Array(10).fill('')
    };

    return {
        words: words.sort((a,b) => b.length - a.length),
        generateGrid: async () => await generate({newGrid,words,length: gridLength})
    }
}

const generate = async ({newGrid, words,length}: Params): Promise<string[][]> => {
    if(words.length == 0) return newGrid; //addRandomLetters(newGrid);

    const currWord = words[0]

    // possible coordinates for a word
    const x = Math.floor(Math.random() * length)
    const y = Math.floor(Math.random() * length)

    // Get valid direction and verify valid coordinates
    const validDirection: ValidDirection | null = await getValidDirection(newGrid,x,y,currWord,length);

    const confirmedX = validDirection?.x ?? x
    const confirmedY = validDirection?.y ?? y

    const chosenDirection: Direction | undefined = validDirection?.directions[Math.floor(Math.random()* validDirection.directions.length)]

    // debug info
    console.info({
        currWord,x,y,validDirection
    })

    await Promise.resolve(0)

    if(chosenDirection){
        
        newGrid = await placeAt(newGrid,currWord,{x: confirmedX,y: confirmedY},chosenDirection)
    } else {
        console.warn(`Unable to insert ${currWord} in grid`)
        return generate({
            newGrid,
            words: words.slice(1),
            length
        })
    }

    return await generate({
        newGrid,
        words: words.slice(1),
        length
    })
}

async function placeAt(arr: string[][],word: string,coords: Position, direction: Direction): Promise<string[][]> {
    if(word.length == 0) return arr;

    let c = word.charAt(0);

    // console.log('placeAt',c,coords)

    arr[coords.x][coords.y] = c;

    const nextCoords: Position = await getNextCoords(coords,direction);


    await Promise.resolve(0)
    return await placeAt(arr,word.substring(1),nextCoords,direction)
}

async function getNextCoords(oldCoords: Position, dir: Direction): Promise<Position> {
    switch(dir){
        case 'right': // if  there is enough space for word to fit && every index for that word is empty
            return {x: oldCoords.x,y: oldCoords.y+1}
            break;
        case 'up':
            return {x: oldCoords.x-1,y: oldCoords.y}
            break;
        case 'down':
            return {x: oldCoords.x+1,y: oldCoords.y}
            break;
        case 'left':
            return {x: oldCoords.x, y: oldCoords.y-1}
            break;
        case "right-up":
            return {x: oldCoords.x-1, y: oldCoords.y+1}
            break;
        case "right-down":
            return {x: oldCoords.x+1, y: oldCoords.y+1}
            break; 
        case "left-up":
            return {x: oldCoords.x-1, y: oldCoords.y-1}
            break;
        case "left-down":
            return {x: oldCoords.x+1, y: oldCoords.y-1}
            break;
        default:
            return {x: oldCoords.x, y: oldCoords.y }
    }

}

function addRandomLetters(grid: string[][]): string[][] {

    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid.length; j++){
            if(grid[i][j] == ''){
                let randLetter = alphabet[Math.floor(Math.random() * alphabet.length)]

                grid[i][j] = randLetter
            }
        }
    }

    return grid;

}

async function getValidDirection(newGrid: string[][],x: number,y: number,currWord: string,length: number,trials: number = 0): Promise<ValidDirection | null> {
    if(trials == 3) return null;
    // console.log({trials})
    
    const validDirections: Direction[] = directions.filter((d: Direction) => {
            
        switch(d){

            // HORIZONAL && VERTICAL
            case 'right': // if  there is enough space for word to fit && every index for that word is empty
                return (y+currWord.length-1 < newGrid.length) && newGrid[x].slice(y,y+currWord.length).every(c => c === '')
                break;
            case 'up':
                return (x-currWord.length+1 >= 0) && newGrid.slice(x-currWord.length+1,x+1).map(row => row[y]).every(c => c === '')
                break;
            case 'down':
                return (x+currWord.length-1 < newGrid.length) && newGrid.slice(x,x+currWord.length).map(row => row[y]).every(c => c === '')
                break;
            case 'left':
                return (y-currWord.length+1 >= 0) && newGrid[x].slice(y-currWord.length+1,y+1).every(c => c === '')
                break;
                

            // DIAGONALS
            case "right-up":
                return (y+currWord.length-1 < newGrid.length && x-currWord.length+1 >= 0) && getPlacesAt(newGrid,{x,y},currWord.length,d).every(c => c === '')
                break;
            case "right-down":
                return (y+currWord.length-1 < newGrid.length && x+currWord.length-1 < newGrid.length) && getPlacesAt(newGrid,{x,y},currWord.length,d).every(c => c === '')
                break;
            case "left-up":
                return (y-currWord.length+1 >= 0 && x-currWord.length+1 >= 0) && getPlacesAt(newGrid,{x,y},currWord.length,d).every(c => c === '')
                break;
            case "left-down":
                return (y-currWord.length+1 >= 0 && x+currWord.length-1 < newGrid.length) && getPlacesAt(newGrid,{x,y},currWord.length,d).every(c => c === '')
                break;
            default:
                return false;
                
        }
    })

    if(validDirections.length == 0 && trials < 3) {
        const newX = Math.floor(Math.random() * length)
        const newY = Math.floor(Math.random() * length)

        return await getValidDirection(newGrid,newX,newY,currWord,length,trials+1);
    } else if(validDirections.length == 0){
        return null
    }

    return {
        x,
        y,
        directions: validDirections
    }
    
}

function getPlacesAt(grid: string[][],pos: Position,range: number,direction: Exclude<Direction,'right' | 'left' | 'up' | 'down'>,arr: string[] = []): string[] {
    // console.log('getPlacesAt',{arr,range,direction})
    if(range === 0) return arr; // when at end of range, return array

    arr.push(grid[pos.x][pos.y])

    switch(direction){
        case "right-up":
            
            return getPlacesAt(grid,{x: pos.x-1, y: pos.y+1},range-1,direction,arr)
            break;
        case "right-down":

            return getPlacesAt(grid,{x: pos.x+1, y: pos.y+1},range-1,direction,arr)
            break;
        case "left-up":

            return getPlacesAt(grid,{x: pos.x-1, y: pos.y-1},range-1,direction,arr)
            break;
        case "left-down":

            return getPlacesAt(grid,{x: pos.x+1, y: pos.y-1},range-1,direction,arr)
            break;
    }

}


export default createGenerator;

