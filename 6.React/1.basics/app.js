/**
    <div id="parent">
        <div id="child">
            <h1>H1 tag</h1>
            <h2>H2 tag</h2>
        </div>
    </div>
*/

// Note : create element creates an object

const h1 = React.createElement("h1", {}, "H1 tag");
const h2 = React.createElement("h2", {}, "H2 tag");
const child1 = React.createElement("div", { id: "child" }, [h1, h2]);
const child2 = React.createElement("div", { id: "child" }, [h1, h2]);
const parent = React.createElement("div", { id: "parent" }, [child1, child2]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(parent);
