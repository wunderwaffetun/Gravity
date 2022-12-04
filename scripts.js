let countOfFigure = document.querySelectorAll('.planet').length // Мы можем вставить фигуры в ручную в html или сгенерировать с помощью createRandomPlanets нужное количество 
const R = 4; 
const dt = .03;
const numberOfPlanets = 10
const fps = 60;
const DebaevskyRadius = 200*R // На каком расстоянии планеты перестанут взаимодействовать
const G = 10
const softeningConstant = 10000 //Нужна, чтобы сила не уходила в бесконечность при очень близком расстоянии \
let alpha = 0 // угол движения Солнца по окружности (Солнце здесь независимо)
class Circle{
    constructor(params){
        let {X, Y, diametr, mass, id, vx, vy, ax, ay} = params
        this.coordX = X; this.coordY = Y; this.diametr = diametr;
        this.mass = Number(mass); this.id = id; this.vx = vx; 
        this.vy = vy; this.ax = ax; this.ay = ay; 
    }
    get getX(){
        return this.coordX; 
    }
    get getY(){
        return this.coordY;
    }
    createThisHTML(){
        createPlanet(this.coordX, this.coordY, this.id, this.mass, this.diametr, this.vx, this.vy,  0, 0)
    }
    updatePositionVectors(){
        
        if(this.id != 'Sun'){
            this.coordX += this.vx*dt;
            this.coordY += this.vy*dt;
        } else{
            this.coordX =50*R + 50*R * Math.cos(alpha* dt)
            this.coordY =50*R + 50*R * Math.sin(alpha* dt)
        }
    }
    updateVelocityVectors(){
        this.vx += this.ax*dt;
        this.vy += this.ay*dt;
    }
    updateAccelerationVectors(index){
        let ax = 0; 
        let ay = 0;
        for(let j = 0; j < countOfFigure; j++){ // элеменоты, который будут изменять текущему скорость.
            if(index != j){ // сам на себя не влияет
                let currentCir = Field.ArrayOfDifferentFigures[index]
                let influenceElem = Field.ArrayOfDifferentFigures[j]
                let dx = influenceElem.coordX - currentCir.coordX;
                let dy = influenceElem.coordY - currentCir.coordY;
                let R2 = dx*dx + dy*dy;
                if(R2 < DebaevskyRadius**2){
                    let F = (G * influenceElem.mass) / ( R2 * Math.sqrt(softeningConstant + R2) )
                    ax += F * dx/(100*R);
                    ay += F * dy/(100*R);
                }
            }
        }
        this.ax = ax; 
        this.ay = ay;
    }
    move(objectIndex){
        this.updateAccelerationVectors(objectIndex)
        this.updateVelocityVectors()
        this.updatePositionVectors()
        Field.drawPlanet(objectIndex, this.coordX, this.coordY)
    } 
}
class Field{
    static width = 100*R;
    static height = 100*R;
    static ArrayOfDifferentFigures = [];
    constructor(){ 
        this.startDataOfPlanetsArray = document.querySelectorAll('.planet');
    }
    render(){
        preFunction()
        for(let i = 0; i < countOfFigure; i++){
            let currentCir = createNewCircle.call(this, i)
            Field.ArrayOfDifferentFigures.push(currentCir);
            currentCir.createThisHTML();//стартовое расположение(уже в браузере)
        }
        setInterval(() => {
            alpha += 0.02
            updateCadr()
        }, 1000/fps);
    }
    static drawPlanet(objectIndex, x, y){
        let PlanetsDivs = document.querySelectorAll('.planet');
        let currentDrawPlanet = PlanetsDivs[objectIndex];
        currentDrawPlanet.style.left = `${x}px`;
        currentDrawPlanet.style.bottom = `${y}px`;
        let curFigure = Field.ArrayOfDifferentFigures[objectIndex]
        currentDrawPlanet.setAttribute("vx", curFigure.vx);
        currentDrawPlanet.setAttribute("vy", curFigure.vy);
        currentDrawPlanet.setAttribute("ax", curFigure.ax);
        currentDrawPlanet.setAttribute("ay", curFigure.ay);
        
    }
}

function preFunction(){
    document.querySelector(".container").style.height = `${Field.height}px`
    document.querySelector(".container").style.width = `${Field.width}px`
    document.querySelector(".container").innerHTML = ''; // очищаемся от исходных .planet
}

function createNewCircle(index){
    let {centerCoordsX, centerCoordsY, vx, vy} = createRandomValues();
    let mass = this.startDataOfPlanetsArray[index].getAttribute("mass");
    let id = this.startDataOfPlanetsArray[index].getAttribute("id");
    let ax, ay = 0
    let currentCir = new Circle({X: centerCoordsX, Y: centerCoordsY, mass, id, diametr: 2*R, vx, vy, ax, ay});
    return currentCir;
}

function createRandomValues(){
    let centerCoordsX = spawnCoords(),
        centerCoordsY = spawnCoords()
    let vx = spawnVelocity(),
        vy = spawnVelocity()
    return {centerCoordsX, centerCoordsY, vx, vy}; 
}

function spawnCoords(){
    return Math.round(5*R + Math.random() * (95 * R));
}

function spawnVelocity(){
    return Math.round(-5 + Math.random() * 10);
}

function updateCadr(){
    for(let i = 0; i < countOfFigure; ++i){
        Field.ArrayOfDifferentFigures[i].move(i)
    }
}

function createPlanet(x, y, id, mass, diametr, vx, vy, ax, ay){
    let planet = document.createElement("div");
    planet.classList.add('planet');
    planet.style.left = `${x}px`;
    planet.style.bottom = `${y}px`;
    planet.style.width = `${R}px`;
    planet.style.height = `${R}px`;
    planet.setAttribute("id", id); // свернуть это можно только если создать отдельный массив [id, ...] не делал для наглядности
    planet.setAttribute("mass", mass);
    planet.setAttribute("diametr", diametr);
    planet.setAttribute("vx", vx);
    planet.setAttribute("vy", vy);
    planet.setAttribute("ax", ax);
    planet.setAttribute("ay", ay);
    document.querySelector(".container").append(planet);
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

(function main(){
    createRandomPlanets(numberOfPlanets)
    let field = new Field();
    field.render();
})();