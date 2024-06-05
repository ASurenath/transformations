import React, { useEffect, useRef, useState } from "react";

function Help({ handleClose, handleClose2, helpFor }) {
  const [step, setStep] = useState(1);
  const polygonDemo = useRef(null);
  const selectDemo = useRef(null);
  const deleteDemo = useRef(null);
  const selectTransDemo = useRef(null);
  const infoDemo = useRef(null);
  const mirrorDemo = useRef(null);
  const refEquationDemo = useRef(null);
  const helpDemo = useRef(null);
  const rotCenterDemo = useRef(null);
  const directionDemo = useRef(null);
  const angleDemo = useRef(null);
  const rotEquationDemo = useRef(null);
  const vectorDemo = useRef(null);
  const transEquationDemo = useRef(null);
  const enCenterDemo = useRef(null);
  const scaleDemo = useRef(null);
  const enEquationDemo = useRef(null);
  const color1 = "#1783b8";
  const color2 = "#4dc0ae";
  console.log(step);
  let interval = 0;
  // useEffect(() => {
  //   interval = setTimeout(() => {
  //     incrementStep();
  //   }, 7000);
  //   return () => clearTimeout(interval);
  // }, [step]);
  useEffect(() => {
    if (
      (step >= 7 && helpFor == "general") ||
      (step >= 5 && helpFor == "reflection") ||
      (step >= 7 && helpFor == "rotation") ||
      (step >= 5 && helpFor == "translation") ||
      (step >= 6 && helpFor == "enlargement")
    ) {
      handleClose();
    }
  }, [step]);

  const incrementStep = () => {
    setStep(step + 1);
  };
  const decrementStep = () => {
    setStep(step - 1);
  };
  const getPos = (ref) => {
    // if (!ref.current) return {};
    console.log(ref.current);
    const rect = ref.current.getBoundingClientRect();
    console.log(rect);
    return {
      x: rect.x,
      y: rect.y,
    };
  };
  const renderSkipBtn = (isPrev) => {
    return (
      <>
        <div className="w-100 flex justify-between">
          <button
            class="border border-white p-2 block m-1"
            onClick={handleClose2 || handleClose}
          >
            Skip tutorial
          </button>
          <div className="flex justify-end">
            {isPrev && (
              <button
                class="border border-white p-2 block m-1"
                onClick={decrementStep}
              >
                Previous
              </button>
            )}
            <button
              class="border border-white p-2 block m-1"
              onClick={incrementStep}
            >
              Next
            </button>
          </div>
        </div>{" "}
      </>
    );
  };

  return (
    <div className="help text-bold">
      {helpFor == "general" && (
        <>
          <div
            className="tools fixed flex flex-col justify-center items-start p-1"
            style={{ height: "100vh" }}
          >
            <button
              type="button"
              ref={polygonDemo}
              className={`m-1 bg-[${color1}] text-white p-1 px-2 rounded ${
                step == 2 ? "help-glow" : "opacity-0"
              }`}
            >
              <i className="fa-solid fa-draw-polygon" title="Draw objects"></i>
            </button>
            <button
              ref={selectDemo}
              type="button"
              className={`m-1 bg-[${color1}] text-white p-1 px-2 rounded ${
                step == 3 ? "help-glow" : "opacity-0"
              }`}
            >
              <i className="fa-solid fa-arrow-pointer"></i>
            </button>
            <button
              ref={deleteDemo}
              type="button"
              className={`m-1 bg-[${color1}] text-white p-1 px-2 rounded ${
                step == 4 ? "help-glow" : "opacity-0"
              }`}
            >
              <i className="fa-solid fa-trash"></i>
            </button>
            <hr className="w-full opacity-0" />
            <button
              type="button"
              className={`m-1 bg-[${color1
              }] text-white p-1 px-0.5 rounded crossed} opacity-0`}
            >
              (x,y)
            </button>
          </div>
        </>
      )}

      <div
        className="tools fixed flex flex-wrap justify-start items-start p-1"
        style={{ width: "100vw" }}
      >
        <select
          disabled
          value={helpFor}
          ref={selectTransDemo}
          className={`p-1 mb-1 bg-white rounded border border-2 border-[${color1}] ${
            step == 5 && helpFor == "general" ? "help-glow" : "opacity-0"
          }`}
        >
          {helpFor == "rotation" && <option value="rotation">Rotation</option>}
          {helpFor == "translation" && (
            <option value="translation">Translation</option>
          )}
          {helpFor == "enlargement" && (
            <option value="enlargement">Enlargement</option>
          )}
          <option value="reflection">Reflection</option>
          <option value="rotation">Rotation</option>
          <option value="translation">Translation</option>
          <option value="enlargement">Enlargement</option>
        </select>
        <button
          type="button"
          className={`mx-1 bg-[${color1}] text-white p-1 px-3 rounded ${
            step == 6 && helpFor == "general" ? "help-glow" : "opacity-0"
          }`}
          ref={infoDemo}
        >
          <i className="fa-solid fa-info"></i>
        </button>

        {helpFor == "reflection" && (
          <>
            <button
              type="button"
              className={`mx-1 bg-[${color1}] text-white p-1 px-2 rounded ${
                step == 2 ? "help-glow" : "opacity-0"
              }`}
              ref={mirrorDemo}
            >
              <i className="fa-solid fa-slash"></i>
            </button>
            <p
              className={`mx-1 p-1 bg-white rounded border border-2 border-[${color1}] ${
                step == 3 ? "help-glow" : "opacity-0"
              }`}
              ref={refEquationDemo}
            >
              Reflection on the line{" "}
              <span className="font-bold text-[#800080]">y=x+5</span>
            </p>
          </>
        )}

        {helpFor == "rotation" && (
          <>
            <div
              className={`flex flex-col items-center relative ${
                step == 2 ? "help-glow" : "opacity-0"
              }`}
              ref={directionDemo}
            >
              <span
                for="angle-input"
                class="absolute top-2 left-1 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600"
              >
                Direction
              </span>
              <div className={`flex items-center justify-center mt-2 z-10`}>
                <button
                  type="button"
                  className={`mx-0.5 p-0 px-2 rounded bg-[${color1}] text-white`}
                >
                  <i class="fa-solid fa-rotate-left fa-xs"></i>
                </button>

                <button
                  type="button"
                  className={`mx-0.5 p-0 px-2 rounded bg-[${color2}] text-white`}
                >
                  <i class="fa-solid fa-rotate-right fa-xs"></i>
                </button>
              </div>
            </div>
            {/* <button
              type="button"
              className={`mx-1 p-1 px-2 rounded bg-[${color1}] text-white ${
                step == 2 ? "help-glow" : "opacity-0"
              }`}
              ref={directionDemo}
            >
              <i class="fa-solid fa-rotate-left"></i>
            </button>

            <button
              type="button"
              className={`mx-1 p-1 px-2 rounded bg-[${color1}] text-white
              ${step == 2 ? "help-glow" : "opacity-0"}`}
            >
              <i class="fa-solid fa-rotate-right"></i>
            </button> */}
            <button
              type="button"
              className={`mx-1 bg-[${color1}] text-white p-1 px-2 rounded
              ${step == 3 ? "help-glow" : "opacity-0"}`}
              ref={rotCenterDemo}
            >
              <i className="fa-solid fa-circle"></i>
            </button>

            <div
              class={`relative mt-2 w-50 flex ${
                step == 4 ? "help-glow" : "opacity-0"
              }`}
              ref={angleDemo}
            >
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
            <p
              className={`mx-1 p-1 bg-white rounded border border-2 border-[${color1}] ${
                step == 5 ? "help-glow" : "opacity-0"
              }`}
              ref={rotEquationDemo}
            >
              <span className=" text-[#800080]">{90}° </span>
              rotation about the point{" "}
              <span className=" text-[#800080]">(2, 3)</span> in{" "}
              <span className=" text-[#800080]">clockwise</span> direction.
            </p>
          </>
        )}
        {helpFor == "translation" && (
          <>
            <button
              type="button"
              className={`mx-1 bg-[${color1}] text-white p-1 px-3 rounded ${
                step == 2 ? "help-glow" : "opacity-0"
              }`}
              ref={vectorDemo}
            >
              <i
                class="fa-solid fa-arrow-up-long fa-rotate-by"
                style={{ "--fa-rotate-angle": "45deg" }}
              />
            </button>
            <p
              className={`m-0 mx-1 p-0 px-1 bg-white rounded border border-2 border-[${color1}] ${
                step == 3 ? "help-glow" : "opacity-0"
              }`}
              ref={transEquationDemo}
            >
              Translation by the vector{" "}
              <div className="inline-flex text-[#800080] text-3xl p-0">
                [
                <div className="inline-flex flex-col text-sm justify-center">
                  <p className="p-0 m-0">{3}</p>
                  <p className="p-0 m-0">{1}</p>
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
              className={`mx-1 bg-[${color1}] text-white p-1 px-2 rounded ${
                step == 2 ? "help-glow" : "opacity-0"
              }`}
              ref={enCenterDemo}
            >
              <i className="fa-solid fa-circle"></i>
            </button>

            <div
              class={`mt-0 w-50 flex ${step == 3 ? "help-glow" : "opacity-0"}`}
              ref={scaleDemo}
            >
              <div className="peer w-25 flex flex-col">
                <label
                  for="e-factor-input"
                  class="scale-75 select-none bg-white px-2 text-sm text-gray-500 my-0 text-center"
                >
                  {" "}
                  Scale&nbsp;factor{" "}
                </label>
                <input type="range" value={2} min={-10} max={10} step={0.1} />
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
            <p
              className={`mx-1 p-2 bg-white rounded border border-2 border-[${color1}] ${
                step == 4 ? "help-glow" : "opacity-0"
              }`}
              ref={enEquationDemo}
            >
              {" "}
              Enlargement w.r.t. the point{" "}
              <span className=" text-[#800080]">(-9, 9)</span> by the factor{" "}
              <span className=" text-[#800080]">{2}</span>. Image is bigger than
              the object as magnitude of the scale factor is greater than 1
            </p>
          </>
        )}
      </div>
      {/* ? */}
      <div className="tools fixed justify-center items-center bottom-4 left-1">
        <button
          type="button"
          className={`m-1 bg-[${color1}] text-white p-1 px-2 rounded block ${
            (helpFor == "reflection" && step == 4) ||
            (helpFor == "rotation" && step == 6) ||
            (helpFor == "translation" && step == 4) ||
            (helpFor == "enlargement" && step == 5)
              ? "help-glow"
              : "opacity-0"
          }`}
          ref={helpDemo}
        >
          <i className="fa-solid fa-question" />
        </button>
      </div>

      {/* description */}
      <div
        className="tools fixed flex flex-wrap justify-start top-10 items-start p-1 text-white"
        style={{ width: "100vw", height: "100vh" }}
      >
        {helpFor == "general" && (
          <>
            {step == 1 && (
              <p
                className="p-4 absolute text-base md:text-2xl help-glow-box"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                }}
              >
                This is an app for the visualization of different{" "}
                <span className={`text-[${color2}]`}>transformations</span>,
                such as{" "}
                <span className={`text-[${color2}]`}>
                  reflection, rotation, translation,
                </span>{" "}
                and <span className={`text-[${color2}]`}>enlargement.</span> You
                can draw your <span className={`text-[${color1}]`}>object</span>{" "}
                and set the parameters for{" "}
                <span className={`text-[${color2}]`}>transformation</span> to
                see how the <span className={`text-[${color1}]`}>object</span>{" "}
                <span className={`text-[${color2}]`}>transforms.</span>
                {renderSkipBtn()}
              </p>
            )}
            {step == 2 && (
              <p
                className="p-4 absolute text-base md:text-2xl"
                style={{
                  top: `${getPos(polygonDemo).y - 50}px`,
                  left: `${getPos(polygonDemo).x + 50}px`,
                }}
              >
                <i className="fa-regular fa-hand-point-left fa-fade fa-xl"></i>
                &nbsp; Use <span className={`text-[${color1}]`}>
                  'Polygon'
                </span>{" "}
                tool to draw your{" "}
                <span className={`text-[${color1}]`}>objects</span>. Select this
                tool and click on the grid where you whant the vertices to be.
                {renderSkipBtn(true)}
              </p>
            )}
            {step == 3 && (
              <p
                className="p-4 absolute  text-base md:text-2xl"
                style={{
                  top: `${getPos(selectDemo).y - 50}px`,
                  left: `${getPos(selectDemo).x + 50}px`,
                }}
              >
                <i className="fa-regular fa-hand-point-left fa-fade fa-xl"></i>
                &nbsp;Use <span className={`text-[${color1}]`}>
                  'Select'
                </span>{" "}
                tool for selecting{" "}
                <span className={`text-[${color1}]`}>vertices</span> to analyse
                their
                <span className={`text-[${color2}]`}> transformation </span>. Or
                select <span className={`text-[${color1}]`}>objects</span> to
                delete.
                {renderSkipBtn(true)}
              </p>
            )}
            {step == 4 && (
              <p
                className="p-4 absolute  text-base md:text-2xl md:text-l"
                style={{
                  top: `${getPos(deleteDemo).y - 50}px`,
                  left: `${getPos(deleteDemo).x + 50}px`,
                }}
              >
                <i className="fa-regular fa-hand-point-left fa-fade fa-xl"></i>
                &nbsp;Delete all{" "}
                <span className={`text-[${color1}]`}>objects</span> by clicking
                on this button.
                {renderSkipBtn(true)}
              </p>
            )}

            {step == 5 && (
              <>
                <p
                  className="p-4 absolute  text-base md:text-2xl "
                  style={{
                    top: `${getPos(selectTransDemo).y + 10}px`,
                  }}
                >
                  <div
                    style={{
                      transform: `translateX(${getPos(selectTransDemo).x}px`,
                    }}
                  >
                    <i className="fa-regular fa-hand-point-up fa-fade fa-xl"></i>
                  </div>
                  &nbsp; You can change the transformation here.
                  {renderSkipBtn(true)}
                </p>
              </>
            )}
            {step == 6 && (
              <>
                <p
                  className="p-4 absolute  text-base md:text-2xl "
                  style={{
                    top: `${getPos(infoDemo).y + 10}px`,
                  }}
                >
                  <div
                    style={{
                      transform: `translateX(${getPos(infoDemo).x}px`,
                    }}
                  >
                    <i className="fa-regular fa-hand-point-up fa-fade fa-xl"></i>
                  </div>
                  Click here to see more information about the selected
                  transformation.
                  {renderSkipBtn(true)}
                </p>
              </>
            )}
          </>
        )}
        {helpFor == "reflection" && (
          <>
            {step == 1 && (
              <p
                className="p-4 absolute text-base md:text-2xl help-glow-box"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                }}
              >
                Currently selected transformation is{" "}
                <span className={`text-[${color2}]`}>'reflection'.</span>
                {renderSkipBtn()}
              </p>
            )}
            {step == 2 && (
              <p
                className="p-4 absolute  text-base md:text-2xl"
                style={{
                  top: `${getPos(mirrorDemo).y + 10}px`,
                }}
              >
                <div
                  style={{
                    transform: `translateX(${getPos(mirrorDemo).x}px)`,
                  }}
                >
                  <i className="fa-regular fa-hand-point-up fa-fade fa-xl"></i>
                </div>
                Select this tool and click on two points on the grid to draw
                <span className="text-[pink]"> mirror line</span> connecting
                them.
                {renderSkipBtn(true)}
              </p>
            )}
            {step == 3 && (
              <p
                className="p-4 absolute  text-base md:text-2xl"
                style={{
                  top: `${getPos(refEquationDemo).y + 10}px`,
                }}
              >
                <div
                  style={{
                    transform: `translateX(${getPos(refEquationDemo).x}px`,
                  }}
                >
                  <i className="fa-regular fa-hand-point-up fa-fade fa-xl"></i>
                </div>
                You can see the equation of your{" "}
                <span className="text-[pink]">mirror line</span> here.
                {renderSkipBtn(true)}
              </p>
            )}
            {step == 4 && (
              <p
                className="p-4 absolute  text-base md:text-2xl"
                style={{
                  bottom: 30,
                  left: `${getPos(helpDemo).x + 50}px`,
                }}
              >
                <i
                  className="fa-regular fa-hand-point-left fa-fade fa-xl fa-rotate-by"
                  style={{ "--fa-rotate-angle": "-45deg" }}
                ></i>{" "}
                &nbsp; If you want to see this tutorial again click on this
                question mark.
                {renderSkipBtn(true)}
              </p>
            )}
          </>
        )}
        {helpFor == "rotation" && (
          <>
            {step == 1 && (
              <p
                className="p-4 absolute text-base md:text-2xl help-glow-box"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                }}
              >
                Currently selected transformation is{" "}
                <span className={`text-[${color2}]`}>'rotation'.</span>
                {renderSkipBtn()}
              </p>
            )}
            {step == 2 && (
              <p
                className="p-4 absolute  text-base md:text-2xl"
                style={{
                  top: `${getPos(directionDemo).y + 10}px`,
                }}
              >
                <div
                  style={{
                    transform: `translateX(${getPos(directionDemo).x}px)`,
                  }}
                >
                  <i className="fa-regular fa-hand-point-up fa-fade fa-xl"></i>
                </div>
                You can select the{" "}
                <span className="text-[pink]"> direction of rotation</span>{" "}
                here.
                {renderSkipBtn(true)}
              </p>
            )}
            {step == 3 && (
              <p
                className="p-4 absolute  text-base md:text-2xl"
                style={{
                  top: `${getPos(rotCenterDemo).y + 10}px`,
                }}
              >
                <div
                  style={{
                    transform: `translateX(${getPos(rotCenterDemo).x}px)`,
                  }}
                >
                  <i className="fa-regular fa-hand-point-up fa-fade fa-xl"></i>
                </div>
                Use this tool to mark the
                <span className="text-[pink]"> center of rotation.</span>
                {renderSkipBtn(true)}
              </p>
            )}
            {step == 4 && (
              <p
                className="p-4 absolute  text-base md:text-2xl"
                style={{
                  top: `${getPos(angleDemo).y + 10}px`,
                }}
              >
                <div
                  style={{
                    transform: `translateX(${getPos(angleDemo).x}px)`,
                  }}
                >
                  <i className="fa-regular fa-hand-point-up fa-fade fa-xl"></i>
                </div>
                <span className="text-[pink]"> Angle of rotation </span> can be
                changed here.
                {renderSkipBtn(true)}
              </p>
            )}
            {step == 5 && (
              <p
                className="p-4 absolute  text-base md:text-2xl"
                style={{
                  top: `${getPos(rotEquationDemo).y + 10}px`,
                }}
              >
                <div
                  style={{
                    transform: `translateX(${getPos(rotEquationDemo).x}px)`,
                  }}
                >
                  <i className="fa-regular fa-hand-point-up fa-fade fa-xl"></i>
                </div>
                You can see the current{" "}
                <span className="text-[pink]">
                  {" "}
                  angle of rotation, center of rotation,{" "}
                </span>{" "}
                and the{" "}
                <span className="text-[pink]">
                  direction of the rotation
                </span>{" "}
                here.
                {renderSkipBtn(true)}
              </p>
            )}
            {step == 6 && (
              <p
                className="p-4 absolute  text-base md:text-2xl"
                style={{
                  bottom: 30,
                  left: `${getPos(helpDemo).x + 50}px`,
                }}
              >
                <i
                  className="fa-regular fa-hand-point-left fa-fade fa-xl fa-rotate-by"
                  style={{ "--fa-rotate-angle": "-45deg" }}
                ></i>{" "}
                &nbsp; If you want to see this tutorial again click on this
                question mark.
                {renderSkipBtn(true)}
              </p>
            )}
          </>
        )}
        {helpFor == "translation" && (
          <>
            {step == 1 && (
              <p
                className="p-4 absolute text-base md:text-2xl help-glow-box"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                }}
              >
                Currently selected transformation is{" "}
                <span className={`text-[${color2}]`}>'translation'.</span>
                {renderSkipBtn()}
              </p>
            )}
            {step == 2 && (
              <p
                className="p-4 absolute  text-base md:text-2xl"
                style={{
                  top: `${getPos(vectorDemo).y + 10}px`,
                }}
              >
                <div
                  style={{
                    transform: `translateX(${getPos(vectorDemo).x}px)`,
                  }}
                >
                  <i className="fa-regular fa-hand-point-up fa-fade fa-xl"></i>
                </div>
                Use this tool to draw
                <span className="text-[pink]"> translation vector</span>{" "}
                anywhere on the grid. Select this tool and click on two points
                to draw vector from the first point to the second point.
                {renderSkipBtn(true)}
              </p>
            )}

            {step == 3 && (
              <p
                className="p-4 absolute  text-base md:text-2xl"
                style={{
                  top: `${getPos(transEquationDemo).y + 10}px`,
                }}
              >
                <div
                  style={{
                    transform: `translateX(${getPos(transEquationDemo).x}px)`,
                  }}
                >
                  <i className="fa-regular fa-hand-point-up fa-fade fa-xl"></i>
                </div>
                You can see the current{" "}
                <span className="text-[pink]"> translation vector</span> here.
                {renderSkipBtn(true)}
              </p>
            )}
            {step == 4 && (
              <p
                className="p-4 absolute  text-base md:text-2xl"
                style={{
                  bottom: 30,
                  left: `${getPos(helpDemo).x + 50}px`,
                }}
              >
                <i
                  className="fa-regular fa-hand-point-left fa-fade fa-xl fa-rotate-by"
                  style={{ "--fa-rotate-angle": "-45deg" }}
                ></i>{" "}
                &nbsp; If you want to see this tutorial again click on this
                question mark.
                {renderSkipBtn(true)}
              </p>
            )}
          </>
        )}
        {helpFor == "enlargement" && (
          <>
            {step == 1 && (
              <p
                className="p-4 absolute text-base md:text-2xl help-glow-box"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%,-50%)",
                }}
              >
                Currently selected transformation is{" "}
                <span className={`text-[${color2}]`}>'enlargement'.</span>
                {renderSkipBtn()}
              </p>
            )}
            {step == 2 && (
              <p
                className="p-4 absolute  text-base md:text-2xl"
                style={{
                  top: `${getPos(enCenterDemo).y + 10}px`,
                }}
              >
                <div
                  style={{
                    transform: `translateX(${getPos(enCenterDemo).x}px)`,
                  }}
                >
                  <i className="fa-regular fa-hand-point-up fa-fade fa-xl"></i>
                </div>
                Select this tool to mark the
                <span className="text-[pink]"> center of enlargement</span>{" "}
                anywhere on the grid.
                {renderSkipBtn(true)}
              </p>
            )}

            {step == 3 && (
              <p
                className="p-4 absolute  text-base md:text-2xl"
                style={{
                  top: `${getPos(scaleDemo).y + 10}px`,
                }}
              >
                <div
                  style={{
                    transform: `translateX(${getPos(scaleDemo).x}px)`,
                  }}
                >
                  <i className="fa-regular fa-hand-point-up fa-fade fa-xl"></i>
                </div>
                <span className="text-[pink]">
                  Scale factor of enlargement{" "}
                </span>{" "}
                can be be changed here.
                {renderSkipBtn(true)}
              </p>
            )}
            {step == 4 && (
              <p
                className="p-4 absolute text-base md:text-2xl"
                style={{
                  top: `${getPos(enEquationDemo).y + 60}px`,
                }}
              >
                <div
                  style={{
                    transform: `translateX(${getPos(enEquationDemo).x + 50}px)`,
                  }}
                >
                  <i className="fa-regular fa-hand-point-up fa-fade fa-xl"></i>
                </div>
                <span className="text-[pink]">Center of enlargement </span> and{" "}
                <span className="text-[pink]">
                  Scale factor of enlargement{" "}
                </span>{" "}
                are shown here.
                {renderSkipBtn(true)}
              </p>
            )}
            {step == 5 && (
              <p
                className="p-4 absolute  text-base md:text-2xl"
                style={{
                  bottom: 30,
                  left: `${getPos(helpDemo).x + 50}px`,
                }}
              >
                <i
                  className="fa-regular fa-hand-point-left fa-fade fa-xl fa-rotate-by"
                  style={{ "--fa-rotate-angle": "-45deg" }}
                ></i>{" "}
                &nbsp; If you want to see this tutorial again click on this
                question mark.
                {renderSkipBtn(true)}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Help;
