import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
} from 'chart.js'
import React from 'react'
import { Bar } from 'react-chartjs-2'


export const ArtistLeaderboard = ({ labels, scores }: { labels: string[], scores: number[] }) => {

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );
    const options = {
        indexAxis: 'y' as const,
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'right' as const,
            },
            title: {
                display: true,
                text: 'Artist leaderboard',
            },
        },
    };
    const data: ChartData<"bar", number[], string> = {
        labels,
        datasets: [
            {
                label: 'score',
                data: scores,
                borderWidth: 1,
                backgroundColor: '#254773'
            }
        ]
    }

    return (
        <section className='w-full sm:w-4/6 items-center mx-auto'>
        <Bar options={options} data={data} />
        </section>
    )

}
