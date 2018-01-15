import React from 'react';


function Square(props){
    return(
        <button id = {props.idSquare} className = "square" onClick={()=>props.checkBox(props.id)}>{props.value}</button>
    );
}

export default Square;