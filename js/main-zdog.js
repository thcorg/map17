// Zdog model //
Zfont.init(Zdog);
let illo = new Zdog.Illustration({
    element: '.zdog-canvas',
    rotate: { x: -.35 },
    resize: true,
});
let font = new Zdog.Font({
    src: 'fonts/HarmonyOS_Sans_Light.ttf'
});

var i = 0;
var t = 0;
var tSpeed = 1/480;

function animate() {
    t += tSpeed;
    var theta = Zdog.easeInOut( t % 1 ) *Zdog.TAU;
    var delta = Zdog.TAU * -5/64;
    illo.rotate.y = Math.sin( theta ) * delta;
    var progress = Math.cos(Zdog.easeInOut((i / 600) % 1, 1) * Zdog.TAU) * 30 + 60;
    blackboard_2.translate.x = -progress;
    blackboard_3.translate.x = progress;
    i++;
    wallLeft.visible = !(illo.rotate.y < 0);
    wallRight.visible = !(illo.rotate.y > 0);
    illo.updateRenderGraph();
    requestAnimationFrame(animate);
}

// Colors
const COLOR_WHITE = "#FFF";
const COLOR_RED = "#F00";
const COLOR_BLACK = "#000";
const COLOR_BLACKBOARD_FACE = "#0B610B";
const COLOR_BLACKBOARD_BORDER = "#B18904";
const COLOR_DESK_FACE = "#190707";
const COLOR_DESK_BODY = "#610B0B";
const COLOR_GROUND = "#E6E6E6";
const COLOR_WALL = COLOR_WHITE;
const COLOR_WALL_PAINT = "#F7D358";
const COLOR_PLATFORM = "#F3E2A9";
const COLOR_COMP_SCREEN = COLOR_BLACK;
const COLOR_COMP_PANEL = "#888";
const COLOR_COMP_DESKTOP = "#58ACFA";
const COLOR_CURTAIN = "#E6E6E6";
const COLOR_CURTAIN_BORDER = COLOR_BLACK;
const COLOR_SPEAKER_BORDER = "#B18904";
const COLOR_SPEAKER_FACE = COLOR_BLACK;

// Axis indicators
/* let zZ = new Zdog.Shape({ addTo: illo, path: [{ move:  { z: 100 } },], stroke: 8, color: '#f00', });
let yY = new Zdog.Shape({ addTo: illo, path: [{ move:  { y: 100 } },], stroke: 8, color: '#0f0', });
let xX = new Zdog.Shape({ addTo: illo, path: [{ move:  { x: 100 } },], stroke: 8, color: '#00f', }); */

// Walls
let wall = new Zdog.Anchor({ addTo: illo, translate: { y: -75, z: -240 } })
let wallBody = new Zdog.Group({ addTo: wall })
let wallWhite = new Zdog.Rect({ addTo: wallBody, width: 480, height: 170, color: COLOR_WALL, fill: true });
let wallPaint =  new Zdog.Rect({ addTo: wallBody, width: 480, height: 90, color: COLOR_WALL_PAINT, fill: true, translate: { y: 120 } });
let wallLeft = wallBody.copyGraph({ addTo: illo, rotate: { y: Math.PI/2 }, translate: { y: -75, x: -240 } });
let wallRight = wallBody.copyGraph({ addTo: illo, rotate: { y: Math.PI/2 }, translate: { y: -75, x: 240 } });
new Zdog.Shape({ addTo: wallLeft, translate: { x: -1000, z: -1000 } });
new Zdog.Shape({ addTo: wallRight, translate: { x: -1000, z: -1000 } });

// Blackboard
let blackboardGroup = new Zdog.Group({ addTo: wall, translate: { y: 75, z: 10 } });
let blackboardGroupBack = new Zdog.Group({ addTo: blackboardGroup });
let blackboardGroupFore = new Zdog.Group({ addTo: blackboardGroup, translate: { z: 10 } });
let blackboard_1 = new Zdog.Box({ addTo: blackboardGroupBack, width: 60, height: 60, depth: 10, color: COLOR_BLACKBOARD_BORDER, rearFace: COLOR_BLACKBOARD_FACE, translate: { x: -90 } });
let blackboard_4 = blackboard_1.copy({ translate: { x: 90 } });
let blackboard_2 = blackboard_1.copy({ addTo: blackboardGroupFore, translate: { x: -30 } });
let blackboard_3 = blackboard_2.copy({ translate: { x: -30 } });
new Zdog.Shape({ addTo: blackboardGroup, visible: false, translate: { x: -1000, y: -1000 } });
new Zdog.Shape({ addTo: blackboardGroup, visible: false, translate: { x: 1000, y: -1000 } });

// Slogan
new Zdog.Text({ addTo: wallBody, font: font, value: "? ? ? ? ? ? ? ?", fontSize: 24, color: COLOR_RED, fill: true, translate: { x: -65, y: 40 } });

let zslogan = new Zdog.Box({ addTo: wallBody, width: 440, height: 40, depth: 1, color: COLOR_RED, fill: true, translate: { y: -20 } });
new Zdog.Text({ addTo: zslogan, font: font, value: "The Road to Success Is Paved with Untiring Effort", fontSize: 18, color: COLOR_WHITE, fill: true, translate: { x: -198, y: 5 } });

// Words on the blackboard
new Zdog.Text({ addTo: blackboard_1, font: font, value: "f(x)=ln x\n  f'(x)", fontSize: 8, color: COLOR_WHITE, fill: true, rotate: { z: Math.PI/16 }, translate: { x: -10 } });
new Zdog.Text({ addTo: blackboard_2, font: font, value: "2Na+\n2H2O=\n  2NaOH\n+H2", fontSize: 8, color: COLOR_WHITE, fill: true, rotate: { z: -Math.PI/16 }, translate: { x: -10, y: 15 } });
new Zdog.Text({ addTo: blackboard_3, font: font, value: "First and\nforemost", fontSize: 8, color: COLOR_WHITE, fill: true, rotate: { z: Math.PI/32 }, translate: { x: -17, y: -10 } });
new Zdog.Text({ addTo: blackboard_3, font: font, value: "F=mgsi0+\nuNcos0", fontSize: 8, color: COLOR_WHITE, fill: true, rotate: { z: -Math.PI/16 }, translate: { x: -14, y: 15 } });
new Zdog.Text({ addTo: blackboard_4, font: font, value: "ATP,[H]", fontSize: 8, color: COLOR_WHITE, fill: true, rotate: { z: -Math.PI/32 }, translate: { x: -10, y: 20 } });
new Zdog.Text({ addTo: blackboard_4, font: font, value: "Yuwen laoshi\nduibuqi\nzhege chajian\nshuru hanzi\nyou bug", fontSize: 6, color: COLOR_WHITE, fill: true, rotate: { z: -Math.PI/32 }, translate: { x: -17, y: 10 } });

let compGroup = new Zdog.Group({ addTo: blackboardGroupBack });
let compScreen = blackboard_1.copy({ addTo: compGroup, width: 90, color: COLOR_COMP_PANEL, rearFace:COLOR_COMP_SCREEN, translate: { x: 15 } });
let compPanel = blackboard_1.copy({ addTo: compGroup, width: 30, color: COLOR_COMP_PANEL, rearFace: COLOR_COMP_PANEL, translate: { x: -45 } });
let compDesktop = new Zdog.Rect({ addTo: compScreen, width: 80, height: 50, fill: true, color: COLOR_COMP_DESKTOP });

// Curtain
let curtainGroup = new Zdog.Group({ addTo: wall, translate:{ y: 5, z: 5 } });
new Zdog.Cylinder({ addTo: curtainGroup, length: 120, color: COLOR_CURTAIN, diameter: 5, rotate: { y: Math.PI/2 } });
new Zdog.Cylinder({ addTo: curtainGroup, length: 100, color: COLOR_CURTAIN_BORDER, diameter: 2.5, rotate: { y: Math.PI/2 }, translate: { y: 3.75 } });

// Speaker
let speakerGroup = new Zdog.Group({ addTo: wall, translate:{ y: 10, z: 5 } });
let speaker = new Zdog.Box({ addTo: speakerGroup, width: 10, height: 15, depth: 10, color: COLOR_SPEAKER_BORDER, rearFace: COLOR_SPEAKER_FACE, translate: { x: 100 } });
speaker.copy({ translate: { x: -100 } });

// Desks
let deskGroup = new Zdog.Group({ addTo: illo });
let deskBodyGroup = new Zdog.Group();
let deskBody = new Zdog.Box({ addTo: deskBodyGroup, width: 40, height: 20, depth: 30, color: COLOR_DESK_BODY});
let deskLeg = new Zdog.Box({ addTo: deskBodyGroup, width: 5, height: 40, depth: 5, color: COLOR_DESK_BODY, translate: { x: 17.5, y: 30, z: 12.5 } });
let deskTop = new Zdog.Box({ width: 40, height: 30, stroke: 5, fill: true, color: COLOR_DESK_FACE, rotate: { x: Math.PI/2 }, translate: { y: -12.5 } });
let deskDrawer = new Zdog.Box({ width: 30, height: 10, depth: 1, stroke: false, fill: true, color: COLOR_DESK_FACE, translate: { z: 16 } });

deskLeg.copy({ translate: { x: -17.5, y: 30, z: 12.5 } });
deskLeg.copy({ translate: { x: 17.5, y: 30, z: -12.5 } });
deskLeg.copy({ translate: { x: -17.5, y: 30, z: -12.5 } });
let deskLegH = new Zdog.Box({ addTo: deskBodyGroup, width: 40, height: 5, depth: 5, color: COLOR_DESK_BODY, translate: { y: 40, z: -12.5 } });
deskLegH.copy({ width: 30, rotate: { y: Math.PI/2 }, translate: { x: 17.5, y: 40 } });
deskLegH.copy({ width: 30, rotate: { y: Math.PI/2 }, translate: { x: -17.5, y: 40 } });

let deskTranslate = [[-200, -220], [-150, -220], [-150, -80], [-50, -80], [50, -80], [150, -80]];
let desk = new Array();
for(i in deskTranslate) {
    desk.push(new Zdog.Anchor({ addTo: deskGroup, translate: { x: deskTranslate[i][0], y: 47.5, z: deskTranslate[i][1] } }))
    deskBodyGroup.copyGraph({ addTo: desk[i] });
    deskTop.copyGraph({ addTo: desk[i], translate: { y: -12.5 } });
    deskDrawer.copyGraph({ addTo: desk[i], translate: { z: 16 } });
    new Zdog.Shape({ addTo: desk[i], translate: { y: -10000, z: -100 } });
}

// Platform
let platformGroup = new Zdog.Group({ addTo: illo, translate: { y: 90, z: -190 } });
new Zdog.Box({ addTo: platformGroup, width: 240, height: 20, depth: 100, color: COLOR_BLACKBOARD_BORDER });
new Zdog.Box({ addTo: platformGroup, width: 120, height: 80, depth: 30, color: COLOR_BLACKBOARD_BORDER, translate: { y: -50, z: 30 } });
new Zdog.Shape({ addTo: platformGroup, translate: { y: -10000, z: -100 } })

// Posters, Clock and Windows
new Zdog.Rect({ addTo: wallLeft, width: 40, height: 60, fill: true, color: "#F6CEEC", translate: { x: -60 } })
new Zdog.Rect({ addTo: wallLeft, width: 40, height: 60, fill: true, color: "#CEF6F5", translate: { x: -110 } })
new Zdog.Rect({ addTo: wallRight, width: 80, height: 120, fill: true, color: "#2E9AFE", translate: { x: -110 } })
new Zdog.Rect({ addTo: wallRight, width: 80, height: 120, fill: true, color: "#2E9AFE" })
new Zdog.Rect({ addTo: wallRight, width: 80, height: 120, fill: true, color: "#2E9AFE", translate: { x: 110 } })
let clock = new Zdog.Cylinder({ addTo: wallLeft, diameter: 40, length: 5, fill: true, color: COLOR_BLACK, backface: COLOR_WHITE })
new Zdog.Shape({ addTo: clock, stroke: 2, closed: false, color: COLOR_BLACK, path: [ { x: 0, y: -15 }, { x: 0, y: 0 }, { x: -12, y: 0 } ] });

animate();