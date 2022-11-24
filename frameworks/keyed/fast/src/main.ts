import { provideFASTDesignSystem } from "@microsoft/fast-components";
import {
    FASTElement,
    customElement,
    html,
    repeat,
    observable,
    attr,
} from "@microsoft/fast-element";
import { reactive } from "@microsoft/fast-element/state";
import { Store, StoreDataRow } from "./store";

let rowId = 1;
const adjectives = [
        "pretty",
        "large",
        "big",
        "small",
        "tall",
        "short",
        "long",
        "handsome",
        "plain",
        "quaint",
        "clean",
        "elegant",
        "easy",
        "angry",
        "crazy",
        "helpful",
        "mushy",
        "odd",
        "unsightly",
        "adorable",
        "important",
        "inexpensive",
        "cheap",
        "expensive",
        "fancy",
    ],
    colours = [
        "red",
        "yellow",
        "blue",
        "green",
        "pink",
        "brown",
        "purple",
        "brown",
        "white",
        "black",
        "orange",
    ],
    nouns = [
        "table",
        "chair",
        "house",
        "bbq",
        "desk",
        "car",
        "pony",
        "cookie",
        "sandwich",
        "burger",
        "pizza",
        "mouse",
        "keyboard",
    ];

function _random(max) {
    return Math.round(Math.random() * 1000) % max;
}

function buildData(count = 1000) {
    const data = new Array(count);
    for (var i = 0; i < count; i++) {
        data[i] = {
            id: rowId++,
            label:
                adjectives[_random(adjectives.length)] +
                " " +
                colours[_random(colours.length)] +
                " " +
                nouns[_random(nouns.length)],
        };
    }
    return data;
}

const store = new Store();

const dataRowTemplate = html<DataRow>`
    <tr
        id=${(x) => x.id}
        class=${(x, c) => (x.id == c.parent._selected ? "danger" : "")}
    >
        <td class="col-md-1">${(x) => x.id}</td>
        <td class="col-md-4">
            <a data-action="select" data-id=${(x) => x.id}>${(x) => x.label}</a>
        </td>
        <td class="col-md-1">
            <a>
                <span
                    class="glyphicon glyphicon-remove"
                    aria-hidden="true"
                    data-action="remove"
                    data-id=${(x) => x.id}
                ></span>
            </a>
        </td>
        <td class="col-md-6"></td>
    </tr>
`;

@customElement({
    name: "data-row",
    template: dataRowTemplate,
})
class DataRow extends FASTElement {
    @attr id: string;
    @attr label: string;
}

const template = html<MainElement>`
    <link href="/css/currentStyle.css" rel="stylesheet" />
    <div class="container">
        <div class="jumbotron">
            <div class="row">
                <div class="col-md-6">
                    <h1>Fast keyed</h1>
                </div>
                <div class="col-md-6">
                    <div class="row">
                        <div class="col-sm-6 smallpad">
                            <button
                                type="button"
                                class="btn btn-primary btn-block"
                                id="run"
                                @click=${(x) => x._run()}
                            >
                                Create 1,000 rows
                            </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button
                                type="button"
                                class="btn btn-primary btn-block"
                                id="runlots"
                                @click=${(x) => x._runLots()}
                            >
                                Create 10,000 rows
                            </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button
                                type="button"
                                class="btn btn-primary btn-block"
                                id="add"
                                @click=${(x) => x._add()}
                            >
                                Append 1,000 rows
                            </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button
                                type="button"
                                class="btn btn-primary btn-block"
                                id="update"
                                @click=${(x) => x._update()}
                            >
                                Update every 10th row
                            </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button
                                type="button"
                                class="btn btn-primary btn-block"
                                id="clear"
                                @click=${(x) => x._clear()}
                            >
                                Clear
                            </button>
                        </div>
                        <div class="col-sm-6 smallpad">
                            <button
                                type="button"
                                class="btn btn-primary btn-block"
                                id="swaprows"
                                @click=${(x) => x._swapRows()}
                            >
                                Swap Rows
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <table
            class="table table-hover table-striped test-data"
            @click=${(x, c) => x._handleClick(c.event)}
        >
            <tbody>
                ${repeat(
                    (x) => x._rows,
                    html<StoreDataRow>`<tr
                        id=${(x) => x.id}
                        class=${(x, c) =>
                            x.id == c.parent._selected ? "danger" : ""}
                    >
                        <td class="col-md-1">${(x) => x.id}</td>
                        <td class="col-md-4">
                            <a data-action="select" data-id=${(x) => x.id}
                                >${(x) => x.label}</a
                            >
                        </td>
                        <td class="col-md-1">
                            <a>
                                <span
                                    class="glyphicon glyphicon-remove"
                                    aria-hidden="true"
                                    data-action="remove"
                                    data-id=${(x) => x.id}
                                ></span>
                            </a>
                        </td>
                        <td class="col-md-6"></td>
                    </tr>`,
                    { positioning: true, recycle: false }
                )}
            </tbody>
        </table>
        <span
            class="preloadicon glyphicon glyphicon-remove"
            aria-hidden="true"
        ></span>
    </div>
`;

@customElement({
    name: "main-element",
    template,
})
class MainElement extends FASTElement {
    @observable _rows = store.data;

    @observable _selected = store.selected;

    _handleClick(e) {
        const { action, id } = e.target.dataset;
        if (action && id) {
            this["_" + action](id);
        }
    }
    _add() {
        this._rows = buildData().map((x) => reactive(x));
        this._sync();
    }
    _remove(id) {
        store.delete(id);
        this._sync();
    }
    _select(id) {
        store.select(id);
        this._sync();
    }
    _run() {
        store.run();
        this._sync();
    }
    _update() {
        store.update();
        this._sync();
    }
    _runLots() {
        store.runLots();
        this._sync();
    }
    _clear() {
        store.clear();
        this._sync();
    }
    _swapRows() {
        store.swapRows();
        this._sync();
    }
    _sync() {
        this._rows = store.data;
        this._selected = store.selected;
    }
}

provideFASTDesignSystem().register(DataRow, MainElement);
