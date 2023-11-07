'use client'

import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend);

export const GenreChart = ({ genrestats }: { genrestats: Map<string, number> }) => {

    // @see https://react-chartjs-2.js.org/examples/doughnut-chart
    const user_data: ChartData<"doughnut", any[], any> = {
        labels: Array.from(genrestats.keys()) as any[],
        datasets: [{
            label: 'times',
            data: Array.from(genrestats.values()) as any[],
            borderWidth: 1
        }]
    }

    return (
        <Doughnut data={user_data} />
    )
}