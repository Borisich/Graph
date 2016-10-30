const listeners = {};

function listen (action, fn){
    listeners[action] = listeners[action] || [];
    listeners[action].push(fn);
}

function emit (action, ...data){
    console.log ('emit', action, ...data);
    const fns = listeners[action];
    if (fns){
        fns.forEach((fn=>fn(...data)));
    }
}