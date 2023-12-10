import { Winner } from './interface.winner'

export interface Poll {
    time: any | number,
    past_results: any | Winner[]
}