// const fs = require("fs");
// const stlSerializer = require("@jscad/stl-serializer");

// https://openjscad.xyz/dokuwiki/doku.php?id=en:design_guide_rotate

// https://github.com/jscad/OpenJSCAD.org/discussions/883
const jscad = require("@jscad/modeling");
const {
  connectors,
  geometry,
  geometries,
  maths,
  primitives,
  text,
  utils,
  booleans,
  expansions,
  extrusions,
  hulls,
  measurements,
  transforms,
  colors,
} = jscad;

const {
  cuboid,
  sphere,
  cylinder,
  circle,
  star,
  cylinderElliptic,
  polyhedron,
  roundedRectangle,
  rectangle,
} = primitives;
const { translate, scale, center, rotate } = transforms;
const { union, subtract, intersect } = booleans;
// const { path2, geom2, geom3, poly2, poly3 } = geometries;
// const {
//   slice,
//   extrudeFromSlices,
//   extrudeLinear,
//   extrudeRectangular,
//   extrudeRotate,
//   project,
// } = extrusions;
// const { mat4, line2, line3, vec2, vec3, vec4 } = maths;

const { degToRad } = utils;

const { colorize, hexToRgb } = colors;

// function degToRad(degrees) {
//   return degrees * (Math.PI / 180);
// }

const TRANSPARENT_RED = [1, 0.5, 0.3, 0.6];
const TRANSPARENT_BLUE = [0, 0, 1, 0.6];
const TRANSPARENT_GREEN = [0, 1, 1, 0.7];

// A function declaration that returns geometry
// const main = () => {
//   return cube()
// }

// const {
//   primitives: { cuboid },
// } = require("@jscad/modeling");
// const { intersect, subtract, union } = require("@jscad/modeling").booleans;
// const { cube, cuboid } = require("@jscad/modeling").primitives;

// const {cylinder} = require('@jscad/csg/api').primitives3d
// const {color} = require('@jscad/csg/api').color
// const {difference} = require('@jscad/csg/api').booleanOps
// const {translate} = require('@jscad/csg/api').transformations
// jscad

const options = {
  inner: {
    height: 27,
    radius: 19.5 / 2,
  },
  thread: {
    top: 4,
    width: 8.5,
    heightStart: 3.5,
    heightEnd: 4,
    radius: 32.5 / 2,
  },
  top: {
    height: 16,
    radius: 27.5 / 2,
  },
  bottom: {
    height: 14,
    radius: 40 / 2,
  },
  foot: {
    length: 28,
    width: 14,
    heightStart: 5,
    heightEnd: 8,
  },
  resolution: 120,
  overlap: 0.5,
};

// https://stl.parts/editor/?fork=wedge
function wedge(params) {
  const { heightBack, heightFront, widthBack, widthFront, length } = params;

  var halfDiffFrontBack = (params.widthBack - params.widthFront) / 2;
  var shape = polyhedron({
    points: [
      [0, 0, 0],
      [params.widthFront, 0, 0],
      [0 - halfDiffFrontBack, params.length, 0],
      [params.widthBack - halfDiffFrontBack, params.length, 0],
      [0, 0, params.heightFront],
      [params.widthFront, 0, params.heightFront],
      [0 - halfDiffFrontBack, params.length, params.heightBack],
      [params.widthBack - halfDiffFrontBack, params.length, params.heightBack],
    ],
    faces: [
      [0, 2, 1],
      [1, 2, 3],
      [4, 5, 6],
      [6, 5, 7],
      [3, 5, 1],
      [3, 7, 5],
      [0, 4, 2],
      [4, 6, 2],
      [1, 5, 0],
      [5, 4, 0],
      [2, 7, 3],
      [2, 6, 7],
    ],
  });
  // return centerShape(shape);
  return shape;
}

function main() {
  // return [sphere()];
  // return [cuboid(), cuboid().translate([0, 5, 5])];

  const top = colorize(
    TRANSPARENT_GREEN,
    cylinder({
      radius: options.top.radius,
      height: options.top.height + options.overlap,
      center: [
        0,
        0,
        options.bottom.height + options.top.height / 2 - options.overlap / 2,
      ],
      segments: options.resolution,
    })
  );
  const bottom = colorize(
    TRANSPARENT_RED,
    cylinder({
      radius: options.bottom.radius,
      height: options.bottom.height,
      center: [0, 0, options.bottom.height / 2],
      segments: options.resolution,
    })
  );

  // const foot = colorize(
  //   TRANSPARENT_BLUE,
  //   cuboid({
  //     size: [options.foot.length, options.foot.width, options.foot.heightStart],
  //     center: [
  //       options.foot.length / 2 + options.bottom.radius,
  //       0,
  //       options.foot.heightStart / 2,
  //     ],
  //   })
  // );
  //

  const baseWedgeFooter = (() => {
    const overflowFactor = 1.2;
    return wedge({
      widthFront: options.foot.width,
      heightFront: options.foot.heightStart,
      widthBack: options.foot.width,
      heightBack:
        options.foot.heightStart +
        (options.foot.heightEnd - options.foot.heightStart) * overflowFactor,
      length: options.foot.length * overflowFactor,
    });
  })();

  // move to outer radius
  const movedBaseWedgeFooter = translate(
    [0, 0 - options.bottom.radius, 0],
    // bring to zero-point
    translate(
      [
        0 - options.foot.width / 2,
        0 - options.foot.length, // - options.bottom.radius,
        0,
      ],
      baseWedgeFooter
    )
  );

  const wedgeFooter = colorize(
    TRANSPARENT_BLUE,

    // move to outer radius
    [
      movedBaseWedgeFooter,
      rotate([0, 0, degToRad(90)], movedBaseWedgeFooter),
      rotate([0, 0, degToRad(180)], movedBaseWedgeFooter),
      rotate([0, 0, degToRad(270)], movedBaseWedgeFooter),
    ]
  );
  // const wedgeFooter2 = colorize(
  //   TRANSPARENT_BLUE,

  //   // move to outer radius
  //   rotate([0, 0, degToRad(90)], movedBaseWedgeFooter)
  // );

  // thread: {
  //   top:4,
  //   width: 8.5,
  //   height: 4, // smaller end 3.5
  //   radius: 32.5 / 2,
  // },

  const baseWedgeThread = (() => {
    return wedge({
      widthFront: options.thread.radius,
      heightFront: options.thread.heightEnd,
      widthBack: options.thread.radius,
      heightBack: options.thread.heightStart,
      length: options.thread.width,
    });
  })();

  const movedBaseWedgeThread = translate(
    [
      options.thread.radius / 2,
      0,
      options.bottom.height + options.top.height - options.thread.top,
    ],

    // bring to zero-point
    rotate(
      [0, degToRad(180), 0],
      translate(
        [0 - options.thread.radius, 0 - options.thread.width / 2, 0],
        baseWedgeThread
      )
    )
  );

  const wedgeThread = colorize(
    TRANSPARENT_BLUE,

    // move to outer radius
    union(
      movedBaseWedgeThread,
      rotate([0, 0, degToRad(90)], movedBaseWedgeThread),
      rotate([0, 0, degToRad(180)], movedBaseWedgeThread),
      rotate([0, 0, degToRad(270)], movedBaseWedgeThread)
    )
  );

  const wedgeThreadOutter = colorize(
    TRANSPARENT_GREEN,
    cylinder({
      radius: options.thread.radius,
      height: options.top.height + options.overlap,
      center: [
        0,
        0,
        options.bottom.height + options.top.height / 2 - options.overlap / 2,
      ],
      segments: options.resolution,
    })
  );

  const thread = intersect(wedgeThreadOutter, wedgeThread);

  const inner = colorize(
    TRANSPARENT_RED,
    cylinder({
      radius: options.inner.radius,
      height: options.inner.height + options.overlap,
      center: [
        0,
        0,
        options.bottom.height +
          options.top.height -
          options.inner.height / 2 +
          options.overlap / 2,
      ],
      segments: options.resolution,
    })
  );
  // return [foot, wedgeFooter];
  // return [wedgeFooter, thread, inner, top, bottom];

  return subtract(union(wedgeFooter, thread, inner, top, bottom), inner);

  // return [c];
}

console.log({
  h: options.bottom.height + options.top.height,
  r: options.foot.length * 2 + options.bottom.radius * 2,
});

main();

module.exports.main = main;
