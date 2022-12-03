function reverseCoordinatesX(whatBorder, obj){
    switch(whatBorder){
        case "rightBorder":
            obj.vx = -obj.vx;
            break;
        case "leftBorder":
            obj.vx = -obj.vx;
            break;
    }
}

function reverseCoordinatesY(whatBorder, obj){
    switch(whatBorder){
        case "topBorder":
            obj.vy = -obj.vy;
            break;
        case "bottomBorder":
            obj.vy = -obj.vy;
            break;
    }
}


export {reverseCoordinatesX, reverseCoordinatesY};