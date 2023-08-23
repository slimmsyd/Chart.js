
import styles from '../styles/Home.module.css'
import CandlestickChart from './components/Candlestic'
import ChartComponent from './components/chart_component'
import ChartContents from './components/chat_contents'
import HeartIcon from '../public/chart_assets/heart-icon.png';
import Image from 'next/image';

import Chartleft from './components/chart_data/chart_left';
import Chartright from './components/chart_right';
export default function Home()

{
    return(
        
        <div>
            <ChartComponent />

            <div className = {styles.grid_main}>

                <Chartleft />
                <CandlestickChart />
                <ChartContents />
                <Chartright />



               

            </div>


             
        </div>
    )



}