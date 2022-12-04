import {reverseCoordinatesX, reverseCoordinatesY} from './border.js'
import {determineInWhichSquare, adjacentCells} from './determineInWhichSquare.js'

let countOfFigure = document.querySelectorAll('.planet').length // Мы можем вставить фигуры в ручную в html или сгенерировать с помощью createRandomPlanets нужное количество 
const R = 4; 
const dt = .5;
const fps = 60;
const G = 10
const softeningConstant = 10000 //Нужна, чтобы сила не уходила в бесконечность при очень близком расстоянии 
const makeBorder = false
const DebaevskyRadius = false // Включить оптимизацию или выключить 


function refillingSquare(){
    Field.ArrayOfSquares.forEach(square => square.figures = []) // полностью сбрасываем все местоположения
    Field.ArrayOfSquares.forEach((square) => {
        for(let i = 0; i < countOfFigure; i++){ //Первичное заполнение клеток поля
            let currentNumberSquare = determineInWhichSquare(Field, Field.ArrayOfDifferentFigures[i].coordX, Field.ArrayOfDifferentFigures[i].coordY)
            if(square.num == currentNumberSquare){
                square.appendFigure(Field.ArrayOfDifferentFigures[i])
            }
            
        }
    })
}

function standartRun(){
    for(let i = 0; i < countOfFigure; ++i){
        let forceElements = new Array(); // те фигуры на которые влияют текущий объект
        for(let j = 0; j < countOfFigure; j++){ // Создаём массив элеменотов без текущего, который будут изменять текущему скорость.
            if(i != j){
                forceElements.push(Field.ArrayOfDifferentFigures[j])
            }
        }
        Field.ArrayOfDifferentFigures[i].move(i, forceElements)
    }

}


function updateCadr(){
    
    if(DebaevskyRadius){
        refillingSquare()
        Field.ArrayOfSquares.forEach(square => {
            let figs = square.figures
            if(figs.length != 0){    
                for(let i = 0; i < figs.length; i++){
                    let forceElements = new Array()
                    for(let j = 0; j < figs.length; j++){ //Заполняем forceElements объектами из данного квадрата
                        if(i != j){
                            forceElements.push(figs[j])
                        }
                    }
                    adjacentCells(Field, square.num).forEach(squareNum =>{ // Заполняем forceElements соседними, forceEl - массив объектов, которые влияют на данный
                        for(let square1 of Field.ArrayOfSquares){
                            if(square1.num == squareNum){
                                for(let j=0; j<square1.figures.length; j++){
                                    forceElements.push(square1.figures[j])
                                }
                            }
                        }
                    })
                    let currentIndex = Field.ArrayOfDifferentFigures.indexOf(figs[i])
                    if(~currentIndex){
                        Field.ArrayOfDifferentFigures[currentIndex].move(currentIndex, forceElements)
                    }
                }
            }
        })
        
    } else{
        standartRun()
    }
}
class Square { //Часть поля, которая принимает свой номер ПРИ СОЗДАНИИ и при смене кадров переопределяет figures - список элементов, содержащихся в нём 
    constructor(number){
        this.number = number;
        this.figures = []
    }
    get num(){
        return this.number
    }
    appendFigure(value){
        this.figures.push(value)
    }
    getFigures(){
        return this.figures
    }
    clearFig(){
        this.figures = []
    }
}

function splittingIntoSquares(){
    for(let i=0; i < Field.squareNumber; i++){
        Field.ArrayOfSquares.push(new Square(i))
    }
}



function createRandomPlanets(countOfPlanets){
    let i = 0; 
    while (i < countOfPlanets){
        let planet = document.createElement("div")
        planet.classList.add('planet')
        planet.setAttribute('mass', Math.round(Math.random() * 1000 + 500))
        planet.setAttribute('id', "")
        document.querySelector(".container").append(planet)
        i++;
        countOfFigure++;
    }
}



function spawnCoords(){
    return Math.round(5*R + Math.random() * (95 * R));
}

function spawnVelocity(){
    return Math.round(-5 + Math.random() * 10);
}

function createNewCircle(index){
    let {centerCoordsX, centerCoordsY, centerCoordsZ, vx, vy, vz} = createRandomValues();
    let mass = this.startDataOfPlanetsArray[index].getAttribute("mass");
    let id = this.startDataOfPlanetsArray[index].getAttribute("id");
    let ax, ay = 0
    let currentCir = new Circle({X: centerCoordsX, Y: centerCoordsY, Z: centerCoordsZ, mass, id, diametr: 2*R, vx, vy, ax, ay});
    return currentCir;
}

function createRandomValues(){
    let centerCoordsX = spawnCoords(),
        centerCoordsY = spawnCoords(),        
        centerCoordsZ = spawnCoords();
    let vx = spawnVelocity(),
        vy = spawnVelocity(),
        vz = spawnVelocity();
    return {centerCoordsX, centerCoordsY, centerCoordsZ, vx, vy, vz}; 
}

function createBorders(){
    if(!makeBorder){
        document.querySelector(".container").style.border = "0px solid black";
    }
    document.querySelector(".container").style.height = `${Field.height}px`
    document.querySelector(".container").style.width = `${Field.width}px`
    document.querySelector(".container").innerHTML = ''; // очищаемся от исходных .planet
}

function createPlanet(x, y, id, diametr, mass, vx, vy, ax, ay){
    let planet = document.createElement("div");
    planet.classList.add('planet');
    planet.style.left = `${x}px`;
    planet.style.bottom = `${y}px`;
    planet.style.width = `${R}px`;
    planet.style.height = `${R}px`;
    planet.setAttribute("id", id);
    planet.setAttribute("mass", mass);
    planet.setAttribute("diametr", diametr);
    planet.setAttribute("vx", vx);
    planet.setAttribute("vy", vy);
    planet.setAttribute("ax", ax);
    planet.setAttribute("ay", ay);
    document.querySelector(".container").append(planet);
}

class Field{
    static width = 100*R;
    static height = 100*R; 
    static squareNumber = 16 // Разбиваем поле на области влияния
    static ArrayOfDifferentFigures = [];
    static ArrayOfSquares = [] // Дебаевский радиуc, все квадраты, которые будут содержать объекты
    static stepOfSplitting = 100*R*R / Field.squareNumber // ширина и высота миниквадратов
    constructor(){ 
        this.startDataOfPlanetsArray = document.querySelectorAll('.planet');
    }
    render(){
        createBorders()
        splittingIntoSquares() // разбиваем поле на квадраты 
        for(let i = 0; i < countOfFigure; i++){
            let currentCir = createNewCircle.call(this, i)
            Field.ArrayOfDifferentFigures.push(currentCir);
            currentCir.createThis();//стартовое расположение(уже в браузере)
        }
        refillingSquare()
        setInterval(() => {
            updateCadr()
        }, 1000/fps);
    }
    
    static drawPlanet(objectIndex, x, y){
        let PlanetsDivs = document.querySelectorAll('.planet');
        let currentDrawPlanet = PlanetsDivs[objectIndex];
        currentDrawPlanet.style.left = `${x}px`;
        currentDrawPlanet.style.bottom = `${y}px`;
        let curFigure = Field.ArrayOfDifferentFigures[objectIndex]
        if(makeBorder){
            reverseCoordinatesX(curFigure.isCrossBorderX(x), curFigure) //если всё сделать одной функцией, то может улетать за границу т.к. по 2-ой координате не будет успевать проверяться
            reverseCoordinatesY(curFigure.isCrossBorderY(y), curFigure)
        }
        currentDrawPlanet.setAttribute("vx", curFigure.vx);
        currentDrawPlanet.setAttribute("vy", curFigure.vy);
        currentDrawPlanet.setAttribute("ax", curFigure.ax);
        currentDrawPlanet.setAttribute("ay", curFigure.ay);
        
    }
}

class Figure{
    constructor({X, Y, Z}){
        this.coordX = X; this.coordY = Y; this.coordZ = Z;
    };
    move(){};
    get getX(){
        return this.coordX; 
    }
    get getY(){
        return this.coordY;
    }
    get getZ(){
        return this.coordZ;
    }
    isCrossBorderX(currentX){
        if(currentX + 1*R > 100 * R){
            return 'rightBorder'
        }
        if(currentX <= 0){
            return 'leftBorder'
        }
    }
    isCrossBorderY(currentY){
        if(currentY + 1*R > 100 * R){
            return 'topBorder'
        }
        if(currentY <= 0){
            return 'bottomBorder'
        }
    }
};


class Circle extends Figure{
    constructor(params){
        super(params); 
        let {mass, id, diametr, vx, vy, vz, ax, ay, az} = params;
        this.diametr = diametr; this.mass = Number(mass); this.id = id, this.vx = vx; this.vy = vy, this.vz = vz, this.ax = ax, this.ay = ay, this.az = az;
    };
    
    get type(){
        return 'Circle';
    }
    createThis(){
        createPlanet(this.coordX, this.coordY, this.id, this.coordZ, this.mass, this.diametr, this.vx, this.vy, this.vz, 0, 0, 0)
    }
    
    updatePositionVectors(){
        
        if(this.id != 'Sun'){
            this.coordX += this.vx*dt;
            this.coordY += this.vy*dt;
            console.log('hello')
        } else{
            this.coordX = 50*R; 
            this.coordY = 50*R;
        }
    }
    updateVelocityVectors(){
        this.vx += this.ax*dt;
        this.vy += this.ay*dt;
    }
    updateAccelerationVectors(forceElements, index){
        console.log(forceElements)
        let ax = 0; 
        let ay = 0;
        forceElements.forEach((obj, j) => {
            let dx = obj.coordX - this.coordX;
            let dy = obj.coordY - this.coordY;
            let R2 = dx*dx + dy*dy;
            let F = (G * obj.mass) / ( R2 * Math.sqrt(softeningConstant + R2) )
            ax += F * dx/(100*R);
            ay += F * dy/(100*R);
        });
        this.ax = ax; 
        this.ay = ay;
    
    }
    move(objectIndex, forceElements){
        super.move();
        this.updateAccelerationVectors(forceElements, objectIndex)
        this.updateVelocityVectors()
        this.updatePositionVectors()
        Field.drawPlanet(objectIndex, this.coordX, this.coordY, this.coordZ)
    }   
}

(function main(){
    createRandomPlanets(10)
    let field = new Field();
    field.render();
})();