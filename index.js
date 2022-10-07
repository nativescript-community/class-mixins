
export function applyMixins(
    derivedCtor,
    baseCtors,
    options
) {
    const omits = options && options.omit ? options.omit : [];
    baseCtors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            if (omits.indexOf(name) !== -1) {
                return;
            }
            const descriptor = Object.getOwnPropertyDescriptor(baseCtor.prototype, name);

            if (name === 'constructor') return;
            if (descriptor && (descriptor.get || descriptor.set)) {
                Object.defineProperty(derivedCtor.prototype, name, descriptor);
            } else {
                const oldImpl = derivedCtor.prototype[name];
                if (!oldImpl) {
                    derivedCtor.prototype[name] = baseCtor.prototype[name];
                } else {
                    derivedCtor.prototype[name] = function (...args) {
                        if (options) {
                            if (options.override) {
                                return baseCtor.prototype[name].apply(this, args);
                            } else if (options.after) {
                                oldImpl.apply(this, args);
                                return baseCtor.prototype[name].apply(this, args);
                            } else {
                                baseCtor.prototype[name].apply(this, args);
                                return oldImpl.apply(this, args);
                            }
                        } else {
                            baseCtor.prototype[name].apply(this, args);
                            return oldImpl.apply(this, args);
                        }
                    };
                }
            }
        });
        Object.getOwnPropertySymbols(baseCtor.prototype).forEach((symbol) => {
            if (omits.indexOf(symbol) !== -1) {
                return;
            }
            const oldImpl = derivedCtor.prototype[symbol];
            if (!oldImpl) {
                derivedCtor.prototype[symbol] = baseCtor.prototype[symbol];
            } else {
                derivedCtor.prototype[symbol] = function (...args) {
                    if (options) {
                        if (options.override) {
                            return baseCtor.prototype[symbol].apply(this, args);
                        } else if (options.after) {
                            oldImpl.apply(this, args);
                            return baseCtor.prototype[symbol].apply(this, args);
                        } else {
                            baseCtor.prototype[symbol].apply(this, args);
                            return oldImpl.apply(this, args);
                        }
                    } else {
                        baseCtor.prototype[symbol].apply(this, args);
                        return oldImpl.apply(this, args);
                    }
                };
            }
        });
    });
}
