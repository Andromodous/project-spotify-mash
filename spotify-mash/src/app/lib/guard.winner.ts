import { Winner } from "./interface.winner"

export function isWinner(arg: any | Winner): arg is Winner { //custom type guard
    return (typeof arg === 'object' && 'artist' in arg && 'votes' in arg && 'poll_date' in arg)
}