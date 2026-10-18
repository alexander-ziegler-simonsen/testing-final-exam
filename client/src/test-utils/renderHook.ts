import { act, createElement } from "react";
import { createRoot, type Root } from "react-dom/client";

// Tells React it's running in a test, so updates wrapped in act() are applied before act() returns.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const mountedRoots = new Set<Root>();

// Runs a hook inside a tiny component that renders nothing, so the hook can be tested on its own.
// result.current always holds the hook's latest return value; rerender passes the hook new props.
export function renderHook<Props, Result>(hook: (props: Props) => Result, options: { initialProps?: Props } = {}) {
    const result = {} as { current: Result };

    function HookHost({ props }: { props: Props }) {
        result.current = hook(props);
        return null;
    }

    const root = createRoot(document.createElement("div"));
    mountedRoots.add(root);

    const render = (props: Props) => act(() => root.render(createElement(HookHost, { props })));
    render(options.initialProps as Props);

    return { result, rerender: render };
}

// Unmounts every hook rendered so far - call it in afterEach so tests don't leak into each other.
export function cleanup() {
    for (const root of mountedRoots) {
        act(() => root.unmount());
    }
    mountedRoots.clear();
}

export { act };
