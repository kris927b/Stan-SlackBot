function Format(str: string, args: Array<string>) {
    let a = str;
    for (let k in args) {
        a = a.replace("{"+ k +"}", args[k]);
    }
    return a
}

function getCityName(text: string): string {
    if (text.includes("in")) {
        let arr = text.split(" ");
        let index = arr.findIndex((key: string) => {
            return key === "in";
        });
        return arr.slice(index+1).join(" ");
    } else {
        return "Copenhagen";
    }
}

export { Format, getCityName };