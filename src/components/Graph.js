import React, { useEffect, useRef, useState } from "react";

const renderLine=(x1,y1,x2,y2,bx1,bx2,by1,by2, color, width,strokeDasharray)=>{
  if(x1===x2){
    let Y1=by1
    let Y2=by2
    let X1=x1
    let X2=x1
    return (
      <>
        <line x1={X1} y1={Y1} x2={X2} y2={Y2} stroke={color || "black"} strokeWidth={width || 0.1} strokeDasharray={strokeDasharray  || "none"}  />
      </>
    );
  }
  else if(y1===y2){
    let X1=bx1
    let X2=bx2
    let Y1=y1
    let Y2=y1
    return (
      <>
        <line x1={X1} y1={Y1} x2={X2} y2={Y2} stroke={color || "black"} strokeWidth={width || 0.1} strokeDasharray={strokeDasharray  || "none"}  />
      </>
    );
  }
  else{
  let X1=bx1
  let Y1=(y2-y1)*(X1-x1)/(x2-x1)+y1
  let X2=bx2
  let Y2=(y2-y1)*(X2-x1)/(x2-x1)+y1
  return (
    <>
        <line x1={X1} y1={Y1} x2={X2} y2={Y2} stroke={color || "black"} strokeWidth={width || 0.1} strokeDasharray={strokeDasharray  || "none"}  />
    </>
  );
  }
}

const renderRipple = (x, y) => {
  return (
    <>
      <circle r="0.5em" cx={x} cy={y} opacity={0.5} fill="grey">
        <animate
          attributeName="r"
          begin="0s"
          dur="2s"
          from="0.01em"
          to="0.1em"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          begin="0s"
          dur="2s"
          from="1"
          to="0"
          repeatCount="indefinite"
        />
      </circle>
    </>
  );
};
const reflect=([x,y],[[x1,y1],[x2,y2]])=>{
  if(x1===x2){
    return [2*x1-x,y] 
  }
  else if(y1===y2){
    return [x,2*y1-y] 
  }
  else{
    let a=(y2-y1)/(x2-x1)
    let b=y1-a*x1
    let x_=(x*(1-a**2)/(1+a**2))+((y-b)*2*a/(1+a**2))
    let y_=b+(x*2*a/(1+a**2))+((y-b)*(a**2-1)/(1+a**2))
    return [x_,y_] 
  }
}

const rotate=([x,y],[x1,y1],angle,isClockwise)=>{
  if(isClockwise){
    let newX=(x-x1)*Math.cos(angle*Math.PI/180)+(y-y1)*Math.sin(angle*Math.PI/180)+x1
    let newY=-(x-x1)*Math.sin(angle*Math.PI/180)+(y-y1)*Math.cos(angle*Math.PI/180)+y1
    return [newX,newY]
    
  }
  else{
    let newX=(x-x1)*Math.cos(angle*Math.PI/180)-(y-y1)*Math.sin(angle*Math.PI/180)+x1
    let newY=(x-x1)*Math.sin(angle*Math.PI/180)+(y-y1)*Math.cos(angle*Math.PI/180)+y1
    return [newX,newY]
  }
}

function Graph({ x1, x2, y1, y2 }) {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState([null, null]);
  // const [lastPoint, setLastPoint] = useState([null, null]);
  const [objectPoints, setObjectPoints] = useState([]);
  const [tempObjectPoints, setTempObjectPoints] = useState([]);

    // reflection
  const [reflectImagePoints, setReflectImagePoints] = useState([]);
  const [linePoints, setLinePoints] = useState([]);
  const [tempLinePoints, setTempLinePoints] = useState([]);
  // rotation
  const [centerOfRotation, setCenterOfRotation] = useState([null, null]);
  const [isClockwise, setIsClockwise] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(90);
  const [rotatedImagePoints, setRotatedImagePoints] = useState([]);
  //translation
  const [transLinePoints, setTransLinePoints] = useState([]);
  const [tempTransLinePoints, setTempTransLinePoints] = useState([]);
  const [transVector, setTransVector] = useState([0, 0]);
  const [transImagePoints, setTransImagePoints] = useState([]);
  
 const [transition, setTransition] = useState('reflection')
const [tool, setTool] = useState("none")
useEffect(() => {
  if(linePoints.length==2 && objectPoints.length>0){
    let tempObj=objectPoints
    console.log("objectPoints",objectPoints);
    let tempImagePoints=tempObj.map((point)=>reflect(point,linePoints)  
    )
    setReflectImagePoints([...tempImagePoints])
  }
  else{
    setReflectImagePoints([])
  }
}, [objectPoints,linePoints]);
useEffect(() => {
  if(centerOfRotation && objectPoints.length>0){
    let tempObj=objectPoints
    let tempImagePoints=tempObj.map((point)=>rotate(point,centerOfRotation,rotationAngle,isClockwise))
    setRotatedImagePoints([...tempImagePoints])
  }
}, [objectPoints,centerOfRotation,rotationAngle,isClockwise]);

useEffect(() => {
  if(transLinePoints.length==2 && objectPoints.length>0){
    let tempObj=objectPoints
    let tempImagePoints=tempObj.map((point)=>[point[0]+transVector[0],point[1]+transVector[1]])
    setTransImagePoints([...tempImagePoints])
  }
}, [objectPoints,transLinePoints,transVector]);

console.log("tempLinePoints",tempLinePoints);
console.log("hoveredPoint",hoveredPoint);
console.log("linePoints",linePoints);
console.log("reflectimagePoints",reflectImagePoints);


  const graphBox = useRef(null);
  const findXPosPercent = (x) => {
    return ((x - x1) / (x2 - x1)) * 100
  };

  const findYPosPercent = (y) => {
    return ((y - y2) / (y1 - y2)) * 100
  };
  console.log(tempObjectPoints);

  const renderXticks = () => {
    const ticks = [];
    for (let i = x1; i <= x2; i++) {
      i != x1 &&
        i != x2 &&
        ticks.push(
          <text
            x={((i - x1) / (x2 - x1)) * 100}
            y={findYPosPercent(0)}
            fill="grey"
            key={`verticel-${i}`}
            dominantBaseline="text-before-edge"
            textAnchor="middle"
            style={{
              textAlign: "right",
              marginRight: "5px",
            }}
            fontSize={1.5}
          >
            {i}
          </text>
        );
    }
    return ticks?.map((tick) => tick);
  };
  const renderYticks = () => {
    const ticks = [];
    for (let i = y1; i <= y2; i++) {
      i != y1 &&
        i != y2 &&
        i != 0 &&
        ticks.push(
          <text
            x={findXPosPercent(0)}
            y={((i - y2) / (y1 - y2)) * 100 }
            style={{
              textAlign: "right",
              marginRight: "5px",
            }}
            fill="grey"
            fontSize={1.5}
            key={`verticel-${i}`}
            alignmentBaseline="middle"
            textAnchor="end"
          >
            {i}
          </text>
        );
    }
    return ticks?.map((tick) => tick);
  };
  const renderVerticleLines = () => {
    const lines = [];
    for (let i = x1; i <= x2; i++) {
      i != x1 &&
        i != x2 &&
        lines.push(
          <line
            x1={((i - x1) / (x2 - x1)) * 100 }
            y1={0}
            x2={((i - x1) / (x2 - x1)) * 100 }
            y2={100}
            style={{
              stroke: "grey",
              strokeWidth: i == 0 ? .2 : 0.1,
              strokeDasharray: i != 0 ? ".1 .2" : "none",
            }}
            key={`verticel-${i}`}
          />
        );
    }
    return lines?.map((line) => line);
  };
  const renderHorizentalLines = () => {
    const lines = [];
    for (let i = y1; i <= y2; i++) {
      i != y1 &&
        i != y2 &&
        lines.push(
          <line
            x1={0}
            y1={((i - y2) / (y1 - y2)) * 100}
            x2={100}
            y2={((i - y2) / (y1 - y2)) * 100}
            style={{
              stroke: "grey",
              strokeWidth: i == 0 ? 0.2 : 0.1,
              strokeDasharray: i != 0 ? ".1 .2" : "none",
            }}
            key={`horizental-${i}`}
          />
        );
    }
    return lines?.map((line) => line);
  };

  const handleMove = (e) => {
    let rect = graphBox.current.getBoundingClientRect();
    let x = Math.round(((e.clientX - rect.x) * (x2 - x1)) / rect.width) + x1;
    let y =
      Math.round(
        ((e.clientY - rect.height - rect.y) * (y1 - y2)) / rect.height
      ) + y1;
    e = e.touches?.[0] || e;
    if (x > x1 && x < x2 && y > y1 && y < y2) {
      setHoveredPoint([x, y]);
    }
    // else { setHoveredPoint([flagX, flagY]); }
  };
  const handleClick = (e) => {
    if(tool=="polygon"){
      let temp=tempObjectPoints
    console.log(temp.length);
    if(temp.length<=1){
      setObjectPoints([])
    }
    if(temp.some(point => point.join(',') ===`${hoveredPoint[0]},${hoveredPoint[1]}`)) {
      setObjectPoints([...tempObjectPoints])
      setTempObjectPoints([])
      console.log("includes");
      setTool("none")
    }
    else{
      console.log("not includes");
      setTempObjectPoints([...tempObjectPoints, [hoveredPoint[0], hoveredPoint[1]]])
    }}
    else if(tool=="mirror"){
      let temp=tempLinePoints
      console.log(temp.length);
      if(temp.length==0){
        setTempLinePoints([[hoveredPoint[0], hoveredPoint[1]]])
      }
      else{
        setLinePoints([...temp, [hoveredPoint[0], hoveredPoint[1]]])
        setTempLinePoints([])
        setTool("none")
      }
    }
    else if(tool=="rotCenter"){
      setCenterOfRotation([hoveredPoint[0], hoveredPoint[1]])
      setTool("none")
    }
    else if(tool=="vector"){
      let temp=tempTransLinePoints
      if(temp.length==0){
        setTempTransLinePoints([[hoveredPoint[0], hoveredPoint[1]]])
      }
      else{
        setTransLinePoints([...temp, [hoveredPoint[0], hoveredPoint[1]]])
        setTempTransLinePoints([])
        setTool("none")
      }
    }
    // setFlagX(hoveredPoint[0]);
    // setFlagY(hoveredPoint[1]);
  };

  return (
    <div
      id="graph-main"
      className="graph mx-auto bg-light"
      style={{ aspectRatio: `${x2 - x1}/${y2 - y1}` }}
      ref={graphBox}
    >
<div className="tools fixed-top">
        <button type="button" onClick={() => setTool("polygon")} active={tool=="polygon"} className="m-2">Draw object</button> 
|
<select className="m-2" onChange={(e)=>{setTransition(e.target.value);setTool("none")}}>
  <option value="reflection">Reflection</option>
  <option value="rotation">Rotation</option>
  <option value="translation">Translation</option>
<option value="enlargement">Enlargement</option>

</select>

{transition=="reflection" &&        <button type="button" onClick={() => setTool("mirror")} active={tool=="mirror"} className="m-2">Mirror</button>
} 
{transition=="rotation" &&       <>
<button type="button" onClick={() => setIsClockwise(true)} active={isClockwise} className="m-2"><i class="fa-solid fa-rotate-right"></i></button>
<button type="button" onClick={() => setIsClockwise(false)} active={!isClockwise} className="m-2"><i class="fa-solid fa-rotate-left"></i></button>
<input type="number" className="m-2" onChange={(e)=>{setRotationAngle(e.target.value);setTool("none")}} value={rotationAngle} min={0} max={360}/>
 <button type="button" onClick={() => setTool("rotCenter")} active={tool=="rotCenter"} className="m-2">Center of Rotation</button></>
} 
{transition=="translation" &&    <button type="button" onClick={() => setTool("vector")} active={tool=="vector"} className="m-2">Tranaslation vector</button>}
</div>
      <svg
        height="100%"
        width="100%"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        onMouseMove={(e) => {
          handleMove(e);
        }}
        onTouchMove={(e) => {
          handleMove(e);
        }}
        onClick={(e) => {
          handleClick(e);
        }}
        // onTouchEnd={(e) => {
        //   handleClick(e);
        // }}
        style={{ cursor:tool!="none" ? "crosshair": "default" }}
      >
        {renderVerticleLines()}
        {renderHorizentalLines()}
        {renderXticks()}
        {renderYticks()}

        {(tool=="mirror"||tool=="polygon"||tool=="rotCenter") && renderRipple(
          findXPosPercent(hoveredPoint[0]),
          findYPosPercent(hoveredPoint[1])
        )}
        <polyline points={tempObjectPoints.map(coord => `${findXPosPercent(coord[0])},${findYPosPercent(coord[1])}`).join(' ')} stroke="black" fill="none" strokeWidth={.1}></polyline>
{tempObjectPoints.length > 0 &&<line x1 = {findXPosPercent(tempObjectPoints?.[tempObjectPoints.length-1]?.[0])} y1={findYPosPercent(tempObjectPoints?.[tempObjectPoints.length-1]?.[1])} x2={findXPosPercent(hoveredPoint[0])} y2={findYPosPercent(hoveredPoint[1])} stroke="blue" fill="none" strokeWidth={.1}></line>
} 
       <polygon points={objectPoints.map(coord => `${findXPosPercent(coord[0])},${findYPosPercent(coord[1])}`).join(' ')} stroke="purple" fill="purple" fillOpacity={.5} strokeWidth={.3}></polygon>




{/* reflection */}
{transition=="reflection"&&<>{tempLinePoints.length==1 && renderLine(findXPosPercent(tempLinePoints[0][0]),findYPosPercent(tempLinePoints[0][1]),findXPosPercent(hoveredPoint[0]),findYPosPercent(hoveredPoint[1]),0,100,0,100, "green", 0.1,"0.5 0.5")}
{linePoints.length>1 && renderLine(findXPosPercent(linePoints[0][0]),findYPosPercent(linePoints[0][1]),findXPosPercent(linePoints[1][0]),findYPosPercent(linePoints[1][1]),0,100,0,100, "green", 0.3,"0.5 0.5")}
{tempLinePoints.length==1 && <circle cx={findXPosPercent(tempLinePoints[0][0])} cy={findYPosPercent(tempLinePoints[0][1])} r="0.5" fill="blue"/>}
{tempLinePoints.length==1 && <circle cx={findXPosPercent(hoveredPoint[0])} cy={findYPosPercent(hoveredPoint[1])} r="0.5" fill="blue"/>}
<polygon points={reflectImagePoints?.map(coord => `${findXPosPercent(coord[0])},${findYPosPercent(coord[1])}`).join(' ')} stroke="green" fill="green" fillOpacity={.5} strokeWidth={.3}></polygon>
</>
}
{/* rotation */}
{transition=="rotation"&&<>
{centerOfRotation?<circle cx={findXPosPercent(centerOfRotation[0])} cy={findYPosPercent(centerOfRotation[1])} r="0.5" fill="green"/>:null}
<polygon id="test" points={rotatedImagePoints?.map(coord => `${findXPosPercent(coord[0])},${findYPosPercent(coord[1])}`).join(' ')} stroke="green" fill="green" fillOpacity={.5} strokeWidth={.3}></polygon>
</>
}
{/* translation */}
{transition=="translation"&&<>
{transLinePoints.length>1 && <line x1={findXPosPercent(transLinePoints[0][0])} y1={findYPosPercent(transLinePoints[0][1])} x2={findXPosPercent(transLinePoints[1][0])} y2={findYPosPercent(transLinePoints[1][1])} stroke="green" strokeWidth='0.3' strokeDasharray="none"/>}
{tempTransLinePoints.length==1 && <circle cx={findXPosPercent(tempTransLinePoints[0][0])} cy={findYPosPercent(tempTransLinePoints[0][1])} r="0.5" fill="blue"/>}
{tempTransLinePoints.length==1 && <circle cx={findXPosPercent(hoveredPoint[0])} cy={findYPosPercent(hoveredPoint[1])} r="0.5" fill="blue"/>}

</>}
      </svg>
    </div>
  );
}

export default Graph;
