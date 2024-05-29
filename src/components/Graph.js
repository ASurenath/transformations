import React, { useEffect, useRef, useState } from "react";

const renderLine = (x1, y1, x2, y2, bx1, bx2, by1, by2, color, width, strokeDasharray) => {
  if (x1 === x2) {
    let Y1 = by1
    let Y2 = by2
    let X1 = x1
    let X2 = x1
    return (
      <>
        <line x1={X1} y1={Y1} x2={X2} y2={Y2} stroke={color || "black"} strokeWidth={width || 0.1} strokeDasharray={strokeDasharray || "none"} />
      </>
    );
  }
  else if (y1 === y2) {
    let X1 = bx1
    let X2 = bx2
    let Y1 = y1
    let Y2 = y1
    return (
      <>
        <line x1={X1} y1={Y1} x2={X2} y2={Y2} stroke={color || "black"} strokeWidth={width || 0.1} strokeDasharray={strokeDasharray || "none"} />
      </>
    );
  }
  else {
    let X1 = bx1
    let Y1 = (y2 - y1) * (X1 - x1) / (x2 - x1) + y1
    let X2 = bx2
    let Y2 = (y2 - y1) * (X2 - x1) / (x2 - x1) + y1
    return (
      <>
        <line x1={X1} y1={Y1} x2={X2} y2={Y2} stroke={color || "black"} strokeWidth={width || 0.1} strokeDasharray={strokeDasharray || "none"} />
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
const reflect = ([x, y], [[x1, y1], [x2, y2]]) => {
  if (x1 === x2) {
    return [2 * x1 - x, y]
  }
  else if (y1 === y2) {
    return [x, 2 * y1 - y]
  }
  else {
    let a = (y2 - y1) / (x2 - x1)
    let b = y1 - a * x1
    let x_ = (x * (1 - a ** 2) / (1 + a ** 2)) + ((y - b) * 2 * a / (1 + a ** 2))
    let y_ = b + (x * 2 * a / (1 + a ** 2)) + ((y - b) * (a ** 2 - 1) / (1 + a ** 2))
    return [x_, y_]
  }
}
const rotate = ([x, y], [x1, y1], angle, isClockwise) => {
  if (isClockwise) {
    let newX = (x - x1) * Math.cos(angle * Math.PI / 180) + (y - y1) * Math.sin(angle * Math.PI / 180) + x1
    let newY = -(x - x1) * Math.sin(angle * Math.PI / 180) + (y - y1) * Math.cos(angle * Math.PI / 180) + y1
    return [newX, newY]

  }
  else {
    let newX = (x - x1) * Math.cos(angle * Math.PI / 180) - (y - y1) * Math.sin(angle * Math.PI / 180) + x1
    let newY = (x - x1) * Math.sin(angle * Math.PI / 180) + (y - y1) * Math.cos(angle * Math.PI / 180) + y1
    return [newX, newY]
  }
}
const translate = ([x, y], [[x1, y1], [x2, y2]]) => {
  return [x + x2 - x1, y + y2 - y1]
}

function Graph({ x1, x2, y1, y2 }) {
  const [hoveredPoint, setHoveredPoint] = useState([null, null]);
  const [hoveredObjectPoint, setHoveredObjectPoint] = useState([null, null]);
  const [selectedObjectPoint, setSelectedObjectPoint] = useState([]);

  // object
  const [objects, setObjects] = useState({ "demo": [[-4, 5], [-4, 9], [-2, 5]] });
  const [tempObjectPoints, setTempObjectPoints] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectionCoordinates, setSelectionCoordinates] = useState({ x1: null, x2: null, y1: null, y2: null });
  // reflection
  const [reflectImages, setReflectImages] = useState([]);
  const [mirrorLinePoints, setMirrorLinePoints] = useState([[-5, 0], [0, 5]]);
  const [tempMirrorLinePoints, setTempMirrorLinePoints] = useState([]);
  // rotation
  const [centerOfRotation, setCenterOfRotation] = useState([-2, 2]);
  const [isClockwise, setIsClockwise] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(90);
  const [rotatedImages, setRotatedImages] = useState([]);
  //translation
  const [transLinePoints, setTransLinePoints] = useState([]);
  const [tempTransLinePoints, setTempTransLinePoints] = useState([]);
  const [transVector, setTransVector] = useState([0, 0]);
  const [transImagePoints, setTransImagePoints] = useState([]);

  const [transformation, setTransformation] = useState('reflection')
  const [tool, setTool] = useState("none")
  const color1 = "#1783b8"
  const color2 = "#4dc0ae"

  console.log("objects", objects);
  console.log("objects.flat", Object.values(objects).flat());
  console.log("objects.flat(2)", Object.values(objects).flat(2))
  console.log("selectedObject", selectedObject);
  console.log("selectionCoordinates", selectionCoordinates);

  useEffect(() => {
    if (mirrorLinePoints.length == 2) {
      let tempReflectImages = {}
      for (let key in objects) {
        let tempObj = objects[key]
        let tempImage = tempObj.map((point) => reflect(point, mirrorLinePoints)
        )
        tempReflectImages[key] = [...tempImage]
        console.log("tempImage", tempImage);
      }
      setReflectImages({ ...tempReflectImages })
    }
    else {
      setReflectImages({})
    }
  }, [objects, mirrorLinePoints]);
  useEffect(() => {
    if (objects[selectedObject]) {
      let tempObj = objects[selectedObject]
      let x1 = Math.min(...tempObj.map((point) => point[0])) - 0.1
      let x2 = Math.max(...tempObj.map((point) => point[0])) + 0.1
      let y1 = Math.min(...tempObj.map((point) => point[1])) - 0.1
      let y2 = Math.max(...tempObj.map((point) => point[1])) + 0.1
      setSelectionCoordinates({ x1: x1, x2: x2, y1: y1, y2: y2 })
    }
  }, [objects, selectedObject]);
  useEffect(() => {
    if (tool != "polygon") {
      setTempObjectPoints([])
    }
    if (tool != "mirror") {
      setTempMirrorLinePoints([])
    }
    if (tool != "delete") {
      setSelectedObject(null)
    }
  }, [tool])
  useEffect(() => {
    if (centerOfRotation) {
      let tempRotImages = {}
      for (let key in objects) {
        let tempObj = objects[key]
        let tempImage = tempObj.map((point) => rotate(point, centerOfRotation, rotationAngle, isClockwise)
        )
        tempRotImages[key] = [...tempImage]
      }
      setRotatedImages({ ...tempRotImages })
    }
  }, [objects, centerOfRotation, rotationAngle, isClockwise]);

  // useEffect(() => {
  //   if(transLinePoints.length==2 && objectPoints.length>0){
  //     let tempObj=objectPoints
  //     let tempImagePoints=tempObj.map((point)=>[point[0]+transVector[0],point[1]+transVector[1]])
  //     setTransImagePoints([...tempImagePoints])
  //   }
  // }, [objectPoints,transLinePoints,transVector]);

  // console.log("tempLinePoints",tempLinePoints);
  // console.log("hoveredPoint",hoveredPoint);
  // console.log("linePoints",linePoints);


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
            y={((i - y2) / (y1 - y2)) * 100}
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
            x1={((i - x1) / (x2 - x1)) * 100}
            y1={0}
            x2={((i - x1) / (x2 - x1)) * 100}
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
      if (tool == "select") {
        if (Object.values(objects).flat().some(point => point.join(',') === `${x},${y}`)) {
          setHoveredObjectPoint([x, y]);
        }
        else {
          setHoveredObjectPoint([])
        }
      }
    }
    // else { setHoveredPoint([flagX, flagY]); }
  };

  const handleClick = (e) => {
    if (tool == "polygon") {
      let temp = tempObjectPoints
      console.log(temp.length);
      // if(temp.length<=1){
      //   setObjectPoints([])
      // }
      if (temp.some(point => point.join(',') === `${hoveredPoint[0]},${hoveredPoint[1]}`)) {
        let id = Math.random().toString(36).slice(2, 7);
        while (Object.keys(objects).includes(id)) {
          id = Math.random().toString(36).slice(2, 7)
        }
        setObjects({ ...objects, [id]: [...tempObjectPoints] })
        setTempObjectPoints([])
        console.log("includes");
        // setTool("select")
      }
      else {
        console.log("not includes");
        setTempObjectPoints([...tempObjectPoints, [hoveredPoint[0], hoveredPoint[1]]])
      }
    }
    else if (tool == "mirror") {
      let temp = tempMirrorLinePoints
      console.log(temp.length);
      if (temp.length == 0) {
        setTempMirrorLinePoints([[hoveredPoint[0], hoveredPoint[1]]])
      }
      else {
        setMirrorLinePoints([...temp, [hoveredPoint[0], hoveredPoint[1]]])
        setTempMirrorLinePoints([])
        setTool("select")
      }
    }
    else if (tool == "rotCenter") {
      setCenterOfRotation([hoveredPoint[0], hoveredPoint[1]])
      setTool("select")
    }
    else if (tool == "vector") {
      let temp = tempTransLinePoints
      if (temp.length == 0) {
        setTempTransLinePoints([[hoveredPoint[0], hoveredPoint[1]]])
      }
      else {
        setTransLinePoints([...temp, [hoveredPoint[0], hoveredPoint[1]]])
        setTempTransLinePoints([])
        setTool("select")
      }
    }
    if (tool == "select") {
      setSelectedObjectPoint([hoveredObjectPoint[0], hoveredObjectPoint[1]])
    }
    // setFlagX(hoveredPoint[0]);
    // setFlagY(hoveredPoint[1]);
  };
  const handleDelete = () => {
    if (selectedObject) {
      let tempObjects = objects
      delete tempObjects[selectedObject]
      setObjects({ ...tempObjects })
      setSelectedObject(null)
    }
  }

  return (
    <div
      id="graph-main"
      className="graph mx-auto bg-light"
      style={{ aspectRatio: `${x2 - x1}/${y2 - y1}` }}
      ref={graphBox}
    >
      <div className="tools fixed">
        <button type="button" onClick={() => setTool("polygon")} className={`m-2 bg-[${tool == "polygon" ? color2 : color1}] text-white p-1 px-2 rounded`}><i className="fa-solid fa-draw-polygon" title="Draw objects"></i></button>
        <button type="button" onClick={() => setTool("select")} active={`${tool == "select"}`} className={`m-2 bg-[${tool == "select" ? color2 : color1}] text-white p-1 px-2 rounded`} title="Select points to analyse their transformation"><i className="fa-solid fa-arrow-pointer"></i></button>

        <button type="button" onClick={() => setTool("delete")} active={`${tool == "delete"}`} className={`m-2 bg-[${tool == "delete" ? color2 : color1}] text-white p-1 px-2 rounded`} title="Delete"><i className="fa-solid fa-trash"></i></button>

        <select className={`p-2 bg-white rounded border border-2 border-[${color1}] focus:border-[${color2}]`} onChange={(e) => { setTransformation(e.target.value); setTool("select") }} >
          <option value="reflection">Reflection</option>
          <option value="rotation">Rotation</option>
          <option value="translation">Translation</option>
          <option value="enlargement">Enlargement</option>

        </select>

        {transformation == "reflection" && <button type="button" onClick={() => setTool("mirror")} active={`${tool == "mirror"}`} className={`m-2 bg-[${tool == "mirror" ? color2 : color1}] text-white p-1 px-2 rounded`} title="Draw mirror line"><i className="fa-solid fa-slash"></i></button>
        }

        {transformation == "rotation" && <>
          <button type="button" onClick={() => setIsClockwise(true)} active={`${isClockwise}`} className={`m-2 p-1 px-2 rounded bg-[${isClockwise ? color2 : color1}] text-white`} title="Clockwise"><i class="fa-solid fa-rotate-right"></i></button>
          <button type="button" onClick={() => setIsClockwise(false)} active={`${!isClockwise}`} className={`m-2 p-1 px-2 rounded bg-[${!isClockwise ? color2 : color1}] text-white`} title="Counterclockwise"><i class="fa-solid fa-rotate-left"></i></button>
          <input type="number" onChange={(e) => { setRotationAngle(e.target.value); setTool("delete") }} value={rotationAngle} min={0} max={360} className={`p-1 bg-white rounded border border-2 border-[${color1}] focus:border-[${color2}]`} />
          <button type="button" onClick={() => setTool("rotCenter")} active={`${tool == "rotCenter"}`} className={`m-2 bg-[${tool == "rotCenter" ? color2 : color1}] text-white p-1 px-2 rounded`} title="Mark center of rotation" ><i className="fa-solid fa-circle"></i></button></>
        }
        {transformation == "translation" && <button type="button" onClick={() => setTool("vector")} active={`${tool == "vector"}`} className="m-2">Tranaslation vector</button>}
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
        style={{ cursor: (tool == "polygon" || tool == "rotCenter" || tool == "vector" || tool == "mirror") ? "crosshair" : tool == "delete" ? "url('minus-cursor.png'), auto" : "default" }}
      >
        {renderVerticleLines()}
        {renderHorizentalLines()}
        {renderXticks()}
        {renderYticks()}

        {(tool == "mirror" || tool == "polygon" || tool == "rotCenter") && renderRipple(
          findXPosPercent(hoveredPoint[0]),
          findYPosPercent(hoveredPoint[1])
        )}
        {(tool == "select") && renderRipple(
          findXPosPercent(hoveredObjectPoint[0]),
          findYPosPercent(hoveredObjectPoint[1])
        )}

        {/* object */}
        {tool === "polygon" && <>
          <polyline points={tempObjectPoints.map(coord => `${findXPosPercent(coord[0])},${findYPosPercent(coord[1])}`).join(' ')} stroke={color1} fill="none" strokeWidth={.1}></polyline>
          {tempObjectPoints.length > 0 && <line x1={findXPosPercent(tempObjectPoints?.[tempObjectPoints.length - 1]?.[0])} y1={findYPosPercent(tempObjectPoints?.[tempObjectPoints.length - 1]?.[1])} x2={findXPosPercent(hoveredPoint[0])} y2={findYPosPercent(hoveredPoint[1])} stroke="lightgrey" fill="none" strokeWidth={.1}></line>
          }
          {tempObjectPoints?.map(coord => <circle cx={findXPosPercent(coord[0])} cy={findYPosPercent(coord[1])} r={.5} fill={color1} />)}

        </>}
        {
          Object.keys(objects).map((key) =>
            <polygon points={objects?.[key]?.map(coord => `${findXPosPercent(coord[0])},${findYPosPercent(coord[1])}`).join(' ')} stroke={color1} fill={color1} fillOpacity={.5} strokeWidth={.3} onClick={() => { tool == "delete" && setSelectedObject(key) }}></polygon>
          )
        }




        {/* reflection */}
        {transformation == "reflection" && <>{tempMirrorLinePoints.length == 1 && renderLine(findXPosPercent(tempMirrorLinePoints[0][0]), findYPosPercent(tempMirrorLinePoints[0][1]), findXPosPercent(hoveredPoint[0]), findYPosPercent(hoveredPoint[1]), 0, 100, 0, 100, `${color2}`, 0.1, "0.5 0.5")}
          {mirrorLinePoints.length > 1 && renderLine(findXPosPercent(mirrorLinePoints[0][0]), findYPosPercent(mirrorLinePoints[0][1]), findXPosPercent(mirrorLinePoints[1][0]), findYPosPercent(mirrorLinePoints[1][1]), 0, 100, 0, 100, `purple`, 0.3, "0.5 0.5")}
          {tempMirrorLinePoints.length == 1 && <circle cx={findXPosPercent(tempMirrorLinePoints[0][0])} cy={findYPosPercent(tempMirrorLinePoints[0][1])} r="0.5" fill="blue" />}
          {tempMirrorLinePoints.length == 1 && <circle cx={findXPosPercent(hoveredPoint[0])} cy={findYPosPercent(hoveredPoint[1])} r="0.5" fill="blue" />}
          {Object.keys(reflectImages).map((key) =>
            <polygon points={reflectImages?.[key]?.map(coord => `${findXPosPercent(coord[0])},${findYPosPercent(coord[1])}`).join(' ')} stroke={color2} fill={color2} fillOpacity={.5} strokeWidth={.3}></polygon>
          )}</>
        }
        {/* rotation */}
        {transformation == "rotation" && <>
          {centerOfRotation ? <circle cx={findXPosPercent(centerOfRotation[0])} cy={findYPosPercent(centerOfRotation[1])} r="0.5" fill={'purple'} /> : null}
          {Object.keys(rotatedImages).map((key) =>
            <polygon points={rotatedImages?.[key]?.map(coord => `${findXPosPercent(coord[0])},${findYPosPercent(coord[1])}`).join(' ')} stroke={color2} fill={color2} fillOpacity={.5} strokeWidth={.3}></polygon>
          )}
          {/* <polygon id="test" points={rotatedImages?.map(coord => `${findXPosPercent(coord[0])},${findYPosPercent(coord[1])}`).join(' ')} stroke={color2} fill={color2} fillOpacity={.5} strokeWidth={.3}></polygon> */}
        </>
        }
        {/* translation */}
        {transformation == "translation" && <>
          {transLinePoints.length > 1 && <line x1={findXPosPercent(transLinePoints[0][0])} y1={findYPosPercent(transLinePoints[0][1])} x2={findXPosPercent(transLinePoints[1][0])} y2={findYPosPercent(transLinePoints[1][1])} stroke="green" strokeWidth='0.3' strokeDasharray="none" />}
          {tempTransLinePoints.length == 1 && <circle cx={findXPosPercent(tempTransLinePoints[0][0])} cy={findYPosPercent(tempTransLinePoints[0][1])} r="0.5" fill="blue" />}
          {tempTransLinePoints.length == 1 && <circle cx={findXPosPercent(hoveredPoint[0])} cy={findYPosPercent(hoveredPoint[1])} r="0.5" fill="blue" />}

        </>}
        {/* selection  for delete*/}
        {selectedObject &&
          <g>
            <rect x={findXPosPercent(selectionCoordinates.x1)} height={findYPosPercent(selectionCoordinates.y1) - findYPosPercent(selectionCoordinates.y2)} y={findYPosPercent(selectionCoordinates.y2)} width={findXPosPercent(selectionCoordinates.x2) - findXPosPercent(selectionCoordinates.x1)} stroke={color1} fill="none" strokeWidth='0.2' strokeDasharray="0.5 0.3" />
            <g onClick={handleDelete} className="cursor-pointer">
              <rect x={findXPosPercent(selectionCoordinates.x2) - 1} height={2} y={findYPosPercent(selectionCoordinates.y2) - 1} width={2} rx={1} ry={1} stroke={color1} fill="white" strokeWidth='0.1'></rect>
              <text x={findXPosPercent(selectionCoordinates.x2)} y={findYPosPercent(selectionCoordinates.y2)} fill={color1} fontSize={2} textAnchor="middle" dominantBaseline="middle">x</text>
            </g>
          </g>
        }
        {/* point selection */}
        {selectedObjectPoint && transformation=="reflection" &&
          <g>
            <circle cx={findXPosPercent(selectedObjectPoint[0])} cy={findYPosPercent(selectedObjectPoint[1])} r="0.5" fill={color1} />
            <circle cx={findXPosPercent(reflect(selectedObjectPoint, mirrorLinePoints)[0])} cy={findYPosPercent(reflect(selectedObjectPoint, mirrorLinePoints)[1])} r="0.5" fill={color2} />
            <line x1={findXPosPercent(selectedObjectPoint[0])} y1={findYPosPercent(selectedObjectPoint[1])} x2={findXPosPercent(reflect(selectedObjectPoint, mirrorLinePoints)[0])} y2={findYPosPercent(reflect(selectedObjectPoint, mirrorLinePoints)[1])} stroke="grey" strokeWidth='0.2' strokeDasharray="none" />

          </g>
        }
        {
          selectedObjectPoint[0] && transformation=="rotation" &&
          <g>
            <circle cx={findXPosPercent(selectedObjectPoint[0])} cy={findYPosPercent(selectedObjectPoint[1])} r="0.5" fill={color1} />
            <circle cx={findXPosPercent(rotate(selectedObjectPoint, centerOfRotation,rotationAngle,isClockwise)[0])} cy={findYPosPercent(rotate(selectedObjectPoint, centerOfRotation,rotationAngle,isClockwise)[1])} r="0.5" fill={color2} />
            <line x1={findXPosPercent(selectedObjectPoint[0])} y1={findYPosPercent(selectedObjectPoint[1])} x2={findXPosPercent(centerOfRotation[0])} y2={findYPosPercent(centerOfRotation[1])} stroke="grey" strokeWidth='0.2' strokeDasharray="none" />
             <line x1={findXPosPercent(rotate(selectedObjectPoint, centerOfRotation,rotationAngle,isClockwise)[0])} y1={findYPosPercent(rotate(selectedObjectPoint, centerOfRotation,rotationAngle,isClockwise)[1])} x2={findXPosPercent(centerOfRotation[0])} y2={findYPosPercent(centerOfRotation[1])} stroke="grey" strokeWidth='0.2' strokeDasharray="none" />
            </g>
        }


      </svg>
    </div>
  );
}

export default Graph;
