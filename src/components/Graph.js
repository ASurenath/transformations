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
const enlarge = ([x, y], [x1, y1], f) => {
  return [x1 + f * (x - x1), y1 + f * (y - y1)]
}
const lineEquation = ([[x1, y1], [x2, y2]]) => {
  if (x1 === x2) {
    return `x = ${x1}`
  }
  else if (y1 === y2) {
    return `y = ${y1}`
  }
  else {
    let a = Math.round(((y2 - y1) / (x2 - x1)) * 1000) / 1000
    let b = Math.round((y1 - a * x1) * 1000) / 1000
    if (a == 1) {
      return `y=x+${b}`
    }
    else if (a == -1) {
      return `y=-x+${b}`
    }
    else {
      return `y = ${a}x + ${b}`
    }
  }
}

function Graph({ x1, x2, y1, y2 }) {
  const [hoveredPoint, setHoveredPoint] = useState([]);
  const [hoveredObjectPoint, setHoveredObjectPoint] = useState([]);
  const [selectedObjectPoint, setSelectedObjectPoint] = useState([-4, 5]);
  // object
  const [objects, setObjects] = useState({ "demo": [[-4, 5], [-4, 9], [-2, 5]] });
  const [tempObjectPoints, setTempObjectPoints] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectionCoordinates, setSelectionCoordinates] = useState({ x1: null, x2: null, y1: null, y2: null });
  // reflection
  const [reflectImages, setReflectImages] = useState({});
  const [mirrorLinePoints, setMirrorLinePoints] = useState([[-5, 0], [0, 5]]);
  const [tempMirrorLinePoints, setTempMirrorLinePoints] = useState([]);

  // rotation
  const [centerOfRotation, setCenterOfRotation] = useState([-2, 2]);
  const [isClockwise, setIsClockwise] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(90);
  const [rotatedImages, setRotatedImages] = useState([]);
  //translation
  const [tempTransVector, setTempTransVector] = useState([]);
  const [transVector, setTransVector] = useState([[0, 0], [3, 1]]);
  const [transImages, setTransImages] = useState({});

  // enlargement
  const [enlargedImages, setEnlargedImages] = useState({});
  const [enlargementFactor, setEnlargementFactor] = useState(2);
  const [centerOfEnlargement, setCenterOfEnlargement] = useState([-9, 9]);

  const [transformation, setTransformation] = useState('reflection')
  const [tool, setTool] = useState("none")
  const color1 = "#1783b8"
  const color2 = "#4dc0ae"

  console.log("objects", objects);
  console.log("objects.flat", Object.values(objects).flat());
  console.log("objects.flat(2)", Object.values(objects).flat(2))
  console.log("selectedObject", selectedObject);
  console.log("selectedObjectPoint", selectedObjectPoint);
  // reflection
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
  // selection coordinates
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
  // rotation
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

  // translation
  useEffect(() => {
    if (transVector.length == 2) {
      let tempTransImages = {}
      for (let key in objects) {
        let tempObj = objects[key]
        let tempImage = tempObj.map((point) => translate(point, transVector)
        )
        tempTransImages[key] = [...tempImage]
      }
      setTransImages({ ...tempTransImages })
    }
  }, [objects, transVector]);
  // Enlarge
  useEffect(() => {
    if (enlargementFactor) {
      let tempEnlargeImages = {}
      for (let key in objects) {
        let tempObj = objects[key]
        let tempImage = tempObj.map((point) => enlarge(point, centerOfEnlargement, enlargementFactor)
        )
        tempEnlargeImages[key] = [...tempImage]
      }
      setEnlargedImages({ ...tempEnlargeImages })
    }
  }, [objects, centerOfEnlargement, enlargementFactor]);


  // console.log("tempLinePoints",tempLinePoints);
  // console.log("hoveredPoint",hoveredPoint);
  // console.log("linePoints",linePoints);


  const graphBox = useRef(null);
  const percentX = (x) => {
    return ((x - x1) / (x2 - x1)) * 100
  };

  const percentY = (y) => {
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
            y={percentY(0)}
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
            x={percentX(0)}
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
    else { setHoveredPoint([]); }
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
      let temp = tempTransVector
      if (temp.length == 0) {
        setTempTransVector([[hoveredPoint[0], hoveredPoint[1]]])
      }
      else {
        setTransVector([...temp, [hoveredPoint[0], hoveredPoint[1]]])
        setTempTransVector([])
        setTool("select")
      }
    }
    else if (tool == "select") {

      if (hoveredObjectPoint.length > 0) { setSelectedObjectPoint([hoveredObjectPoint[0], hoveredObjectPoint[1]]) }
      else { setSelectedObjectPoint([]) }
    }
    else if (tool == "enlargementCenter") {
      setCenterOfEnlargement([hoveredPoint[0], hoveredPoint[1]])
      setTool("select")
    }
    // setFlagX(hoveredPoint[0]);
    // setFlagY(hoveredPoint[1]);
  };
  const handleDelete = () => {
    if (selectedObject) {
      if (selectedObjectPoint) {
        if (objects[selectedObject].some(point => point.join(',') === `${selectedObjectPoint[0]},${selectedObjectPoint[1]}`)) {
          setSelectedObjectPoint([])
        }
      }
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
      <div className="tools fixed flex justify-center items-center">
        <button type="button" onClick={() => setTool("polygon")} className={`m-2 bg-[${tool == "polygon" ? color2 : color1}] text-white p-1 px-2 rounded`}><i className="fa-solid fa-draw-polygon" title="Draw objects"></i></button>
        <button type="button" onClick={() => setTool("select")} active={`${tool == "select"}`} className={`m-2 bg-[${tool == "select" ? color2 : color1}] text-white p-1 px-2 rounded`} title="Select points to analyse their transformation"><i className="fa-solid fa-arrow-pointer"></i></button>

        <button type="button" onClick={() => setTool("delete")} active={`${tool == "delete"}`} className={`m-2 bg-[${tool == "delete" ? color2 : color1}] text-white p-1 px-2 rounded`} title="Delete"><i className="fa-solid fa-trash"></i></button>

        <select className={`p-2 bg-white rounded border border-2 border-[${color1}] focus:border-[${color2}]`} onChange={(e) => { setTransformation(e.target.value); setTool("select") }} >
          <option value="reflection">Reflection</option>
          <option value="rotation">Rotation</option>
          <option value="translation">Translation</option>
          <option value="enlargement">Enlargement</option>

        </select>

        {transformation == "reflection" &&
          <>
            <button type="button" onClick={() => setTool("mirror")} active={`${tool == "mirror"}`} className={`m-2 bg-[${tool == "mirror" ? color2 : color1}] text-white p-1 px-2 rounded`} title="Draw mirror line"><i className="fa-solid fa-slash"></i></button>
            <p className="m-2 p-2 bg-white rounded border border-2 border-[${color1}]">Reflection on the line <span className="font-bold text-[#800080]">{lineEquation(mirrorLinePoints)}</span></p>
          </>}

        {transformation == "rotation" && <>
          <button type="button" onClick={() => setIsClockwise(true)} active={`${isClockwise}`} className={`m-2 p-1 px-2 rounded bg-[${isClockwise ? color2 : color1}] text-white`} title="Direction-Clockwise"><i class="fa-solid fa-rotate-right"></i></button>
          <button type="button" onClick={() => setIsClockwise(false)} active={`${!isClockwise}`} className={`m-2 p-1 px-2 rounded bg-[${!isClockwise ? color2 : color1}] text-white`} title="Direction-Counterclockwise"><i class="fa-solid fa-rotate-left"></i></button>
          <button type="button" onClick={() => setTool("rotCenter")} active={`${tool == "rotCenter"}`} className={`m-2 bg-[${tool == "rotCenter" ? color2 : color1}] text-white p-1 px-2 rounded`} title="Mark center of rotation" ><i className="fa-solid fa-circle"></i></button>

          <div class="relative mt-2 w-50 flex">
            <input type="range" onChange={(e) => { setRotationAngle(e.target.value); setTool("select") }} value={rotationAngle} min={0} max={360} id="angle-slider" class="peer w-25" />
            <input type="number" onChange={(e) => { setRotationAngle(e.target.value); setTool("select") }} value={rotationAngle} min={0} max={360} id="angle-input" className={`peer block w-15 p-1 bg-white rounded border border-2 border-[${color1}] focus:border-[${color2}] w-16 text-center`} placeholder=" " />
            <label for="angle-input" class="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600"> Rotation angle (deg) </label>
            {/* <div class="absolute right-1 top-1/2 -translate-y-1/2 bg-white py-1 px-1 text-gray-300 peer-placeholder-shown:text-white peer-focus:text-gray-300">°</div> */}
          </div>
          <p className="m-2 p-2 bg-white rounded border border-2 border-[${color1}]"><span className="font-bold text-[#800080]">{rotationAngle}° </span>rotation about the point <span className="font-bold text-[#800080]">({centerOfRotation[0]}, {centerOfRotation[1]})</span> in <span className="font-bold text-[#800080]">{isClockwise ? "clockwise" : "counterclockwise"}</span> direction.</p>


        </>}
        {transformation == "translation" && 
<>
          <button type="button" onClick={() => setTool("vector")} active={`${tool == "vector"}`} className={`m-2 bg-[${tool == "rotCenter" ? color2 : color1}] text-white p-1 px-3 rounded`} title="Draw translation vector"><i class="fa-solid fa-arrow-up-long fa-rotate-by" style={{ '--fa-rotate-angle': '45deg' }} /></button>
          <p className="m-2 p-2 bg-white rounded border border-2 border-[${color1}]">Translation by the vector <div className="inline-flex text-[#800080] text-3xl p-0">[<div className="inline-flex flex-col text-sm justify-center"><p className="p-0 m-0">{transVector[1][0]-transVector[0][0]}</p><p className="p-0 m-0">{transVector[1][1]-transVector[0][1]}</p></div>]</div></p>

</>        
        }
        {transformation == "enlargement" &&
          <>
            <button type="button" onClick={() => setTool("enlargementCenter")} active={`${tool == "enlargementCenter"}`} className={`m-2 bg-[${tool == "enlargementCenter" ? color2 : color1}] text-white p-1 px-2 rounded`} title="Mark center of enlargement" ><i className="fa-solid fa-circle"></i></button>

            <div class="mt-0 w-50 flex">
              <div className="peer w-25 flex flex-col">
                <label for="e-factor-input" class="scale-75 select-none bg-white px-2 text-sm text-gray-500 my-0"> Enlargement&nbsp;factor </label>
                <input type="range" onChange={(e) => { setEnlargementFactor(e.target.value); setTool("select") }} value={enlargementFactor} min={-10} max={10} id="e-factor-slider" step={0.1} />
                <div className="w-75 flex justify-between my-0 text-gray-500 text-sm "><div className="color-gray">-10</div><div>0</div><div>10</div></div>
              </div>

              <input type="number" onChange={(e) => { setEnlargementFactor(e.target.value); setTool("select") }} value={enlargementFactor} min={-10} max={10} id="e-factor-input" className={`peer block w-15 m-1 bg-white rounded border border-2 border-[${color1}] focus:border-[${color2}] w-16 text-center h-11`} placeholder=" " step={0.1} />

            </div>
            <p className="m-2 p-2 bg-white rounded border border-2 border-[${color1}]"> Enlargement w.r.t. the point <span className="font-bold text-[#800080]">({centerOfEnlargement[0]}, {centerOfEnlargement[1]} )</span> by the factor <span className="font-bold text-[#800080]">{enlargementFactor}</span>. </p>


          </>}
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
        className={`${tool == "polygon" && 'cursor-cross-polygon'} ${tool == "mirror" && 'cursor-cross-line'} ${tool == "delete" && 'cursor-arrow-trash'} ${tool == "rotCenter" && 'cursor-cross-point'} ${tool == "vector" && 'cursor-cross-vector'}`}
      >
        {renderVerticleLines()}
        {renderHorizentalLines()}
        {renderXticks()}
        {renderYticks()}
        <defs>
          <marker id="arrow" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L5,2.5 L0,5" fill="none" stroke="grey" stroke-width="1" />
          </marker>
          <marker id="vector-arrow" markerWidth="5" markerHeight="5" refX="5" refY="2.5" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L5,2.5 L0,5" fill="none" stroke="purple" stroke-width="1" />
          </marker>
        </defs>
        {(tool == "mirror" || tool == "polygon" || tool == "rotCenter" || tool == "vector" || tool == "enlargementCenter") && renderRipple(
          percentX(hoveredPoint[0]),
          percentY(hoveredPoint[1])
        )}
        {(tool == "select") && renderRipple(
          percentX(hoveredObjectPoint[0]),
          percentY(hoveredObjectPoint[1])
        )}

        {/* object */}
        {tool === "polygon" && <>
          <polyline points={tempObjectPoints.map(coord => `${percentX(coord[0])},${percentY(coord[1])}`).join(' ')} stroke={color1} fill="none" strokeWidth={.1}></polyline>
          {tempObjectPoints.length > 0 && <line x1={percentX(tempObjectPoints?.[tempObjectPoints.length - 1]?.[0])} y1={percentY(tempObjectPoints?.[tempObjectPoints.length - 1]?.[1])} x2={percentX(hoveredPoint[0])} y2={percentY(hoveredPoint[1])} stroke="lightgrey" fill="none" strokeWidth={.1}></line>
          }
          {tempObjectPoints?.map(coord => <circle cx={percentX(coord[0])} cy={percentY(coord[1])} r={.5} fill={color1} />)}

        </>}
        {
          Object.keys(objects).map((key) =>
            <polygon points={objects?.[key]?.map(coord => `${percentX(coord[0])},${percentY(coord[1])}`).join(' ')} stroke={color1} fill={color1} fillOpacity={.5} strokeWidth={.3} onClick={() => { tool == "delete" && setSelectedObject(key) }}></polygon>
          )
        }




        {/* reflection */}
        {transformation == "reflection" && <>{tempMirrorLinePoints.length == 1 && renderLine(percentX(tempMirrorLinePoints[0][0]), percentY(tempMirrorLinePoints[0][1]), percentX(hoveredPoint[0]), percentY(hoveredPoint[1]), 0, 100, 0, 100, `${color2}`, 0.1, "0.5 0.5")}
          {mirrorLinePoints.length > 1 && renderLine(percentX(mirrorLinePoints[0][0]), percentY(mirrorLinePoints[0][1]), percentX(mirrorLinePoints[1][0]), percentY(mirrorLinePoints[1][1]), 0, 100, 0, 100, `purple`, 0.3, "0.5 0.5")}
          {tempMirrorLinePoints.length == 1 &&
            <><circle cx={percentX(tempMirrorLinePoints[0][0])} cy={percentY(tempMirrorLinePoints[0][1])} r="0.5" fill="purple" />
              <circle cx={percentX(hoveredPoint[0])} cy={percentY(hoveredPoint[1])} r="0.5" fill="purple" />

            </>
          }
          {Object.keys(reflectImages).map((key) =>
            <polygon points={reflectImages?.[key]?.map(coord => `${percentX(coord[0])},${percentY(coord[1])}`).join(' ')} stroke={color2} fill={color2} fillOpacity={.5} strokeWidth={.3}></polygon>
          )}</>
        }
        {/* rotation */}
        {transformation == "rotation" && <>
          {centerOfRotation ? <circle cx={percentX(centerOfRotation[0])} cy={percentY(centerOfRotation[1])} r="0.5" fill={'purple'} /> : null}
          {Object.keys(rotatedImages).map((key) =>
            <polygon points={rotatedImages?.[key]?.map(coord => `${percentX(coord[0])},${percentY(coord[1])}`).join(' ')} stroke={color2} fill={color2} fillOpacity={.5} strokeWidth={.3}></polygon>
          )}
          {/* <polygon id="test" points={rotatedImages?.map(coord => `${percentX(coord[0])},${percentY(coord[1])}`).join(' ')} stroke={color2} fill={color2} fillOpacity={.5} strokeWidth={.3}></polygon> */}
        </>
        }
        {/* translation */}
        {transformation == "translation" && <>
          {transVector.length > 1 && <line x1={percentX(transVector[0][0])} y1={percentY(transVector[0][1])} x2={percentX(transVector[1][0])} y2={percentY(transVector[1][1])} stroke="purple" strokeWidth='0.2' strokeDasharray="none" markerEnd="url(#vector-arrow)" />}

          {tempTransVector.length == 1 && <>
            <circle cx={percentX(tempTransVector[0][0])} cy={percentY(tempTransVector[0][1])} r="0.5" fill="purple" />
            <circle cx={percentX(hoveredPoint[0])} cy={percentY(hoveredPoint[1])} r="0.5" fill="purple" />
            <line x1={percentX(tempTransVector[0][0])} y1={percentY(tempTransVector[0][1])} x2={percentX(hoveredPoint[0])} y2={percentY(hoveredPoint[1])} stroke={color2} strokeWidth='0.1' strokeDasharray="0.5 0.5" />
          </>}

          {Object.keys(transImages).map((key) =>
            <polygon points={transImages?.[key]?.map(coord => `${percentX(coord[0])},${percentY(coord[1])}`).join(' ')} stroke={color2} fill={color2} fillOpacity={.5} strokeWidth={.3}></polygon>
          )}

        </>}
        {/* enlarge */}
        {transformation == "enlargement" && <>
          {centerOfEnlargement && <circle cx={percentX(centerOfEnlargement[0])} cy={percentY(centerOfEnlargement[1])} r="0.5" fill={'purple'} />}
          {Object.keys(enlargedImages).map((key) =>
            <polygon points={enlargedImages?.[key]?.map(coord => `${percentX(coord[0])},${percentY(coord[1])}`).join(' ')} stroke={color2} fill={color2} fillOpacity={.5} strokeWidth={.3}></polygon>
          )}

        </>}
        {/* selection  for delete*/}
        {selectedObject &&
          <g>
            <rect x={percentX(selectionCoordinates.x1)} height={percentY(selectionCoordinates.y1) - percentY(selectionCoordinates.y2)} y={percentY(selectionCoordinates.y2)} width={percentX(selectionCoordinates.x2) - percentX(selectionCoordinates.x1)} stroke={color1} fill="none" strokeWidth='0.2' strokeDasharray="0.5 0.3" />
            <g onClick={handleDelete} className="cursor-pointer">
              <rect x={percentX(selectionCoordinates.x2) - 1} height={2} y={percentY(selectionCoordinates.y2) - 1} width={2} rx={1} ry={1} stroke={color1} fill="white" strokeWidth='0.1'></rect>
              <text x={percentX(selectionCoordinates.x2)} y={percentY(selectionCoordinates.y2)} fill={color1} fontSize={2} textAnchor="middle" dominantBaseline="middle">x</text>
            </g>
          </g>
        }
        {/* point selection */}
        {selectedObjectPoint.length > 0 && transformation == "reflection" &&
          <g>
            <circle cx={percentX(selectedObjectPoint[0])} cy={percentY(selectedObjectPoint[1])} r="0.5" fill={color1} />
            <circle cx={percentX(reflect(selectedObjectPoint, mirrorLinePoints)[0])} cy={percentY(reflect(selectedObjectPoint, mirrorLinePoints)[1])} r="0.5" fill={color2} />
            <line x1={percentX(selectedObjectPoint[0])} y1={percentY(selectedObjectPoint[1])} x2={percentX(reflect(selectedObjectPoint, mirrorLinePoints)[0])} y2={percentY(reflect(selectedObjectPoint, mirrorLinePoints)[1])} stroke="grey" strokeWidth='0.2' strokeDasharray="none" />

          </g>
        }
        {
          selectedObjectPoint.length > 0 && transformation == "rotation" &&
          <g>
            <circle cx={percentX(selectedObjectPoint[0])} cy={percentY(selectedObjectPoint[1])} r="0.5" fill={color1} />
            <circle cx={percentX(rotate(selectedObjectPoint, centerOfRotation, rotationAngle, isClockwise)[0])} cy={percentY(rotate(selectedObjectPoint, centerOfRotation, rotationAngle, isClockwise)[1])} r="0.5" fill={color2} />
            <line x1={percentX(selectedObjectPoint[0])} y1={percentY(selectedObjectPoint[1])} x2={percentX(centerOfRotation[0])} y2={percentY(centerOfRotation[1])} stroke="grey" strokeWidth='0.2' strokeDasharray="none" />
            <line x1={percentX(rotate(selectedObjectPoint, centerOfRotation, rotationAngle, isClockwise)[0])} y1={percentY(rotate(selectedObjectPoint, centerOfRotation, rotationAngle, isClockwise)[1])} x2={percentX(centerOfRotation[0])} y2={percentY(centerOfRotation[1])} stroke="grey" strokeWidth='0.2' strokeDasharray="none" />
            <path id="arc" d={`M${percentX((selectedObjectPoint[0] + 2 * centerOfRotation[0]) / 3)}
             ${percentY((selectedObjectPoint[1] + 2 * centerOfRotation[1]) / 3)} 
            A ${Math.sqrt(((percentX(selectedObjectPoint[0]) - percentX(centerOfRotation[0])) ** 2) + ((percentY(selectedObjectPoint[1]) - percentY(centerOfRotation[1])) ** 2)) / 3}
             ${Math.sqrt(((percentX(selectedObjectPoint[0]) - percentX(centerOfRotation[0])) ** 2) + ((percentY(selectedObjectPoint[1]) - percentY(centerOfRotation[1])) ** 2)) / 3}
              1 ${rotationAngle > 180 ? 1 : 0} ${isClockwise ? 1 : 0} 
              ${percentX((rotate(selectedObjectPoint, centerOfRotation, rotationAngle, isClockwise)[0] + 2 * centerOfRotation[0]) / 3)} 
              ${percentY((rotate(selectedObjectPoint, centerOfRotation, rotationAngle, isClockwise)[1] + 2 * centerOfRotation[1]) / 3)}`} stroke="grey" strokeWidth='0.2' strokeDasharray="none" fill="none" markerEnd={(rotationAngle > 0 && rotationAngle < 360) && 'url(#arrow)'} />
            {rotationAngle == 360 &&
              <circle cx={percentX(centerOfRotation[0])} cy={percentY(centerOfRotation[1])} r={Math.sqrt(((percentX(selectedObjectPoint[0]) - percentX(centerOfRotation[0])) ** 2) + ((percentY(selectedObjectPoint[1]) - percentY(centerOfRotation[1])) ** 2)) / 3} fill="none" stroke="grey" strokeWidth='0.2' />
            }
          </g>
        }
        {selectedObjectPoint.length > 0 && transformation == "translation" &&
          <>
            <circle cx={percentX(selectedObjectPoint[0])} cy={percentY(selectedObjectPoint[1])} r="0.5" fill={color1} />
            <circle cx={percentX(translate(selectedObjectPoint, transVector)[0])} cy={percentY(translate(selectedObjectPoint, transVector)[1])} r="0.5" fill={color2} />
            <line x1={percentX(selectedObjectPoint[0])} y1={percentY(selectedObjectPoint[1])} x2={percentX(translate(selectedObjectPoint, transVector)[0])} y2={percentY(translate(selectedObjectPoint, transVector)[1])} stroke="grey" strokeWidth='0.2' strokeDasharray="none" markerEnd="url(#arrow)" />
          </>

        }
        {selectedObjectPoint.length > 0 && transformation == "enlargement" &&
          <>
            <circle cx={percentX(selectedObjectPoint[0])} cy={percentY(selectedObjectPoint[1])} r="0.5" fill={color1} />
            <circle cx={percentX(enlarge(selectedObjectPoint, centerOfEnlargement, enlargementFactor)[0])} cy={percentY(enlarge(selectedObjectPoint, centerOfEnlargement, enlargementFactor)[1])} r="0.5" fill={color2} />
            <line x1={percentX(selectedObjectPoint[0])} y1={percentY(selectedObjectPoint[1])} x2={percentX(enlarge(selectedObjectPoint, centerOfEnlargement, enlargementFactor)[0])} y2={percentY(enlarge(selectedObjectPoint, centerOfEnlargement, enlargementFactor)[1])} stroke="grey" strokeWidth='0.2' strokeDasharray="none" markerEnd="url(#arrow)" />
            <line x1={percentX(selectedObjectPoint[0])} y1={percentY(selectedObjectPoint[1])} x2={percentX(centerOfEnlargement[0])} y2={percentY(centerOfEnlargement[1])} stroke="grey" strokeWidth='0.2' strokeDasharray="1 1" />
          </>}

      </svg>

    </div>
  );
}

export default Graph;
