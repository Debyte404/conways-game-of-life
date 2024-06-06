
class Cell {
    constructor(alive, x, y) {
        this.alive = alive;
        this.x = x;
        this.y = y;
        this.element = document.createElement('div');
        this.element.className = 'grid-item';
        // this.element.draggable = false;
        if (this.alive) {
            this.element.classList.add('alive');
        }
        this.updatePosition();
        this.addEventListeners();
    }

    updatePosition() {
        this.element.style.gridColumnStart = this.x + 1;
        this.element.style.gridRowStart = this.y + 1;
    }

    toggleState() {
        this.alive = !this.alive;
        this.element.classList.toggle('alive');
    }

    deactivate() {
        this.alive = false;
        this.element.classList.remove('alive');
    }
    activate() {
        this.alive = true;
        this.element.classList.add('alive');
    }

    addEventListeners() {
        this.element.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // Left mouse button
                this.toggleState();
                isMouseDown = true;
            }
        });

        this.element.addEventListener('mouseover', (e) => {
            if (isMouseDown) {
                this.toggleState();
            }
        });

        this.element.addEventListener('mouseup', (e) => {
            if (e.button === 0) { // Left mouse button
                isMouseDown = false;
            }
        });

        // Prevent dragging
        this.element.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });

        // Prevent default behavior on mousedown
        this.element.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });
    }
}

const floatingPanel = document.getElementById('floatingPanel');
const minimizeButton = document.getElementById('minimizeButton');
const clearButton = document.getElementById('clearButton');
const startButton = document.getElementById('startButton');

let isMouseDown = false;

document.addEventListener('mouseup', () => {
    isMouseDown = false;
});


const grid = document.getElementById('grid');
var r = getComputedStyle(document.querySelector(':root'));
// Function to add a cell to the grid
function addCell(alive, x, y) {
    const cell = new Cell(alive, x, y);
    grid.appendChild(cell.element);
    return cell;
}

// Calculate the number of rows and columns that fit in the viewport
const mar = parseInt(r.getPropertyValue('--margin2x'));
const divy = parseInt(r.getPropertyValue('--gap')) + parseInt(r.getPropertyValue('--cell_size'));
const numRows = Math.floor((window.innerHeight - mar) / divy); // 5px cell height + 3px gap
const numCols = Math.floor((window.innerWidth - mar) / divy); // 5px cell width + 3px gap

console.log(numRows, numCols);

// Fill the grid with cells

const cells = [];
for (let y = 0; y < numRows; y++) {
    let row = []
    for (let x = 0; x < numCols; x++) {
        // cells.push(addCell(false, x, y));
        row.push(addCell(false, x, y));
    }
    cells.push(row);
}

minimizeButton.addEventListener('click', () => {
    if (floatingPanel.classList.contains('minimized')) {
        floatingPanel.classList.remove('minimized');
        minimizeButton.textContent = '>';
    } else {
        floatingPanel.classList.add('minimized');
        minimizeButton.textContent = '<';
    }
});

// Clear button functionality
clearButton.addEventListener('click', () => {
    cells.forEach(row => 
        row.forEach(cell => cell.deactivate()));
});


// console.log(cells);

// console.log(cells[0][0])
// cells[0][0].activate();
// cells[10][10].activate();
// console.log(cells[10][5].x,cells[10][5].y)


var started

started=false;

let cellhieght = cells.length;
let cellwidth = cells[0].length;

startButton.addEventListener('click', () => {
    // console.log('Started')
    // next_frame()
    
    let frame;
    if (started) {
        
        clearInterval(frame);
        startButton.textContent = 'Start';
    }
    else{
        frame = setInterval(next_frame,200);
        startButton.textContent = 'Stop';
    }

    started = !started;
});

function next_frame() {
    if (started === true) {
        
        const cell_to_remove = []
        const cell_to_birth = []

        cells.forEach(row => {
            row.forEach(cell => {
                // if (Math.random() > 0.5) {
                //     cell.activate();
                // }
                // else{
                //     cell.deactivate();
                // }
                let x = cell.x;
                let y = cell.y;
                // console.log(x,y)
                jup = y-1
                jmid = y
                jdown = y+1

                ileft = x-1
                imid = x
                iright = x+1

                if(jup < 0){
                    jup = y;
                }
                if(ileft < 0){
                    ileft = x;
                }
                if(jdown > (cellhieght-1)){
                    jdown = y;
                }
                if(iright > (cellwidth-1)){
                    iright = x;
                }
                
                let neighbors = [cells[jup][ileft],cells[jup][imid],cells[jup][iright],
                                   cells[jmid][ileft],cells[jmid][iright],
                                   cells[jdown][ileft],cells[jdown][imid],cells[jdown][iright]];
                // const neighbors = [cells[y-1][x-1],cells[y-1][x],cells[y-1][x+1],
                //                    cells[y][x-1],cells[y][x+1],
                //                    cells[y+1][x-1],cells[y+1][x],cells[y+1][x+1]];
                // console.log(neighbors)
                // neighbors = new Set(neighbors)
                let alive_neighbors = 0;
                // if (x==15 & y==10){

                // }
                neighbors.forEach(neighbor =>{
                    if (neighbor.alive){
                        alive_neighbors += 1;
                    }
                    // else{
                    //     neighbor.activate()
                    // }
                })

                // console.log(alive_neighbors)

                //kill and overpopulation
                if (cell.alive){

                    if(alive_neighbors < 2){
                        // cell.deactivate();
                        cell_to_remove.push(cell);
                    }
                    
                    else if(alive_neighbors == 2 || alive_neighbors == 3){
                        // cell.activate();
                        cell_to_birth.push(cell);
                    }

                    else if(alive_neighbors > 3){
                        // cell.deactivate();
                        cell_to_remove.push(cell);
                    }

                    
                    
                }
                //birth
                else{
                    if(alive_neighbors == 3){
                        // cell.activate();
                        cell_to_birth.push(cell);
                    }

                    else{
                        // cell.deactivate();
                        cell_to_remove.push(cell);
                    }
                }


            });
        });

        cell_to_birth.forEach(ceel =>{
            ceel.activate();
        })

        cell_to_remove.forEach(ceelr =>{
            ceelr.deactivate();
        })

    }
    // console.log("yup dude")
}

//rules 
/*
Any cell that is alive with fewer than two neighbors (adjacent square cells that are themselves alive) dies; done
Any cell that is alive with two or three neighbors lives on to the next generation, i.e., t=n+1; done
Any cell that is alive with greater than three neighbors dies; done
Any cell that is dead with precisely three neighbors becomes alive; done 
All other dead cells stay dead.
*/

// setInterval(next_frame,1000);

// setInterval (next_frame,1000);