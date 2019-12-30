import * as Matterjs from "matter-js";

interface MatterAliases {
    Engine: any,
    Render: any,
    Runner: any,
    Composites: any,
    MouseConstraint: any,
    Mouse: any,
    World: any,
    Bodies: any,
    Constraint: any,
    Events: any,
    Query: any
}

const Matter: MatterAliases = {
    Engine: Matterjs.Engine,
    Render: Matterjs.Render,
    Runner: Matterjs.Runner,
    Composites: Matterjs.Composites,
    MouseConstraint: Matterjs.MouseConstraint,
    Mouse: Matterjs.Mouse,
    World: Matterjs.World,
    Bodies: Matterjs.Bodies,
    Constraint: Matterjs.Constraint,
    Events: Matterjs.Events,
    Query: Matterjs.Query
};

export default Matter;