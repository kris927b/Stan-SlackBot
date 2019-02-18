function Format(str: string, args: Array<string>) {
    let a = str;
    for (let k in args) {
        a = a.replace("{"+ k +"}", args[k]);
    }
    return a
}

export { Format };