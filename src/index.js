import ReactDom from 'react-dom';
import React from 'react';
import './style.css';
import { toHaveStyle } from '@testing-library/jest-dom/dist/matchers';

function getgameStatus(squares){
    let winCombs=[
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6], 
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];
    for(let i=0;i<winCombs.length;i++){
        let wincomb=winCombs[i];
        let s1=wincomb[0];
        let s2=wincomb[1];
        let s3=wincomb[2];

        if(squares[s1]!=null&&squares[s1]==squares[s2]&&squares[s2]==squares[s3]){
            return squares[s1];
        }
    }
    return null;
}

class Display extends React.Component{
      moveHistory(i){
        this.props.handlerForHistory(i);
      }
    render(){
        let gametitle=null;
        if(this.props.gameStatus!=null){
            if(this.props.gameStatus=="Game Draw"){
                gametitle=this.props.gameStatus
            }else{
            gametitle=this.props.gameStatus+"  Win";
            }
        }else{
            if(this.props.stepNumber%2==0){
                gametitle="Next Move for X"
            }else{
                gametitle="Next Move for O"
            }
        }
         let buttons=[];
         for(let i=0;i<=this.props.stepNumber;i++){
            let button=null;
            if(i==0){
                button=(<button onClick={()=>this.moveHistory(i)}>Go to Start</button>)
            }else{
                button=(<button onClick={()=>this.moveHistory(i)}>Go to Step Number {i}</button>)
            }
            buttons.push(button);

         }
        return(
            <div className='display'>
                <div className='title'>
                       {gametitle}       
                </div>
                <div className='content'>
                    <div className='history'>
                        
                        {buttons}
                        
                    </div>
                </div>
            </div>
        );
    }
}
class Board extends React.Component{

    handleBoxClick(i){
        this.props.handlerForBoxClick(i);
    }

    renderSquare(i){
        return(
            <button onClick={()=> this.handleBoxClick(i)} >{this.props.boxes[i]==null?"":this.props.boxes[i]}</button>
        )
    }

    render(){

        return(
            <div className='board'>
                <div className='title'>
                    Tic Tac Toe
                </div>
                <div className='content'>
                    <div className='ttt'>
                         <div className='row'>

                            {this.renderSquare(0)}     {/* render square function is called by passing the argument */}
                            {this.renderSquare(1)}
                            {this.renderSquare(2)}

                         </div>
                         <div className='row'>

                            {this.renderSquare(3)}
                            {this.renderSquare(4)}
                            {this.renderSquare(5)}

                            </div>

                          <div className='row'>

                            {this.renderSquare(6)}
                            {this.renderSquare(7)}
                            {this.renderSquare(8)}

                          </div>

                    </div>
                </div>
            </div>
        );
    }
}

class TTT extends React.Component {

   
    constructor(props){
        super(props);
        this.state={
            history:[
                [null,null,null,null,null,null,null,null,null],
            ],
            StepNumber:0,
            gameStatus:null,
        }
    }
     handleSquareClick(i){
        let oldHistory=this.state.history.slice();
        console.log(oldHistory);
        let lastStateofSquares=oldHistory[oldHistory.length-1].slice();
        // {console.log(squares);}
        if(lastStateofSquares[i]!=null||this.state.gameStatus!=null){
            return;
        }
        console.log(this.state.StepNumber);
        lastStateofSquares[i]=this.state.StepNumber % 2 == 0 ? 'X' : 'O' ;
        oldHistory.push(lastStateofSquares);
        let newgameStatus=getgameStatus(lastStateofSquares);

        if(this.state.StepNumber==8&&newgameStatus==null){
            newgameStatus="Game Draw";
        }
        this.setState({
            history:oldHistory,
            StepNumber:this.state.StepNumber+1,
            gameStatus:newgameStatus,
        })
    }
    moveToStep(i){
        let historySquare=this.state.history.slice(0,i+1);
        let stepN=i;
        let currentStatus=historySquare[historySquare.length-1].slice();
        let gameSt=getgameStatus(currentStatus);
        this.setState({
            history:historySquare,
            StepNumber:stepN,
            gameStatus:gameSt
        });
    }

    render(){
        let squares=this.state.history[this.state.history.length-1];
        return(
        <>
            <Board handlerForBoxClick={(i) => this.handleSquareClick(i) } boxes={squares}/>
            <Display gameStatus={this.state.gameStatus} stepNumber={this.state.StepNumber} handlerForHistory={(i)=>this.moveToStep(i)}/>
        </>
        );
    }
}

ReactDom.render(<TTT/>,document.getElementById("root"));