var store = function(){	
	console.log("Функция store - this: ");
	console.log(this);
	listen ("GET:FULL:DATA",() => {		
		var socket = io('http://localhost');
		socket.on('connection done', function(data){
			store.fullData = data;
			console.log (data);
			store.notify();
		});
	});

	listen ("SCROLL:LEFT",() => {
		store.canvasState.from += 5;
		console.log("canvasState.from = "+store.canvasState.from);
		store.notify();
	});

	listen ("SCROLL:RIGHT",() => {
		store.canvasState.from -= 5;
		console.log("canvasState.from = "+store.canvasState.from);
		store.notify();
	});
};

store.fullData = [];

store.canvasState = {
	data: "initial",
	from: 0, // с какого по счету значения передавать данные в компонент
	viewParams: {
		fullWidth: 850,
		fullHeigh: 500,
		rightPole: 50,
		bottomPole: 100,
		gridSize: 20,
		maxValue: 1.089,
		minValue: 1.085
	}
};
store.changeListeners = [];

store.getState = function(){
	console.log("Обращение к store.getState. canvasState = ");
	console.log(this.canvasState);
	if (this.fullData.length != 0) {
		//numValues - количество значений, передаваемых в canvas
		var numValues = Math.round((this.canvasState.viewParams.fullWidth-this.canvasState.viewParams.rightPole)/this.canvasState.viewParams.gridSize)-1;
		this.canvasState.data = [];
		for (var i = 0; i< numValues; i++){
			if (this.fullData[i+this.canvasState.from]) {
				this.canvasState.data[i] = this.fullData[i + this.canvasState.from];
			}
			else{
				break;
			}
		}
	}
	return this.canvasState;
}

store.addChangeListener = function(fn){
	this.changeListeners.push(fn);
};

store.notify = function(){
	this.changeListeners.forEach((fn) => fn());
};

store();