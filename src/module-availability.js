// Remove a module from this list when its lesson is ready to be released.
export const modulesUnderDevelopment = Object.freeze({});

export const isModuleLocked = id => Object.hasOwn(modulesUnderDevelopment, id);
