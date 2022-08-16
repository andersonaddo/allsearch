type NonEmptyArray<T> = T[] & { 0: T }; //https://stackoverflow.com/a/58778817/5731044

interface HolidayBackgroundSpec{
    month: number //Starts from 0!!
    day: number //Starts from 1
    query: NonEmptyArray<string>
}

export const holidaySpecs : Array<HolidayBackgroundSpec> = [
    { //Christmas
        month: 11,
        day: 25,
        query: ["christmas", "presents", "holiday", "christmas tree"]
    },
    { //Halloween
        month: 9,
        day: 31,
        query: ["halloween", "candy", "night sky", "full moon", "scary"]
    },
    { //Hanukkah (date shifts but whatever)
        month: 11,
        day: 18,
        query: ["Hanukkah", "hebrew", "torah"]
    },
    { //New Years
        month: 0,
        day: 1,
        query: ["fireworks", "new years", "champagne", "confetti"]
    },
    { //Easter (date shifts but whatever)
        month: 3,
        day: 20,
        query: ["bunny", "easter", "easter eggs", "chocolate egg"]
    },
    { //Valentines 
        month: 1,
        day: 14,
        query: ["Valentines", "heart", "roses", "marriage"]
    },
    { //Diwali (date shifts but whatever)
        month: 9,
        day: 26,
        query: ["Diwali", "Lord Krishna", "Vishnu"]
    },
    { //Bodhi Day
        month: 11,
        day: 9,
        query: ["bodhi", "buddha", "buddhist monk", "buddhist nun"]
    },
    { //Day of the dead
        month: 10,
        day: 1,
        query: ["day of the dead", "skull", "Calavera"]
    },
    { //Holi (date shifts but whatever)
        month: 2,
        day: 10,
        query: ["holi", "colored powder"]
    }
]