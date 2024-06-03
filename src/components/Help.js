import React, { useEffect, useState } from "react";

function Help({ handleClose, helpFor }) {
  const [step, setStep] = useState(1);
  const color1 = "#1783b8";
  const color2 = "#4dc0ae";
  console.log(step);
  let interval = 0;
  useEffect(() => {
    interval = setTimeout(() => {
      incrementStep();
    }, 7000);

    if ((step >= 6&&helpFor=="general")|| (step >= 5&&helpFor=="reflection")) {
      handleClose();
    }
    return () => clearTimeout(interval);
  }, [step]);
  const incrementStep = () => {
    setStep(step + 1);
    clearTimeout(interval);
  };
  const getPos=(id)=>{
    let rect = document.getElementById(id).getBoundingClientRect();
    return {
      x:rect.x,
      y:rect.y
    }
  }
  return (
    <div className="help text-bold" onClick={incrementStep}>
      {helpFor == "general" && (
        <>
          <div
            className="tools fixed flex flex-col justify-center items-start p-1"
            style={{ height: "100vh" }}
          >
            <button
              type="button"
              className={`m-1 bg-[${color1}] text-white p-1 px-2 rounded ${
                step == 1 ? "help-glow" : 'opacity-0'
              }`}
            >
              <i className="fa-solid fa-draw-polygon" title="Draw objects"></i>
            </button>
            <button
              type="button"
              className={`m-1 bg-[${color1}] text-white p-1 px-2 rounded ${
                step == 2  ? "help-glow" : 'opacity-0'
              }`}              
            >
              <i className="fa-solid fa-arrow-pointer"></i>
            </button>
            <button
              type="button"
              glow
              className={`m-1 bg-[${color1}] text-white p-1 px-2 rounded ${
                step == 3 ? "help-glow" : 'opacity-0'
              }`} 
               >
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
          <div
            className="tools fixed flex flex-col justify-center items-start p-1 left-10"
            style={{ height: "100vh" }}
          >
            <div className={`m-1text-white p-1 px-2 rounded text-white`}>
{step==1?<>
                Use 'Polygon' tool to draw your objects. Select this tool and click on the grid where you whant the vertices to be.
  
</>:<p className="p-4"></p> }           </div>
            <div className={`m-1text-white p-1 px-2 rounded text-white `}>
             {step==2? <>
                Use 'Select' tool for selecting vertices to analyse their
                transformation. Or select objects to delete.
              </>:
              <p className="p-4"></p> }
            </div>
            <div className={`m-1text-white p-1 px-2 rounded text-white ${step!=3&&'opacity-0'}`}>
             {step==3?<>Delete all objects by clicking on this button.</>:
              <p className="p-4"></p> }
            </div>
          </div>
        </>
      )}

          <div
          className="tools fixed flex flex-wrap justify-start items-start p-1"
          style={{ width: "100vw" }}
        >
          <select id="select-demo"
            className={`p-1 mb-1 bg-white rounded border border-2 border-[${color1}] ${step==4&&helpFor=="general"?"help-glow":'opacity-0'}`}
          >
            <option value="reflection">Reflection</option>
            <option value="rotation">Rotation</option>
            <option value="translation">Translation</option>
            <option value="enlargement">Enlargement</option>
          </select>
          <button
            type="button"
            className={`mx-1 bg-[${color1}] text-white p-1 px-3 rounded ${step==5&&helpFor=="general"?"help-glow":'opacity-0'}`}
            id="info-demo"
          >
            <i className="fa-solid fa-info"></i>
          </button>

          {helpFor == "reflection" && (
            <>
              <button
                type="button"
                className={`mx-1 bg-[${color1}] text-white p-1 px-2 rounded`}
              >
                <i className="fa-solid fa-slash"></i>
              </button>
              <p className="mx-1 p-1 bg-white rounded border border-2 border-[${color1}]">
                Reflection on the line{" "}
                <span className="font-bold text-[#800080]">
                  y=x+5
                </span>
              </p>
            </>
          )}

          {helpFor == "rotation" && (
            <>
              <button
                type="button"
                className={`mx-1 p-1 px-2 rounded bg-[${color1}] text-white`}
              >
                <i class="fa-solid fa-rotate-left"></i>
              </button>

              <button
                type="button"
                className={`mx-1 p-1 px-2 rounded bg-[${color1}] text-white`}
              >
                <i class="fa-solid fa-rotate-right"></i>
              </button>
              <button
                type="button"
                className={`mx-1 bg-[${color1}] text-white p-1 px-2 rounded`}
              >
                <i className="fa-solid fa-circle"></i>
              </button>

              <div class="relative mt-2 w-50 flex">
                <input
                  type="range"
                  value={90}
                  min={0}
                  max={360}
                  className="peer w-25"
                />
                <input
                  type="number"
                  value={90}
                  className={`peer block w-15 p-1 bg-white rounded border border-2 border-[${color1}] focus:border-[${color2}] w-16 text-center`}
                  placeholder=" "
                />
                <label
                  for="angle-input"
                  class="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600"
                >
                  {" "}
                  Rotation angle (deg){" "}
                </label>
                {/* <div class="absolute right-1 top-1/2 -translate-y-1/2 bg-white py-1 px-1 text-gray-300 peer-placeholder-shown:text-white peer-focus:text-gray-300">°</div> */}
              </div>
              <p className="mx-1 p-1 bg-white rounded border border-2 border-[${color1}]">
                <span className="font-bold text-[#800080]">
                  {90}°{" "}
                </span>
                rotation about the point{" "}
                <span className="font-bold text-[#800080]">
                  (2, 3)
                </span>{" "}
                in{" "}
                <span className="font-bold text-[#800080]">
                  clockwise
                </span>{" "}
                direction.
              </p>
            </>
          )}
          {helpFor == "translation" && (
            <>
              <button
                type="button"
                className={`mx-1 bg-[${color1}] text-white p-1 px-3 rounded`}
              >
                <i
                  class="fa-solid fa-arrow-up-long fa-rotate-by"
                  style={{ "--fa-rotate-angle": "45deg" }}
                />
              </button>
              <p className="m-0 mx-1 p-0 px-1 bg-white rounded border border-2 border-[${color1}]">
                Translation by the vector{" "}
                <div className="inline-flex text-[#800080] text-3xl p-0">
                  [
                  <div className="inline-flex flex-col text-sm justify-center">
                    <p className="p-0 m-0">
                      {3}
                    </p>
                    <p className="p-0 m-0">
                      {2}
                    </p>
                  </div>
                  ]
                </div>
              </p>
            </>
          )}
          {helpFor == "enlargement" && (
            <>
              <button
                type="button"
                className={`mx-1 bg-[${color1}] text-white p-1 px-2 rounded`}
              >
                <i className="fa-solid fa-circle"></i>
              </button>

              <div class="mt-0 w-50 flex">
                <div className="peer w-25 flex flex-col">
                  <label
                    for="e-factor-input"
                    class="scale-75 select-none bg-white px-2 text-sm text-gray-500 my-0 text-center"
                  >
                    {" "}
                    Scale&nbsp;factor{" "}
                  </label>
                  <input
                    type="range"
                    value={2}
                    min={-10}
                    max={10}
                    step={0.1}
                  />
                  <div className="w-75 flex justify-between my-0 text-gray-500 text-sm ">
                    <div className="color-gray">-10</div>
                    <div>0</div>
                    <div>10</div>
                  </div>
                </div>

                <input
                  type="number"
                  value={2}
                  min={-10}
                  max={10}
                  className={`peer block w-15 mx-1 bg-white rounded border border-2 border-[${color1}] focus:border-[${color2}] w-16 text-center h-11`}
                  placeholder=" "
                  step={0.1}
                />
              </div>
              <p className="mx-1 p-2 bg-white rounded border border-2 border-[${color1}]">
                {" "}
                Enlargement w.r.t. the point{" "}
                <span className="font-bold text-[#800080]">
                  (3,3)
                </span>{" "}
                by the factor{" "}
                <span className="font-bold text-[#800080]">
                  {2}
                </span>
                .{" "}
              </p>
            </>
          )}
        </div>
        <div
          className="tools fixed flex flex-wrap justify-start top-10 items-start p-1 text-white"
          style={{ width: "100vw" }}
        >
             {helpFor=="general"?<>
               {step==4? <>
                  <p className="fixed " style={{top:`${getPos("select-demo").y+50}px`,left:`${getPos("select-demo").x}px`}}>
                  <i className="fa-regular fa-hand-point-up fa-fade fa-2xl"></i> &nbsp;
                    You can select the transformation here.</p>
                </>:
                <p className="p-4"></p> }
                {step==5? <>
                  <p className="fixed " style={{top:`${getPos("info-demo").y+50}px`,left:`${getPos("info-demo").x}px`}}>
                  <i className="fa-regular fa-hand-point-up fa-fade fa-2xl"></i> &nbsp;

                    Click here to see more information about the transformation.</p>
                </>:
                <p className="p-4"></p> }
             </>:
             <>
             {helpFor=="reflection"?<>
             {step==1? <>
                  Selected transformation is reflection.
                </>:
                <p className="p-4"></p> }
                {step==2? <>
                 You can use this tool to draw mirror line for reflection. Select this tool and click on two points on the grid to draw mirror line connecting them.
                </>:
                <p className="p-4"></p> }
             </>:
             <p className="p-4"></p> }
             </>
             }
          
        </div>
    </div>
  );
}

export default Help;
