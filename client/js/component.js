var Component = React.createClass({
    getInitialState(){
        return store.getState();
    },

    componentDidMount() {
        emit("GET:FULL:DATA");
        store.addChangeListener(this.update);
    },

    update(){
        this.setState(store.getState());
    },

    updateCanvas() {
        //короткие переменные
        var fieldWidth = this.state.viewParams.fullWidth-this.state.viewParams.rightPole;
        var fieldHeigh = this.state.viewParams.fullHeigh-this.state.viewParams.bottomPole;
        var data = this.state.data;
        var grid = this.state.viewParams.gridSize;
        var vMax = this.state.viewParams.maxValue;
        var vMin = this.state.viewParams.minValue;
        var valuePixels = fieldHeigh/(vMax-vMin);


        const ctx = this.refs.canvas.getContext('2d');
        ctx.clearRect(0,0,this.state.viewParams.fullWidth,this.state.viewParams.fullHeigh);

        //сетка
        for (var x = 0; x < fieldWidth; x += grid) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, fieldHeigh);
        }
        for (var y = 0; y < fieldHeigh; y += grid) {
            ctx.moveTo(0, y);
            ctx.lineTo(fieldWidth, y);
        }
        ctx.strokeStyle = "#eee";
        ctx.stroke();
        ctx.closePath();

        //подписи справа
        for (var i=1; i<Math.round(fieldHeigh/grid); i++){
            ctx.fillText(parseFloat(vMax-i*grid/valuePixels).toFixed(5), fieldWidth+5, i*grid+grid/5);
        }

        //Граф
        for (i=0;i<this.state.data.length;i++) {
            ctx.beginPath();
            var O = data[i].Open;
            var C = data[i].Close;
            var H = data[i].High;
            var L = data[i].Low;
            var date = new Date(data[i].Time);

            ctx.moveTo(fieldWidth-grid*(i+1), (vMax - H) * valuePixels);
            ctx.lineTo(fieldWidth-grid*(i+1), (vMax - L) * valuePixels);

            ctx.moveTo(fieldWidth-grid*(i+1), (vMax - O) * valuePixels);
            ctx.lineTo(fieldWidth-grid*(i+1) - grid / 3, (vMax - O) * valuePixels);

            ctx.moveTo(fieldWidth-grid*(i+1), (vMax - C) * valuePixels);
            ctx.lineTo(fieldWidth-grid*(i+1) + grid / 3, (vMax - C) * valuePixels);
            ctx.closePath();
            ctx.strokeStyle = '#0dd000';
            ctx.stroke();

            //подпись снизу
            ctx.beginPath();
            var xt = fieldWidth-grid*(i+1);
            var yt = fieldHeigh+5;
            ctx.save();
            ctx.translate(xt, yt);
            ctx.rotate(-Math.PI / 2);
            ctx.textAlign = 'right';
            var month = '';
            switch (date.getMonth()){
                case 0:
                    month='JAN';
                    break;
                case 1:
                    month='FEB';
                    break;
                case 2:
                    month='MAR';
                    break;
                case 3:
                    month='APR';
                    break;
                case 4:
                    month='MAY';
                    break;
                case 5:
                    month='JUN';
                    break;
                case 6:
                    month='JUL';
                    break;
                case 7:
                    month='AUG';
                    break;
                case 8:
                    month='SEP';
                    break;
                case 9:
                    month='OCT';
                    break;
                case 10:
                    month='NOW';
                    break;
                case 11:
                    month='DEC';
                    break;
                default:
            }
            ctx.fillText(date.getDate()+' '+ month+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds(), 0, 3);
            ctx.restore();
            ctx.closePath();
            ctx.strokeStyle = '#0dd000';
            ctx.stroke();
        }
        console.log("canvas updated!");
    },

    _scrollLeft: function(){
        emit("SCROLL:LEFT");
    },

    _scrollRight: function(){
        emit("SCROLL:RIGHT");
    },

    render: function(){
        if (this.state.data != "initial") {this.updateCanvas();}
        return(
            <div>
                <div>
                    <canvas ref="canvas" width={this.state.viewParams.fullWidth} height={this.state.viewParams.fullHeigh}>
                    </canvas>
                </div>
                <button disabled={this.state.data.length < (this.state.viewParams.fullWidth-this.state.viewParams.rightPole)/this.state.viewParams.gridSize-1}onClick={this._scrollLeft}>Влево</button>
                <button disabled={!this.state.from} onClick={this._scrollRight}>Вправо</button>
            </div>
        )
    }
});
ReactDOM.render(<Component/>, document.getElementById("app"));

