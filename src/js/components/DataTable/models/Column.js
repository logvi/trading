export default class Column {
    constructor({
        name,
        title,
        visible,
        sortable,
        renderer
    }) {
        this.name = name;
        this.title = title;
        this.visible = visible;
        this.renderer = renderer;
        this.sortable = sortable;
    }
}