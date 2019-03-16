interface params {
    slackbot: boolean, 
    icon_emoji: string
}

interface botparam {
    token: string,
    name: string
}

interface userId {
    [key: string]: string
}

interface userName {
    [key: string]: string
}

interface slackResponse {
    type: string,
    user: string,
    text: string,
    channel: string,
    [key: string]: any
}

const api = {
    "memeGenerator": "http://version1.api.memegenerator.net//Instances_Search?q={0}&pageIndex=0&pageSize=12&apiKey={1}",
    "weatherMap": "http://api.openweathermap.org/data/2.5/weather?q={0}&units=metric&appid={1}",
}

const responses = {
    "thanks": [
        "You’re welcome",
        "You are welcome", 
        "No problem!", 
        "Not at all",
        "Don't mention it!",
        "It's not bother",
        "It's my pleasure!",
        "My pleasure dear",
        "It's allright",
        "It's nothing",
        "Sure thing"
    ],
    "greeting": [
        "Hey dude!", 
        "Hey man!",
        "Hey!",
        "What's up?", 
        "What's new?",
        "What's going on?",
        "How's your day?",
        "How's your day going?",
        "Hey man!",
        "Hi",
        "Hi, how are you doing?",
        "How's it going?",
        "Good to see you!"
    ], 
    "jokes": [
        "Did you hear about the restaurant on the moon? Great food, no atmosphere.",
        "What do you call a fake noodle? An Impasta.",
        "How many apples grow on a tree? All of them.",
        "Want to hear a joke about paper? Nevermind it's tearable.",
        "I just watched a program about beavers. It was the best dam program I've ever seen.",
        "Why did the coffee file a police report? It got mugged.",
        "How does a penguin build it's house? Igloos it together.",
        "Dad, did you get a haircut? No I got them all cut.",
        "What do you call a Mexican who has lost his car? Carlos.",
        "Dad, can you put my shoes on? No, I don't think they'll fit me.",
        "Why did the scarecrow win an award? Because he was outstanding in his field.",
        "Why don't skeletons ever go trick or treating? Because they have no body to go with.",
        "Ill call you later. Don't call me later, call me Dad.",
        "What do you call an elephant that doesn't matter? An irrelephant",
        "Want to hear a joke about construction? I'm still working on it.",
        "What do you call cheese that isn't yours? Nacho Cheese.",
        "Why couldn't the bicycle stand up by itself? It was two tired.",
        "What did the grape do when he got stepped on? He let out a little wine.",
        "I wouldn't buy anything with velcro. It's a total rip-off.",
        "The shovel was a ground-breaking invention.",
        "Dad, can you put the cat out? I didn't know it was on fire.",
        "This graveyard looks overcrowded. People must be dying to get in there.",
        "Whenever the cashier at the grocery store asks my dad if he would like the milk in a bag he replies, 'No, just leave it in the carton!'",
        "5/4 of people admit that they’re bad with fractions.",
        "Two goldfish are in a tank. One says to the other, 'do you know how to drive this thing?'",
        "What do you call a man with a rubber toe? Roberto.",
        "What do you call a fat psychic? A four-chin teller.",
        "I would avoid the sushi if I was you. It’s a little fishy.",
        "To the man in the wheelchair that stole my camouflage jacket... You can hide but you can't run.",
        "The rotation of earth really makes my day.",
        "I thought about going on an all-almond diet. But that's just nuts",
        "What's brown and sticky? A stick.",
        "I’ve never gone to a gun range before. I decided to give it a shot!",
        "Why do you never see elephants hiding in trees? Because they're so good at it.",
        "Did you hear about the kidnapping at school? It's fine, he woke up.",
        "A furniture store keeps calling me. All I wanted was one night stand.",
        "I used to work in a shoe recycling shop. It was sole destroying.",
        "Did I tell you the time I fell in love during a backflip? I was heels over head.",
        "I don’t play soccer because I enjoy the sport. I’m just doing it for kicks.",
        "People don’t like having to bend over to get their drinks. We really need to raise the bar."
    ], 
    "pickup": [
        "Are you French because Eiffel for you.",
        "Is that a mirror in your pocket? Cause I can see myself in your pants!",
        "Are you religious? Cause you’re the answer to all my prayers.",
        "Hey, tie your shoes! I don’t want you falling for anyone else.",
        "You must be Jamaican, because Jamaican me crazy.",
        "What has 36 teeth and holds back the Incredible Hulk? My zipper.",
        "Somebody call the cops, because it’s got to be illegal to look that good!",
        "I must be a snowflake, because I've fallen for you.",
        "I know you're busy today, but can you add me to your to-do list?",
        "If you were a steak you would be well done.",
        "Hello, I'm a thief, and I'm here to steal your heart.",
        "Are you cake? Cause I want a piece of that.",
        "My love for you is like diarrhoea, I just can't hold it in.",
        "Are you lost ma'am? Because heaven is a long way from here.",
        "There is something wrong with my cell phone. It doesn't have your number in it.",
        "If you were a library book, I would check you out.",
        "Are you a cat because I'm feline a connection between us",
        "If I were to ask you out on a date, would your answer be the same as the answer to this question?",
        "If nothing lasts forever, will you be my nothing?",
        "I'm new in town. Could you give me directions to your apartment?",
        "I must be in a museum, because you truly are a work of art.",
        "You spend so much time in my mind, I should charge you rent.",
        "My lips are like skittles. Wanna taste the rainbow?",
        "Well, here I am. What were your other two wishes?",
        "Are you from Tennessee? Because you're the only 10 I see!",
        "Are you a beaver? Cause daaaaaaaaam!",
        "Life without you is like a broken pencil... pointless.",
        "Do you want to see a picture of a beautiful person? (hold up a mirror)",
        "Is your body from McDonald's? Cause I'm lovin' it!"
    ]
}

const messages = {
    "greeting": [
        "hi",
        "hello",
        "hey",
        "greetings"
    ],
    "return": [
        "Here you go <@{0}>! {1} \n {2}",
        "Sure thing <@{0}>! {1} \n {2}",
        "There you go <@{0}>! {1} \n {2}"
    ],
    "emojis": [
        "\u{1F335}",
        "\u{1F4C5}",
        "\u{2708}",
        "\u{2697}",
        "\u{1F620}",
        "\u{1F504}",
        "\u{1F916}",
        "\u{1F339}",
        "\u{1F6A3}",
        "\u{1F3C3}",
        ":stan:",
        ":hd:",
        ":db"
    ]
}

export { params, 
        botparam, 
        userId, 
        userName, 
        slackResponse, 
        responses,
        messages,
        api }