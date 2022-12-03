export function determineInWhichSquare(Field, coordX, coordY){
    /* 
    Здесь мы руководствуемся следующим. Пусть у нас есть 2 функции f(x) и f(y), сумма значений,
    возвращаемых этими функциями даёт нам номер квадрата, в котором находится объект. Пусть:
    p - количество длина стороны поля в квадратах (у нас 400/100 = 4), тогда
    */
    let p = (Field.width/Field.stepOfSplitting)
    
    function fy(y){
        return Math.floor(y/Field.stepOfSplitting) * p
    }
    function fx(x){
        return Math.floor(x/Field.stepOfSplitting)
    }
    // Также добавим ближайшие квадраты
    let currentSquare = fx(coordX) + fy(coordY)
    
        // Ближайшие квадраты для НЕграничных случаев (всего 8)
    
    return currentSquare
}
export function adjacentCells(Field, currentSquare){
    let removeEl = (...elements) =>{
        elements.forEach(elem => {
            let index = nearbySquares.indexOf(elem);
            if (index !== -1){
                nearbySquares.splice(index, 1)
            }
        })
    }
    let p = (Field.width/Field.stepOfSplitting)
    let nearbySquares = [currentSquare + p, currentSquare - p, currentSquare + 1, currentSquare - 1, currentSquare + p + 1, currentSquare + p - 1, currentSquare - p + 1, currentSquare - p - 1]
    if(currentSquare % p == 0 || currentSquare % p == p - 1 || currentSquare - p < 0 || currentSquare + p > Field.squareNumber - 1){
        if(currentSquare % p == 0){
            removeEl(currentSquare - 1, currentSquare + p - 1, currentSquare - p - 1)
        }
        if(currentSquare % p == p - 1){
            removeEl(currentSquare + 1, currentSquare + p + 1, currentSquare - p + 1)
        }
        if(currentSquare - p <= 0){
            removeEl(currentSquare - p, currentSquare - p + 1, currentSquare - p - 1)
        }
        if(currentSquare + p >= Field.squareNumber - 1){
            removeEl(currentSquare + p, currentSquare + p + 1, currentSquare + p - 1)
        }
    } // убирает те случаи, где нет соседних элементов
    return nearbySquares
}