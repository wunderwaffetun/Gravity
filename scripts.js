const rectArraySize = 4;
const circleArraySize = 3; 
const countOfFigure = 10; 
const R = 4; 
const dt = .03;
const fps = 60;
const distanceCoefficient = 1; // Нужен, чтобы подобрать нормальное ускорение к формуле a = G*m1*m2/R^2;
const G = 50
const softeningConstant = 1 //Нужна, чтобы сила не уходила в бесконечность при очень близком расстоянии 

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
    let ax = ay = az = 0;
    let currentCir = new Circle({X: centerCoordsX, Y: centerCoordsY, Z: centerCoordsZ, mass, id, diametr: 2*R, vx, vy, vz, ax, ay, az});
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
    document.querySelector(".container").style.height = `${Field.height}px`
    document.querySelector(".container").style.width = `${Field.width}px`
    document.querySelector(".container").innerHTML = ''; // очищаемся от исходных .planet
}

function createPlanet(x, y, diametr, mass, vx, vy, vz, ax, ay, az){
    planet = document.createElement("div");
    planet.classList.add('planet');
    planet.style.left = `${x}px`;
    planet.style.bottom = `${y}px`;
    planet.style.width = `${R}px`;
    planet.style.height = `${R}px`;
    console.log(mass, diametr);
    planet.setAttribute("mass", mass);
    planet.setAttribute("diametr", diametr);
    planet.setAttribute("vx", vx);
    planet.setAttribute("vy", vy);
    planet.setAttribute("vz", vz);
    planet.setAttribute("ax", ax);
    planet.setAttribute("ay", ay);
    planet.setAttribute("az", az);
    document.querySelector(".container").append(planet);
}

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

class Field{
    static width = 100*R;
    static height = 100*R; 
    static squareNumber = 16 // Разбиваем поле на области влияния
    static ArrayOfDifferentFigures = [];
    startDataOfPlanetsArray = document.querySelectorAll('.planet');
    constructor(){ 
        this.circleOpportunity = 0.5;
    }
    render(){
        createBorders()
        for(let i = 0; i < countOfFigure; i++){
            let currentCir = createNewCircle.call(this, i)
            Field.ArrayOfDifferentFigures.push(currentCir);
            currentCir.createThis();//стартовое расположение(уже в браузере)
            
        }
        for(let i = 0; i < countOfFigure; ++i){
            let forceElements = new Array();
            for(let j = 0; j < countOfFigure; j++){ // Создаём массив элеменотов без текущего, который будут изменять текущему скорость.
                if(i != j){
                    forceElements.push(Field.ArrayOfDifferentFigures[j])
                }
            }
            setInterval(() => {
                Field.ArrayOfDifferentFigures[i].move(i, forceElements)
            }, 1000/fps);
        }
    }
    static drawPlanet(objectIndex, x, y, z){
        let PlanetsDivs = document.querySelectorAll('.planet');
        let currentDrawPlanet = PlanetsDivs[objectIndex];
        currentDrawPlanet.style.left = `${x}px`;
        currentDrawPlanet.style.bottom = `${y}px`;
        reverseCoordinatesX(Field.ArrayOfDifferentFigures[objectIndex].isCrossBorderX(x), Field.ArrayOfDifferentFigures[objectIndex]) //если всё сделать одной функцией, то может улетать за границу т.к. по 2-ой координате не будет успевать проверяться
        reverseCoordinatesY(Field.ArrayOfDifferentFigures[objectIndex].isCrossBorderY(y), Field.ArrayOfDifferentFigures[objectIndex])
        currentDrawPlanet.setAttribute("vx", Field.ArrayOfDifferentFigures[objectIndex].vx);
        currentDrawPlanet.setAttribute("vy", Field.ArrayOfDifferentFigures[objectIndex].vy);
        currentDrawPlanet.setAttribute("vz", Field.ArrayOfDifferentFigures[objectIndex].vz);
        currentDrawPlanet.setAttribute("ax", Field.ArrayOfDifferentFigures[objectIndex].ax);
        currentDrawPlanet.setAttribute("ay", Field.ArrayOfDifferentFigures[objectIndex].ay);
        currentDrawPlanet.setAttribute("az", Field.ArrayOfDifferentFigures[objectIndex].az);
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
        createPlanet(this.coordX, this.coordY, this.coordZ, this.mass, this.diametr, this.vx, this.vy, this.vz, 0, 0, 0)
    }
    updatePositionVectors(){
        // if(this.id != 'Sun'){
            this.coordX += this.vx*dt;
            this.coordY += this.vy*dt;
            // this.coordZ += this.vz*dt;
        // } else {
            // this.coordX = this.coordY = this.coordZ = 50 * R; 
        // }
        
    }
    updateVelocityVectors(){
        this.vx += this.ay*dt;
        this.vy += this.ay*dt;
        // this.vz += this.az*dt;
    }
    updateAccelerationVectors(forceElements, index){
        let ax = 0; 
        let ay = 0;
        let az = 0;
        forceElements.forEach((obj, j) => {
            let dx = obj.coordX - this.coordX;
            let dy = obj.coordY - this.coordY;
            let dz = obj.coordZ - this.coordZ;
            let R = Math.sqrt(dx**2 + dy**2);
            let F = (G * obj.mass) / ( R*R + softeningConstant )
            ax += F * dx/(100*R);
            ay += F * dy/(100*R);
            // az += F * dz; 
        });
        console.log(ax, ay)
        this.ax = ax; 
        this.ay = ay;
        // this.az = az;
    }
    move(objectIndex, forceElements){
        super.move();
        this.updatePositionVectors()
        this.updateAccelerationVectors(forceElements, objectIndex)
        this.updateVelocityVectors()
        
        Field.drawPlanet(objectIndex, this.coordX, this.coordY, this.coordZ)
    }   
}

(function main(){
    field = new Field();
    field.render();
})();