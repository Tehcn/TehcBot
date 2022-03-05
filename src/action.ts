class Action {
    public name: string;
    public run: () => void;

    constructor(name: string, run: () => void) {
        this.name = name;
        this.run = run;
    }

    perform() {
        this.run();
    }
}

export { Action };