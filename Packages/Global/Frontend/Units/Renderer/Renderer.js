// 19.02.2024


export class Renderer {
    _active = false;
    _animationFrame_id = 0;
    _dt = 0;
    _duration = 0;
    _render = this._render.bind(this);
    _timeStamp = 0;
    _timeStamp_start = 0;


    _render() {
        let timeStamp = performance.now();
        this._dt = (timeStamp - this._timeStamp) / 1e3;
        this._timeStamp = timeStamp;
        this._duration = this._timeStamp - this._timeStamp_start;

        this.render(this);

        if (!this._active) return;

        this._animationFrame_id = requestAnimationFrame(this._render);
    }


    constructor(opts = {}) {
        if (!opts) return;

        this.init(opts);
    }

    init({render = this.render} = {}) {
        this.render = render;
    }

    render(renderer = null) {}

    start(resume = false) {
        if (this._active) return;

        if (!resume) {
            this._duration = 0;
        }

        this._active = true;
        this._animationFrame_id = requestAnimationFrame(this._render);
        this._timeStamp_start = performance.now() - this._duration;
        this._timeStamp = this._timeStamp_start;
    }

    stop() {
        if (!this._active) return;

        this._active = false;
        cancelAnimationFrame(this._animationFrame_id);
    }
}
