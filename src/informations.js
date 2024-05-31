const color1 = "#1783b8"
const color2 = "#4dc0ae"
export const info = {
    reflection: (handleClose) => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.info-box')) {
                // If the clicked element is not within the .info-box, close the info box
                handleClose();
            }
        };

        return (
            <div className="info" onClick={handleClickOutside}>
                <div className="info-box">
                    <div className="flex justify-end align-start">
                        <button type="button" onClick={handleClose} className="text-black">x</button>
                    </div>
                    <h1 className={`text-center text-3xl font-bold`} style={{ color: color2 }}>Reflection</h1>
                    <p className="text-center">
                        <span style={{ color: color2 }}>Reflection</span> is like making a mirror image of something. Imagine there's a line called a <span style={{ color: "purple" }}>mirror line</span>. When we <span style={{ color: color2 }}>reflect</span> a point across this line, we're making a copy of it as if it were in a mirror.

                    </p>            <img src="reflection.png" alt="reflection" className="w-1/2 mx-auto" />
                    <p className="text-center">
                    <span style={{ color: color2 }}>Reflecting</span> a <span style={{ color: color1 }}>shape</span>, like a <span style={{ color: color1 }}>triangle</span>, is like folding it over the <span style={{ color:"purple" }}>mirror line</span>. First, draw the shape you want to <span style={{ color: color2 }}>reflect</span>. For each point on the shape, draw a perpendicular line straight down to the <span style={{ color: "purple" }}>mirror line</span>. After that, draw the same distance on the other side of the <span style={{ color: "purple" }}>mirror line.</span> Connect these new points to make the <span style={{ color: color2 }}>reflected</span> shape.</p>
                </div>
            </div>
        );
    },
    rotation: (handleClose) => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.info-box')) {
                // If the clicked element is not within the .info-box, close the info box
                handleClose();
            }
        };

        return (
            <div className="info" onClick={handleClickOutside}>
                <div className="info-box">
                    <div className="flex justify-end align-start">
                        <button type="button" onClick={handleClose} className="text-black">x</button>
                    </div>
                    <h1 className={`text-center text-3xl font-bold`} style={{ color: color2 }}>Rotation</h1>
                    <p className="text-center">
                    <span style={{ color: color2 }}>Rotating</span> an <span style={{ color: color1 }}>object</span> means turning it around a fixed point called the <span style={{ color: "purple" }}>center of rotation</span>. 
                    </p>
                    <img src="rotation.png" alt="rotation" className="w-1/2 mx-auto" />
                    <p className="text-center">
                    First, draw the <span style={{ color: color1 }}>shape</span> you want to <span style={{ color: color2 }}>rotate</span>. Then, choose whether you want to turn it <span style={{ color: "purple" }}>clockwise</span> (like a clock's hands) or <span style={{ color: "purple" }}>counterclockwise</span> (the other way). For each point on the shape, imagine a line connecting it to the <span style={{ color: "purple" }}>center of rotation.</span> Turn that line in the chosen direction. The point moves to a new spot on the turned line. Once you've turned all the points, connect them to make the <span style={{ color: color2 }}>rotated shape.</span> It's like spinning the shape around the <span style={{ color: "purple" }}>center of rotation!</span>
                    </p>
                </div>
            </div>
        );
    },
    translation: (handleClose) => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.info-box')) {
                // If the clicked element is not within the .info-box, close the info box
                handleClose();
            }
        };

        return (
            <div className="info" onClick={handleClickOutside}>
                <div className="info-box">
                    <div className="flex justify-end align-start">
                        <button type="button" onClick={handleClose} className="text-black">x</button>
                    </div>
                    <h1 className={`text-center text-3xl font-bold`} style={{ color: color2 }}>Translation</h1>
                    <p className=""><span style={{ color: color2 }}>Moving</span> an <span style={{ color: color1 }}>object</span> from one place to another is called <span style={{ color: color2 }}>translation</span>. It's like picking up the <span style={{ color: color1 }}>object</span> and placing it somewhere else.</p>
                    <img src="translation.png" alt="enlargement" className="w-1/2 mx-auto" />
                    <p className="text-center"> To do this, we use something called a <span style={{color:"purple"}}>translation vector.</span> This vector has two parts: one for moving in the horizontal direction (called x) and one for moving in the vertical direction (called y). Imagine arrows pointing in these directions. We put the tail of these arrows on the starting point of the object. Then, where the arrows point is where the <span style={{ color: color1 }}>object</span> moves to. It's like shifting the object along the x-axis (horizontal) and the y-axis (vertical), while keeping its shape and size the same.</p>
                </div>
            </div>
        );
    }
    ,
    enlargement: (handleClose) => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.info-box')) {
                // If the clicked element is not within the .info-box, close the info box
                handleClose();
            }
        };

        return (
            <div className="info" onClick={handleClickOutside}>
                <div className="info-box">
                    <div className="flex justify-end align-start">
                        <button type="button" onClick={handleClose} className="text-black">x</button>
                    </div>
                    <h1 className={`text-center text-3xl font-bold`} style={{ color: color2 }}>Enlargement</h1>
                    <p><span style={{ color: color2 }}>Enlarging</span> something means making it bigger or smaller(Yes, here we consider it as enlargement too!).</p>
<img src="enlargemet.png" alt="enlargement" className="w-1/2 mx-auto" />
                    <p className="text-center">
                     We use a point called the <span style={{ color: "purple" }}>center of enlargement</span> and a <span style={{ color: "purple" }}>scale factor of enlargement</span> to do this. First, draw the <span style={{ color: color1 }}>shape</span> you want to <span style={{ color: color2 }}>enlarge</span>. Decide where the <span style={{ color: "purple" }}>center of enlargement</span> is. Then, pick a <span style={{ color: "purple" }}>scale factor.</span> If the scale factor is greater than 1, the shape gets <span style={{ color: color2 }}>bigger</span>; if it's less than 1, it gets <span style={{ color: color2 }}>smaller</span>. For each point on the shape, measure the distance from the <span style={{ color: "purple" }}>center of enlargement.</span> Multiply this distance by the <span style={{ color: "purple" }}>scale factor.</span> Draw the point again, but this time, farther or closer to the center, according to the multiplied distance. Repeat this for every point. It's like stretching or squeezing the shape from the center, making it bigger or smaller while keeping the shape's proportions the same.
                        </p>
                </div>
            </div>
        );
    }
}