import * as data from './data';

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

function findGreeting(text: string): boolean {
    let greeting: boolean = false;
    data.messages.greeting.forEach(greet => {
        if (text.includes(greet)) {
            greeting = true;
        }
    });
    return greeting;
}

function findRequest(text: string): boolean {
    if ((text.includes("send") && text.includes("a")) || 
        text.includes("send a") || text.includes("send me")) {
        return true;
    }
    return false;
}

function getCategory(text: string): string {
    if (text.match(/with|of/g)) {
        let arr = text.split(" ");
        let index = arr.findIndex((key: string) => {
            return key === 'of' || key === 'with';
        });
        return arr.slice(index+1).join(' ');
    } else {
        return 'random';
    }
}

export { Format, 
        getCityName, 
        findGreeting, 
        findRequest, 
        getCategory };